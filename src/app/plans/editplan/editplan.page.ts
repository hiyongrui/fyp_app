import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { TemplateService } from 'src/app/services/template.service';
import { SymptomActionService } from 'src/app/services/symptomaction.service';
import { LoadingController, IonList, IonItemSliding, AlertController, Events } from '@ionic/angular';
import * as jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editplan',
  templateUrl: './editplan.page.html',
  styleUrls: ['./editplan.page.scss'],
})
export class EditplanPage implements OnInit {

  submitted = false;
  isDisabled: boolean = true;
  details = {} as any;
  backUpPlanDetails = [];
  android: boolean;

  constructor(private PlanService: PlanService, private activatedRoute: ActivatedRoute, private templateService: TemplateService, private settingService: SymptomActionService,
    private router: Router, private file: File, private loadingController: LoadingController, private fileOpener: FileOpener, public formBuilder: FormBuilder, 
    private alertCtrl: AlertController, private event: Events) {
  }

  something = this.formBuilder.group({
    detailname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(/(?!\s*$)/), Validators.required])],  
    detailnric: ['', Validators.compose([Validators.minLength(5), Validators.pattern(/(?!\s*$)/), Validators.required])],
    detailtcs: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(/(?!\s*$)/), Validators.required])],
    detailcontact: ['', Validators.compose([Validators.minLength(5), Validators.pattern(/^[0-9]+$/), Validators.required])],
  });

  ngOnInit() {}

  getApptArray() {
    return this.templateService.getApptArray();
  }

  backViewPlan(id) {
    this.isDisabled ? this.templateService.resetArray()
      : (
        this.something.controls.detailname.setValue(this.backUpPlanDetails[0]),
        this.something.controls.detailnric.setValue(this.backUpPlanDetails[1]),
        this.something.controls.detailtcs.setValue(this.backUpPlanDetails[2]),
        this.something.controls.detailcontact.setValue(this.backUpPlanDetails[3]),
        this.templateService.goToViewPageFromEdit(),
        this.router.navigateByUrl('/tabs/plans/editplan/' + id),
        this.isDisabled = true
      )
  }

  ionViewWillEnter() {
    this.android = this.templateService.checkPlatformAndroid();
    let id = this.activatedRoute.snapshot.paramMap.get('item');
    this.templateService.setGlobalSettings();
    this.PlanService.getEditDetails(id).then(everything => {
      [].concat(...everything.templates).forEach(eachArray => {
        this.settingService.getOneImage("Symptom", eachArray.symptom.symptomID).then(oneImg => {
          eachArray.symptom.img = oneImg;
        });
        eachArray.combined.forEach(oneCombined => {
          this.settingService.getOneImage("Action", oneCombined.actionID).then(actionImg => {
            oneCombined.img = actionImg;
          })
        })
      });
      let obj = {
        template: [].concat(...everything.templates)
      }
      this.templateService.filterArray(obj);
      this.details = everything;
      this.defaultLanguage = everything.language;
      this.templateService.appointment = everything.appointment;
      this.something.controls['detailname'].setValue(this.details.name);
      this.something.controls.detailnric.setValue(this.details.nric);
      this.something.controls.detailtcs.setValue(this.details.cname);
      this.something.controls.detailcontact.setValue(this.details.ccontact);
    });
  }

  frontViewData = this.templateService.frontViewData;
  checked = this.templateService.checked;
  defaultLanguage = 0;

  getArray(id) {
    return this.templateService.getArray(id);
  }
  checkType(id) {
    return this.templateService.getArray(id).length > 0 ? true : false
  }
  
  inputTriggered = false;
  inputFocus = () => this.inputTriggered = true;
  pressEvent(type, thisObject, arrayID, combinedIndex) {
    this.mylist.closeSlidingItems();
    this.apptList.closeSlidingItems();
    !this.android ?
      this.inputTriggered ? this.inputTriggered = false : this.templateService.pressEvent(type, thisObject, arrayID, combinedIndex)
      : this.templateService.pressEvent(type, thisObject, arrayID, combinedIndex)
  }
  clickEvent(type, wholeItem, arrayID, combinedIndex) {
    this.templateService.clickEvent(type, wholeItem, arrayID, combinedIndex);
  }

  presentSymptomActionModal(symptomOrAction, item) { //https://ionicframework.com/docs/api/action-sheet
    this.templateService.presentSymptomActionModal(symptomOrAction, item, this.defaultLanguage);
  }
  addNewCriticalArray(type, id) {
    this.templateService.addNewCriticalArray(type, id, this.defaultLanguage);
  }
  popUp(id) {
    this.templateService.popUp(id, this.defaultLanguage);
  }
  clearArray() {
    this.templateService.clearArray();
    // this.router.navigateByUrl("/tabs/plans/editplan/" + this.details.id);
  }
  deleteArray() {
    this.templateService.deleteArray();
    this.templateService.presentToastWithOptions("Deleted items!");
  }

  popOverController(event) {
    let menuOptions = ["Edit", "Rename", "Duplicate", "Create Crisis Template", "Export to PDF", "Share plan"];
    this.templateService.openPopover(menuOptions, event).then(popover => {
      popover.present();
      popover.onDidDismiss().then((data) => {
        data.data && this.callAction(data.data);
      });
    })
  }

  callAction(type) { //https://ultimatecourses.com/blog/deprecating-the-switch-statement-for-object-literals
    var call = {
      'Edit': () => this.callEdit(),
      'Rename': () => this.askForName('rename'),
      'Duplicate': () => this.askForName('duplicate'),
      "Create Crisis Template": () => this.askForName("Create Crisis Template"),
      "Export to PDF": () => this.exportToPDF(),
      "Share plan": () => this.share()
    };
    call[type]();
  }

  loading: any;
  async presentLoading(msg) {
    this.loading = await this.loadingController.create({
      message: msg
    });
    return await this.loading.present();
  }

  exportToPDF() {
    this.presentLoading('Creating PDF file...');
    const directory = this.file.dataDirectory;
    const div = document.getElementById('Html2PDF'); //https://github.com/MarouaneSH/Ionic-jsPdf-Html2Canvas, https://stackoverflow.com/questions/43730612/opening-pdf-file-in-ionic-2-app

    let width = div.clientWidth * 3;
    let height = div.clientHeight * 3;
    let millimeters = { width, height };
    millimeters.width = Math.floor(width * 0.264583);
    millimeters.height = Math.floor(height * 0.264583);

    let scale = 2; //https://github.com/tsayen/dom-to-image/issues/69
    domtoimage.toPng(div, { height: div.offsetHeight * 2, width: div.offsetWidth * 2, style: { transform: `scale(${scale}) translate(${div.offsetWidth / 2 / scale}px, ${div.offsetHeight / 2 / scale}px)` } }).then(dataUrl => {
    
      const doc = new jsPDF('p', 'mm', 'a4', true);
      doc.deletePage(1); //https://stackoverflow.com/questions/29578721/image-in-pdf-cut-off-how-to-make-a-canvas-fit-entirely-in-a-pdf-page/42295522#42295522
      doc.addPage(millimeters.width * 2, millimeters.height * 1.95);
      doc.addImage(dataUrl, 'PNG', 0, 10, doc.internal.pageSize.width, doc.internal.pageSize.height, undefined, 'FAST');

      // doc.save('pdfDocument.pdf'); //for website

      let pdfOutput = doc.output();
      // using ArrayBuffer will allow you to put image inside PDF
      let buffer = new ArrayBuffer(pdfOutput.length);
      let array = new Uint8Array(buffer);
      for (var i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
      }

      // Name of pdf
      const fileName = "CrisisPlan.pdf";
      //Writing File to Device  
      this.file.writeFile(directory, fileName, buffer, { replace: true }).then(success => { //https://ourcodeworld.com/articles/read/38/how-to-capture-an-image-from-a-dom-element-with-javascript
        this.loading.dismiss();
        this.templateService.presentToastWithOptions("PDF file has been created!");
        this.fileOpener.open(success.nativeURL, "application/pdf").catch(() => {
          this.alertCtrl.create({
            header: "No applications found to open PDF",
            message: "Try searching Google Play Store for a PDF Viewer app, or do you want to install Adobe Acrobat PDF Viewer app?",
            buttons: [
              {
                text: 'CANCEL',
                role: 'cancel',
                cssClass: 'cancelBlueBtn'
              },
              {
                text: 'OK',
                cssClass: 'okBlueBtn',
                handler: () => window.open("https://play.google.com/store/apps/details?id=com.adobe.reader&hl=en", "_system")
              }
            ]
          }).then(alert => alert.present())
          this.templateService.presentToastWithOptions("Please install a PDF Viewer app such as Adobe Acrobat!")
        });
      }).catch((error) => this.templateService.throwError("Error exporting PDF!!!", error));
    })
  }

  callEdit() {
    this.backUpPlanDetails = [this.details.name, this.details.nric, this.details.cname, this.details.ccontact];
    this.isDisabled = false;
    this.templateService.callEdit(this.defaultLanguage);
  }

  savePage(id, formValue) {
    let arrayForm = [this.something.controls.detailcontact, this.something.controls.detailname, this.something.controls.detailtcs, this.something.controls.detailnric];
    !this.submitted && arrayForm.forEach(element => {
      if (element.invalid) {
        element.setValue(element.value);
        element.markAsTouched(); // and touch so the red color underline ion-input will be shown
      }
    });
    if (this.something.invalid) {
      this.submitted = true;
      this.templateService.presentToastWithOptions("Please enter required plan details highlighted in red");
      return false;
    }
    if (this.templateService.checkAllArrayEmpty("updating plan") || this.templateService.checkAppointmentEmpty()) {
      return false;
    }
    this.details.name = formValue.detailname.trim();
    this.details.nric = formValue.detailnric;
    this.details.cname = formValue.detailtcs.trim();
    this.details.ccontact = formValue.detailcontact;

    this.PlanService.editPlan(id, this.details).then(allPlan => {
      this.templateService.editPageUpdateArray(allPlan, id);
      this.templateService.presentToastWithOptions("Updated plan!");
      this.something.controls.detailname.setValue(this.details.name); //set again trim() value in case there is white space
      this.something.controls.detailtcs.setValue(this.details.cname);
      this.isDisabled = true;
    })
  }

  askForName(typeOfAction) {
    let inputMsg = (typeOfAction == 'rename') ? 'Enter new name' : 
      (typeOfAction == 'duplicate') ? 'Enter name of the duplicated plan' : 'Enter Crisis Template name'
    if (typeOfAction == 'Create Crisis Template') {
      this.router.navigate(["/tabs/templates/new"], {replaceUrl: true}).then(() => {
        this.event.publish("createTemplateFromPlan", this.defaultLanguage, this.details.id);
      });
    }
    else {
      this.templateService.alertInput(inputMsg).then(async (alertData: string) => {
        let planNameChecked = await this.templateService.checkDuplicateNameInApp('plan', alertData, typeOfAction, this.details.id);
        if (typeOfAction == 'rename') {
          this.PlanService.renamePlan(this.details.id, planNameChecked).then(() => {
            this.details.planName = planNameChecked;
            this.templateService.presentToastWithOptions("Renamed plan!");
          })
        }
        else if (typeOfAction == 'duplicate') {
          this.PlanService.duplicatePlan(this.details.id, planNameChecked).then(() => {
            this.templateService.presentToastWithOptions("Duplicated plan!");
            this.router.navigate(["/tabs/plans"], {replaceUrl: true});
          })
        }
      }).catch(() => {})
    }
  }

  dateChanged(my, appObj) {
    // let time = new Date(my).toLocaleString('en-GB'); //'en-GB' will crash as the system keeps returning 02/08 and 08/02 at same time when logged
    let time = new Date(my).toLocaleString('en-US'); 
    appObj.appTime = time;
  }

  newAppt() {
    this.templateService.newAppt();
  }

  checkAppt() {
    return this.templateService.appointment.length > 0
  }

  @ViewChild('mylist')mylist: IonList;
  @ViewChild('apptList')apptList: IonList;
  deleteIOSAppointment(apptIndex) {
    this.templateService.deleteIOSAppointment(apptIndex);
    this.apptList.closeSlidingItems();
    this.templateService.presentToastWithOptions("Deleted appointment!");
  }

  deleteIOS(arrayID, symptomIndex, actionIndex) {
    this.templateService.deleteIOS(arrayID, symptomIndex, actionIndex);
    this.mylist.closeSlidingItems();
    this.templateService.presentToastWithOptions("Deleted action!");
  }

  dragAndCheckLongPress(slideItem: IonItemSliding) {
    slideItem.close();
  }

  share() {
    let json = {
      type: "plan",
      data: [this.details]
    }
    this.templateService.exportJSON(json, "plan_" + this.details.planName);
  }

}
