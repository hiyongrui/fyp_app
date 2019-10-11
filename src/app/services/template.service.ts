import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import {v4 as uuid} from 'uuid';
import { Symptom } from '../models/symptomaction';
import { SymptomActionService } from './symptomaction.service';
import { ActionSheetController, ToastController, AlertController, PopoverController, ModalController, Platform } from '@ionic/angular';
import { MenuPopoverComponent } from '../shared-module/menu-popover/menu-popover.component';
import { CategoryModalComponent } from '../shared-module/category-modal/category-modal.component';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

const TEMPLATE_KEY = "templateKey";
@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private storage: Storage, private settingService: SymptomActionService, private actionSheetCtrl: ActionSheetController, private zone: NgZone, private file: File,
    private toastCtrl: ToastController, private alertCtrl: AlertController, private popoverCtrl: PopoverController, private modalCtrl: ModalController, private plt: Platform,
    private emailComposer: EmailComposer) { }

  createTemplate(finalArray, templateNameFromInput, templateID, templateNameUpdate, defaultLanguage) {
    return this.getAllTemplate(TEMPLATE_KEY).then(data => {
      data = data || [];
      var result = {templates: finalArray, id: templateID || uuid(), name: templateNameFromInput || templateNameUpdate, language: defaultLanguage}; //https://stackoverflow.com/questions/42120358/change-property-in-array-with-spread-operator-returns-object-instead-of-array
      templateNameFromInput ? data.push(result) 
        : data[data.findIndex(item => item.id === templateID)] = result
      return this.storage.set(TEMPLATE_KEY, data)
    })
  } 

  getAllTemplate(type) {
    return this.storage.get(type);
  }
  
  getOneTemplate(id) {
    return this.getAllTemplate(TEMPLATE_KEY).then(data => {
      return data.find(item => item.id == id);
    })
  }

  renameTemplate(name, templateID) {
    return this.getAllTemplate(TEMPLATE_KEY).then(data => {
      data.find(item => item.id === templateID).name = name;
      return this.storage.set(TEMPLATE_KEY, data);
    })
  }
  
  duplicateTemplate(name, templateID) {
    return this.getAllTemplate(TEMPLATE_KEY).then(data => {
      let itemFound = data.find(item => item.id === templateID);
      let duplicatedItem = {...itemFound, id: uuid(), name: name}
      data.push(duplicatedItem);
      return this.storage.set(TEMPLATE_KEY, data);
    })
  }

  deleteTemplate(templateID) {
    return this.getAllTemplate(TEMPLATE_KEY).then(data => {
      data.splice(data.findIndex(item => item.id === templateID), 1);
      return this.storage.set(TEMPLATE_KEY, data);
    })
  }

  criticalArray = [];
  warningArray = [];
  goodArray = [];
  checked = [];
  appointment = [];

  getApptArray = () => this.appointment;
  newAppt() {
    let apptObj = {
      id: uuid(),
      clinicName: "",
      appTime: "",
    }
    this.appointment.push(apptObj);
  }

  pressEvent(type, thisObject, arrayID, symptomID) {
    if (this.checked.length == 0) {
      let dynamicObj = type == "Symptom" ? thisObject.combined : [thisObject];
      dynamicObj.forEach(thisObj => {
        thisObj.whatsapp = true;
        this.checked.push({thisObj, arrayID, symptomID});
      });
    }
  }

  clickEvent(type, wholeItem, arrayID, symptomID) {
    let thisObj = type == "Symptom" ? wholeItem.combined[0] : wholeItem
    thisObj.whatsapp = !thisObj.whatsapp;
    let itemIndex = this.checked.findIndex(x => x.thisObj.id == thisObj.id);
    itemIndex !== -1 ? this.checked.splice(itemIndex, 1) : this.checked.push({thisObj, arrayID, symptomID})
  }

  clearArray() {
    this.checked.forEach(element => element.thisObj.whatsapp = false);
    this.checked.length = 0;
  }

  deleteArray() {
    this.checked.forEach(element => {
      if (element.arrayID == 4) {
        let dynamicIndex = this.appointment.findIndex(x => x.id == element.thisObj.id);
        this.appointment.splice(dynamicIndex, 1);
      } else {
        let thisArray = this.getArray(element.arrayID);
        let dynamicCombinedIndex = thisArray.findIndex(x => x.symptom.id == element.symptomID);
        let arrayIndex = thisArray[dynamicCombinedIndex].combined.findIndex(y => y.id == element.id);
        thisArray[dynamicCombinedIndex].combined.splice(arrayIndex, 1);
        thisArray[dynamicCombinedIndex].combined.length == 0 && thisArray.splice(dynamicCombinedIndex, 1);
      }
    });
    this.checked.length = 0;
  }

  deleteIOS(arrayID, sypmtomIndex, actionIndex) {
    let thisArray = this.getArray(arrayID);
    thisArray[sypmtomIndex].combined.splice(actionIndex, 1);
    thisArray[sypmtomIndex].combined.length === 0 && thisArray.splice(sypmtomIndex, 1);
  }
  
  deleteIOSAppointment(apptIndex) {
    this.appointment.splice(apptIndex, 1);
  }
  // getArray(id) { //return array type
  //   return [this.criticalArray, this.warningArray, this.goodArray][id];
  // }
  getArray = id => [this.criticalArray, this.warningArray, this.goodArray][id];
  getCompletedArray = () => [this.criticalArray, this.warningArray, this.goodArray];

  frontViewData = [
    { 
      id: 0,
      type: "Critical",
      colorCard: "danger",
      colorBtn: "redCard",
      toggle: false,
      textCard: "Get Help Now"
    },
    {
      id: 1,
      type: "Warning",
      colorCard: "warning",
      colorBtn: "warning",
      toggle: false,
      textCard: "Caution: Symptom Management"
    },
    {
      id: 2,
      type: "Good",
      colorCard: "success",
      colorBtn: "success",
      toggle: false,
      textCard: "I'm feeling well"
    }
  ]

  settingSymptom:Symptom[] = [];
  settingAction = [];

  setGlobalSettings() {
    this.frontViewData.forEach(x => x.toggle = false);
    let promises = [this.settingService.getType("Symptom"), this.settingService.getType("Action")];
    Promise.all(promises).then(data => {
      this.settingSymptom = data[0];
      this.settingAction = data[1];
    });
  }

  globalLanguage = [[0, "English"], [1, "中文"], [2, "Malay"], [3, "Tamil"]];
  globalSymptom = ["Symptom", "症状", "gejala", "அறிகுறி"];
  globalAction = ["Action", "行动", "tindakan", "நடவடிக்கை"];
  globalCategory = ["Asthma", "COPD", "General", "Heart Failure"];

  selectRadio(defaultLanguage) {
    let completedArray = this.getAllArray();

    completedArray.forEach(mainArray => {

      mainArray.forEach(symptomActionPair => {

        let oneSymptom = this.settingSymptom.find(thisSymptom => thisSymptom.id == symptomActionPair.symptom.symptomID);
        oneSymptom ? 
        symptomActionPair.symptom.text = this.returnLanguage(oneSymptom, defaultLanguage)
          : symptomActionPair.symptom.text = this.globalSymptom[defaultLanguage];

        symptomActionPair.combined.forEach(action => {
          let oneAction = this.settingAction.find(thisAction => thisAction.id == action.actionID);
          oneAction ?
          action.text = this.returnLanguage(oneAction, defaultLanguage)
            : action.text = this.globalAction[defaultLanguage];
        });
      })
    })
  }

  filterArray(item) {
    this.criticalArray = item.template.filter(element =>  element.name == "criticalArray")
    this.warningArray = item.template.filter(element => element.name == "warningArray");
    this.goodArray = item.template.filter(element => element.name =="goodArray");
  }

  resetArray() {
    this.criticalArray.length = 0;
    this.warningArray.length = 0;
    this.goodArray.length = 0;
    this.checked.length = 0;
    this.appointment.length = 0;
  }

  editPageUpdateArray(val, templateID) {
    this.criticalArray = val.find(x => x.id == templateID).templates[0];
    this.warningArray = val.find(x => x.id == templateID).templates[1];
    this.goodArray = val.find(x => x.id == templateID).templates[2];
    [this.criticalArray, this.warningArray, this.goodArray].forEach(eachArray => {
      eachArray.forEach(element => {
        this.settingService.getOneImage("Symptom", element.symptom.symptomID).then(oneImg => {
          element.symptom.img = oneImg;
        });
        element.combined.forEach(oneCombined => {
          this.settingService.getOneImage("Action", oneCombined.actionID).then(actionImg => {
            oneCombined.img = actionImg;
          })
        })
      })
    })
  }

  getAllArray() {
    return [this.criticalArray, this.warningArray, this.goodArray];
  }

  backUpCriticalArray = [];
  backUpWarningArray = [];
  backUpGoodArray = [];
  backUpAppointment = [];

  callEdit(defaultLanguage) {
    this.backUpCriticalArray = JSON.parse(JSON.stringify(this.criticalArray)); //need to deep copy to remove reference
    this.backUpWarningArray = JSON.parse(JSON.stringify(this.warningArray));
    this.backUpGoodArray = JSON.parse(JSON.stringify(this.goodArray));
    this.backUpAppointment = JSON.parse(JSON.stringify(this.appointment));
    this.changeTextBasedOnLanguage(defaultLanguage, false);
  }

  changeTextBasedOnLanguage(defaultLanguage, checkForEmptyActionOnly) {
    let completedArray = this.getAllArray();
    completedArray.forEach(mainArray => {
      mainArray.forEach(symptomActionPair => {
        if (symptomActionPair.combined.length == 0) {
          let newAction = {
            id: uuid(),
            // text: "Action",
            text: this.globalAction[defaultLanguage],
            type: "Action",
            img: "assets/empty.svg",
            description: "",
            actionID: ""
          }
          symptomActionPair.combined.push(newAction);
        }
        else if (!checkForEmptyActionOnly) {
          this.settingService.getOneSetting("Symptom", symptomActionPair.symptom.symptomID).then(thisSymptom => {
            symptomActionPair.symptom.text = this.returnLanguage(thisSymptom, defaultLanguage);
          })
          symptomActionPair.combined.forEach(action => {
            if (action.actionID) {
              this.settingService.getOneSetting("Action", action.actionID).then(thisAction => {
                action.text = this.returnLanguage(thisAction, defaultLanguage);
              })
            }
            else {
              action.text = this.globalAction[defaultLanguage];
            }
          });
        }
      });
    })
  }
  
  goToViewPageFromEdit() {
    this.criticalArray = [...this.backUpCriticalArray];
    this.warningArray = [...this.backUpWarningArray];
    this.goodArray = [...this.backUpGoodArray];
    this.appointment = [...this.backUpAppointment];
  }


  alertInput(templateName) {
    return new Promise(async (resolve, reject) => {
      let alert = await this.alertCtrl.create({
        header: templateName,
        message: "",
        cssClass: "alertInputCSS",
        inputs: [
          {
            name: 'nameInput',
            type: 'text'
          }
        ],
        buttons: [
          {
            text: 'CANCEL',
            role: 'cancel',
            cssClass: 'cancelBlueBtn',
            handler: () => reject(false)
          },
          {
            text: 'OK',
            cssClass: 'okBlueBtn',
            handler: (alertData) => {
              if (alertData.nameInput.trim() === "") {
                alert.message = "Name is required!"; //https://stackoverflow.com/questions/45969821/alert-controller-input-box-validation
                this.presentToastWithOptions("Name is required!");
                return false;
              }
              else if (alertData.nameInput.trim().length > 35) {
                alert.message = "Name too long!";
                this.presentToastWithOptions("Name too long!");
                return false;
              }
              else if (!this.checkSpecialCharacters(alertData.nameInput.trim(), alert)) {
                return false;
              }
              resolve(alertData.nameInput.trim());
            }
          }
        ]
      })
      await alert.present().then(() => {
        let x:any= document.querySelector('ion-alert input'); //https://forum.ionicframework.com/t/set-focus-on-input-inside-alert-prompt/51885/6
        x.focus();
        return;
      });
    })
  }

  //https://stackoverflow.com/questions/48133216/custom-icons-on-ionic-select-with-actionsheet-interface-ionic2
  presentSymptomActionModal(symptomOrAction, item, defaultLanguage) { //https://ionicframework.com/docs/api/action-sheet
    let convertedListToObj = this.globalCategory.map(str => ({categoryList: str}));
    symptomOrAction = symptomOrAction == "updateAction" ? "Action" : symptomOrAction
    let symptomOrActionList = symptomOrAction == 'Symptom' ? this.settingSymptom: this.settingAction;
    this.openModal(true, convertedListToObj, symptomOrAction, symptomOrActionList, defaultLanguage).then(callModal => {
      callModal.present();
      callModal.onDidDismiss().then(data => {
        if (!data.data) return false;
        if (symptomOrAction == "Symptom") {
          item.symptom.text = this.returnLanguage(data.data, defaultLanguage);
          item.symptom.img = data.data.icon;
          item.symptom.symptomID = data.data.id;
        }
        else {
          item.text = this.returnLanguage(data.data, defaultLanguage);
          item.img = data.data.icon;
          item.actionID = data.data.id;
        }
      })
    })
  }

  returnLanguage(element, defaultLanguage) {
    let elementArray = [element.enName, element.chName, element.myName, element.tmName];
    return elementArray[defaultLanguage] || element.enName;
  }


  addNewCriticalArray(type, id, defaultLanguage) {
    // console.log("clicked " + type); //critical or caution or good
    let thisArray = this.getArray(id);
    let newPair = {
      symptom: {
        id: uuid(),
        // text: "Symptom",
        text: this.globalSymptom[defaultLanguage],
        type: "Symptom",
        img: "assets/empty.svg",
        description: "",
        symptomID: "",
      },
      combined: [
        {
          id: uuid(),
          // text: "Action",
          text: this.globalAction[defaultLanguage],
          type: "Action",
          img: "assets/empty.svg",
          description: "",
          actionID: ""
        }
      ]
    }
    thisArray.push(newPair); //double push
  }

  
  popUp(id, defaultLanguage) {
    let thisArray = this.getArray(id);
    if (thisArray.every(a => this.globalSymptom.includes(a.symptom.text))) {
      this.presentToastWithOptions("Actions are allowed only when symptoms have been selected!");
      return false;
    }
    this.alertCtrl.create({
      header: "Select a symptom",
      inputs: this.createRadios(id),
      mode:'ios',
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'cancelBlueBtn'
        },
        {
          text: 'OK',
          handler: (alertData => {
            let x = thisArray.find(x => x.symptom.id == alertData);
            let newAction = {
              id: uuid(),
              // text: "Action",
              text: this.globalAction[defaultLanguage],
              type: "Action",
              img: "assets/empty.svg",
              description: "",
              actionID: ""
            }
            x.combined.push(newAction);
            this.presentSymptomActionModal("updateAction", newAction, defaultLanguage)
          })
        }
      ]}).then(alert => {
        alert.present()
      });
  }

  createRadios(id) {
    let thisArray = this.getArray(id);
    let radioBtns = [];
    // this.criticalArray.filter(word => word.symptom.text !== "Symptom").forEach(element => {
    thisArray.filter(word => !this.globalSymptom.includes(word.symptom.text)).forEach((element, index) => {
      let radioBtn = {
        type: "radio",
        label: (index + 1) + ". " + element.symptom.text,
        // value: element.symptom.text
        value: element.symptom.id
      }
      radioBtns.push(radioBtn);
    })
    radioBtns[0].checked = true;
    return radioBtns;
  }

  async presentToastWithOptions(text) {
    const toast = await this.toastCtrl.create({
      header: text,
      duration: 3000,
      position: 'bottom',
      buttons: [{
        text: 'CLOSE',
        role: 'cancel'
      }],
      cssClass: 'toastCSS'
    });
    toast.present();
  }

  cleansedArray() {
    let completedArray = this.getAllArray();
    let name = ["criticalArray", "warningArray", "goodArray"];
    let maparr = completedArray.map((eachArr, index) => { //https://stackoverflow.com/questions/53817342/map-and-filter-mapped-array-in-javascript
      //  eachArr = eachArr.filter(data => data.symptom.text !== "Symptom");
      eachArr = eachArr.filter(data => !this.globalSymptom.includes(data.symptom.text));
      eachArr.map(x => {
        x.symptom.img = null;
        //  x.combined = x.combined.filter(thisAction => thisAction.text !== "Action");
        x.combined = x.combined.filter(thisAction => !this.globalAction.includes(thisAction.text));
        x.combined.forEach(element => {
          delete element.whatsapp;
          element.img = null;
        });
        x.id = uuid(); 
        x.name = name[index];
      });
      return eachArr;
    });
    return maparr;
  }

  checkAllArrayEmpty(text) {
    let returnValue = false;
    if (!this.getAllArray().some(x => x.some(y => !this.globalSymptom.includes(y.symptom.text)))) {
      this.presentToastWithOptions("Please select at least one symptom before " + text);
      returnValue = true;
    } // https://stackoverflow.com/a/50475787
    return returnValue;
  }

  checkAppointmentEmpty() {
    let returnValue = false;
    this.appointment.forEach(x => {
      if (!x.clinicName.trim() && !x.appTime) {this.presentToastWithOptions("Please ensure both clinic name and time for appointment is filled up"); returnValue=true;return false}
      else if (!x.clinicName.trim()) { this.presentToastWithOptions("Please ensure all the clinic name for appointment is filled up"); returnValue=true;return false}
      else if (!x.appTime) {this.presentToastWithOptions("Please ensure all the appointment time is filled up"); returnValue=true;return false}
    })
    return returnValue;
  }

  checkSymptomOrActionEmpty(type, thisList) {
    thisList.length == 0 && this.presentToastWithOptions(`No ${type} found. Please add ${type} in settings!`);
    return thisList.length == 0
  }

  delete(headerMsg) {
    return new Promise((resolve, reject) => {
      this.alertCtrl.create({
        header: headerMsg,
        message: 'Once deleted, there is no retrieving back!',
        buttons: [
          {
          text: 'CANCEL',
          role: 'cancel',
          cssClass: 'cancelBlueBtn',
          handler: () => reject(false)
        },
        {
          text: 'DELETE',
          cssClass: 'deleteRedBtn',
          handler: () => resolve(true)
        }
        ]
      }).then(alert => {
        alert.present();
      })
    })
  }
  
  openModal(accordion: boolean, categoryList, symptomOrAction?, symptomOrActionList?, defaultLanguage?) {
    return this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: {accordion, categoryList, symptomOrAction, symptomOrActionList, defaultLanguage}
    })
  }

  openPopover(menuOptions, event) {
    return this.popoverCtrl.create({
      component: MenuPopoverComponent,
      event: event,
      componentProps: {menuOptions}
    })
  }

  checkPlatformAndroid() {
    return this.plt.is("android")
  }
  
  checkDuplicateNameInApp(type, name, typeOfAction?, id?) {
    let keyToCall = type == "template" ? TEMPLATE_KEY : "planKey";
    return this.storage.get(keyToCall).then(list => {
      list = list || [];
      let originalName = typeOfAction == "rename" ? type == "template" ? list.find(x => x.id == id).name : list.find(x => x.id == id).planName : null;
      let newName = this.recursionCheck(list, type, name, originalName);
      return newName;
    })
  }

  checkDuplicateNameFromSharing(list, type, name, checkIndex) {
    let originalName = checkIndex > -1 ? type == "template" ? list[checkIndex].name : list[checkIndex].planName : null;
    let newName = this.recursionCheck(list, type, name, originalName);
    return newName;
  }

  recursionCheck(list, type, nameInput, originalName) {

    let counterFound = nameInput.match(/\(\d+\)$/); //https://jsbin.com/pawaxasuqe/edit?js,console,output
    let nameWithoutCounter = counterFound ? nameInput.substring(0, counterFound.index).trimEnd() : nameInput;
    let newName = nameWithoutCounter;
    let counter = 0;

    let recursion = function(currentNameInLoop) {
      let nameFound = type == "template" ? list.some(x => x.name.toLowerCase() == currentNameInLoop.toLowerCase()) : list.some(y => y.planName.toLowerCase() == currentNameInLoop.toLowerCase());
      //if originalName exist = renaming/updating plan/template
      if (nameFound && originalName !== nameWithoutCounter && currentNameInLoop !== originalName) {
        counter++;
        newName = nameWithoutCounter + " (" + counter + ")";
        return recursion(newName);
      }
    }
    recursion(nameWithoutCounter);

    return newName;
  }

  addTemplateFromSharing(templatesToAdd, type) {
    return this.getAllTemplate(TEMPLATE_KEY).then(data => {
      data = data || [];
      templatesToAdd.forEach(element => {
        let checkIndex = data.findIndex(x => x.id == element.id);
        element.name = this.checkDuplicateNameFromSharing(data, type, element.name, checkIndex);
        checkIndex > -1 ? data[checkIndex] = element : data.push(element);
      });
      this.presentToastWithOptions(templatesToAdd.length + " template imported successfully");
      return this.storage.set(TEMPLATE_KEY, data)
    })
  }
  
  exportJSON(json, fileName) {

    json.identifier = "Crisis Management";
    let path = this.file.dataDirectory;
    let todayDate = this.getTodayDate();
    let fileNameChecked = fileName.indexOf(todayDate) > -1 ? `${fileName}.txt` : `${fileName}_${todayDate}.txt`;

    this.file.writeFile(path, fileNameChecked, JSON.stringify(json), { replace: true }).then(() => {
      //TODO: open email, with json file attached, after that removeFile()
      let emailObj = {
        to: 'nypmedieasy@gmail.com',
        cc: 'nypmedieasy@gmail.com',
        attachments: [path + fileNameChecked],
        subject: `${json.data.length} ${json.type} exported on ${todayDate}`,
        body: 'Attached is the body msg',
        isHtml: true
      };
      this.emailComposer.open(emailObj).then(() => {
        setTimeout(() => {
          this.file.removeFile(path, fileNameChecked);
        }, 300);
      });
    }, (err) => this.throwError("Sorry error sharing file!", err));
  }
  
  getTodayDate() {
    let dateObj = new Date(); //https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript
    let todayDate = `${dateObj.getDate()}-${dateObj.getMonth() + 1}-${dateObj.getFullYear()}`; //or new Date().toLocaleDateString('en-GB').replace(/\//g, "-"))
    return todayDate;
  }
  
  throwError(msg, err) {
    console.error(msg, err);
    this.presentToastWithOptions(msg);
  }

  checkSpecialCharacters(name, alert) {
    //https://stackoverflow.com/questions/2679699/what-characters-allowed-in-file-names-on-android
    //TODO: if input invalid, prompt user which are the invalid characters, on window file name is
    let regexList = ["/", "\\\\", ":", "*", "?", "\"", "<", ">", "|"]; //https://www.regextester.com/99810, https://jsbin.com/dodimovawa/edit?html,js,console,output
    let regExp = new RegExp("[" + regexList.join("") + "]", 'g');
    let matches = Array.from(new Set(name.match(regExp)));
    if (matches.length > 0) {
      let errMsg = "Special characters not allowed:\n" + matches.join(" ");
      this.presentToastWithOptions(errMsg);
      alert.message = errMsg;
      return false;
    }
    return true;
    //https://stackoverflow.com/questions/23136947/javascript-regex-to-return-letters-only
  }
  
  encodeURIComponent(str) { //https://stackoverflow.com/questions/39138499/how-can-we-handle-special-characters-in-the-url-with-angular
    //needed else create crisis plan url cannot have name (1)
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
  }

} //end of class




  /*
  // get one template by id
  getTemplateItemById(id): Promise<TemplateRecord> {
    return this.storage.get(TEMPLATETABLE_KEY).then(result => {
      return result.filter(item => item.id === id);
    });
  }

  // get all templates
  getAllTemplateItems(): Promise<TemplateRecord[]> {
    return this.storage.get(TEMPLATETABLE_KEY);
  }

  // add a new template info into templatetable, return a promise to indicate the status of creating a key-values pair
  addTemplateItem(newitem: TemplateRecord): Promise<any> {
    return this.storage.get(TEMPLATETABLE_KEY).then((items: TemplateRecord[]) => {
      if (items) {
        items.push(newitem);
        return this.storage.set(TEMPLATETABLE_KEY, items);
      } else {
        return this.storage.set(TEMPLATETABLE_KEY, [newitem]);
      }
    });
  }

  // update one template record
  updateTemplateItem(item: TemplateRecord): Promise<any> {
    return this.storage.get(TEMPLATETABLE_KEY).then((items: TemplateRecord[]) => {
      if (!items || items.length === 0) {
        return null;
      }

      // tslint:disable-next-line:prefer-const
      let newItems: TemplateRecord[] = [];

      // tslint:disable-next-line:prefer-const
      for (let indexitem of items) {
        if (indexitem.id === item.id) {
          newItems.push(item);
        } else {
            newItems.push(indexitem);
        }

      }
      return this.storage.set(TEMPLATETABLE_KEY, newItems);
    });
  }

  // delete one template record by id
  deleteTemplateItemById(id: string): Promise<TemplateRecord> {
    return this.storage.get(TEMPLATETABLE_KEY).then((items: TemplateRecord[]) => {
      if (!items || items.length === 0) {
        return null;
      }

      // tslint:disable-next-line:prefer-const
      let toKeepItems: TemplateRecord[] = [];

      // tslint:disable-next-line:prefer-const
      for (let indexitem of items) {
        if (indexitem.id !== id) {
          toKeepItems.push(indexitem);
        }
      }
      return this.storage.set(TEMPLATETABLE_KEY, toKeepItems);
    });
  }

}
*/
