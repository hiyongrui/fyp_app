import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import {v4 as uuid} from 'uuid';
import { Setting } from '../models/symptomaction';
import { SymptomActionService } from './symptomaction.service';
import { ActionSheetController, ToastController, AlertController } from '@ionic/angular';

const ALL_KEY = "allKey";
@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private storage: Storage, private settingStorage: SymptomActionService, private actionSheetCtrl: ActionSheetController, private zone: NgZone, 
    private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  createTemplate(finalArray, templateNameFromInput, templateID, templateNameUpdate, defaultLanguage) {

    return this.getAllTemplate(ALL_KEY).then(data => {

      data = data || [];
      var result = {templates: finalArray, id: templateID || uuid(), name: templateNameFromInput || templateNameUpdate, language: defaultLanguage}; //https://stackoverflow.com/questions/42120358/change-property-in-array-with-spread-operator-returns-object-instead-of-array
      templateNameFromInput ?
        data.push(result) :
        data[data.findIndex(item => item.id === templateID)] = result
      console.log("RESULT WATAR " + JSON.stringify(result, null, 2));
      console.warn("final data === " + JSON.stringify(data, null, 2))
      return this.storage.set(ALL_KEY, data)
    })
  } 

  getAllTemplate(type) {
    return this.storage.get(type);
  }
  
  getOneTemplate(id) {
    return this.getAllTemplate(ALL_KEY).then(data => {
      return data.find(item => item.id == id);
    })
  }

  renameTemplate(name, templateID) {
    return this.getAllTemplate(ALL_KEY).then(data => {
      data.find(item => item.id === templateID).name = name;
      return this.storage.set(ALL_KEY, data);
    })
  }
  
  duplicateTemplate(name, templateID) {
    return this.getAllTemplate(ALL_KEY).then(data => {
      let itemFound = data.find(item => item.id === templateID);
      let duplicatedItem = {...itemFound, id: uuid(), name: name}
      data.push(duplicatedItem);
      return this.storage.set(ALL_KEY, data);
    })
  }

  deleteTemplate(templateID) {
    return this.getAllTemplate(ALL_KEY).then(data => {
      data.splice(data.findIndex(item => item.id === templateID), 1);
      return this.storage.set(ALL_KEY, data);
    })
  }

  criticalArray = [];
  warningArray = [];
  goodArray = [];
  checked = [];

  pressEvent(type, thisObject, arrayID) {
    if (this.checked.length == 0) {
      console.error("type === " + type);
      console.error("this object full === " + JSON.stringify(thisObject,null,2));
      let dynamicObj = type == "Symptom" ? thisObject.combined : [thisObject];
      console.error("dynamic obj = " + JSON.stringify(dynamicObj,null, 2));
      dynamicObj.forEach(element => {
        console.error("element == " + JSON.stringify(element,null,2));
        element.whatsapp = true;
        element.arrayID = arrayID;
        this.checked.push(element);
      });
    }
    console.error("this.checked after pressed = " + JSON.stringify(this.checked, null, 2));
  }

  clickEvent(type, wholeItem, arrayID) {
    let itemConverted = type == "Symptom" ? wholeItem.combined[0] : wholeItem
    itemConverted.whatsapp = !itemConverted.whatsapp;
    let itemIndex = this.checked.findIndex(x => x.id == itemConverted.id);
    if (itemIndex !== -1) {
      this.checked.splice(itemIndex, 1);
    }
    else {
      itemConverted.arrayID = arrayID;
      this.checked.push(itemConverted);
    }
    console.error("spliced finish checked array = " + JSON.stringify(this.checked, null, 2));
  }

  clearArray() {
    this.checked.forEach(element => element.whatsapp = false);
    this.checked.length = 0;
  }

  deleteArray() {
    this.checked.forEach(element => {
      console.error("deleting this element === " + JSON.stringify(element,null,2));
      let thisArray = this.getArray(element.arrayID);
      // let index = thisArray[0].combined.findIndex(x => x.id == element.id);
      // let index = thisArray.findIndex(x => x.combined.findIndex(y => y.id == element.id));
      let index;
      thisArray.map((x, keyIndex) => {
        console.error("deleteArray x = " + JSON.stringify(x,null,2));
        var found = x.combined.some(y => y.id == element.id)
        if (found) index = keyIndex;
      });
      console.error("index === " + index);
      let arrayIndex = thisArray[index].combined.findIndex(y => y.id == element.id);
      console.error("array index ---- " + arrayIndex);
      thisArray[index].combined.splice(arrayIndex, 1);
    });
    this.criticalArray = this.criticalArray.filter(x => x.combined.length !== 0);
    this.warningArray = this.warningArray.filter(x => x.combined.length !== 0);
    this.goodArray = this.goodArray.filter(x => x.combined.length !== 0);
    console.error("after del critical array = " + JSON.stringify(this.criticalArray,null, 2));
    console.error("after del warning array = " + JSON.stringify(this.warningArray,null, 2));
    this.checked.length = 0;
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

  settingSymptom:Setting[] = [];
  settingAction = [];

  setGlobalSettings() {
    let promises = [this.settingStorage.getType("Symptom"), this.settingStorage.getType("Action")];
    Promise.all(promises).then(data => {
      this.settingSymptom = data[0];
      this.settingAction = data[1];
    });
  }

  globalLanguage = [[0, "English"], [1, "中文"], [2, "Malay"], [3, "Tamil"]];
  globalSymptom = ["Symptom", "症状", "gejala", "அறிகுறி"];
  globalAction = ["Action", "行动", "tindakan", "நடவடிக்கை"];

  selectRadio(defaultLanguage) {
    let completedArray = this.getAllArray();
    console.error("selected " + defaultLanguage);
    console.error("this setting symptom === " + JSON.stringify(this.settingSymptom, null, 2));
    console.error("completed array ===== " + JSON.stringify(completedArray, null, 2));
    completedArray.forEach(eachArr => {

      eachArr.forEach(x => {

        let oneSetting = this.settingSymptom.find(thisSetting => thisSetting.id == x.symptom.symptomID);
        oneSetting ? 
          x.symptom.text = [oneSetting.enName, oneSetting.chName, oneSetting.myName, oneSetting.tmName][defaultLanguage] || oneSetting.enName
          : x.symptom.text = this.globalSymptom[defaultLanguage];
        
        x.combined.forEach(element => {
          let oneAction = this.settingAction.find(thisSetting => thisSetting.id == element.actionID);
          oneAction ?
            element.text = [oneAction.enName, oneAction.chName, oneAction.myName, oneAction.tmName][defaultLanguage] || oneAction.enName
            : element.text = this.globalAction[defaultLanguage];
        });
      })
    })
    console.error("mapparrr ---> " + JSON.stringify(completedArray, null, 2));
  }

  filterArray(item) {
    this.criticalArray = item.template.filter(element =>  element.name == "criticalArray")
    this.warningArray = item.template.filter(element => element.name == "warningArray");
    this.goodArray = item.template.filter(element => element.name =="goodArray");
    console.log("this critical array = " + JSON.stringify(this.criticalArray, null, 2))
  }

  resetArray() {
    this.criticalArray.length = 0;
    this.warningArray.length = 0;
    this.goodArray.length = 0;
    this.checked.length = 0;
  }

  editPageUpdateArray(val, templateID) {
    this.criticalArray = val.find(x => x.id == templateID).templates[0];
    this.warningArray = val.find(x => x.id == templateID).templates[1];
    this.goodArray = val.find(x => x.id == templateID).templates[2];
    console.warn("after filter " + JSON.stringify(this.criticalArray,null,2))
  }

  getAllArray() {
    return [this.criticalArray, this.warningArray, this.goodArray];
  }

  backUpCriticalArray = [];
  backUpWarningArray = [];
  backUpGoodArray = [];

  callEdit(defaultLanguage) {
    this.backUpCriticalArray = JSON.parse(JSON.stringify(this.criticalArray)); //need to deep copy to remove reference
    // this.backUpCriticalArray = [...this.criticalArray];
    // this.backUpCriticalArray = this.criticalArray.slice(0);
    // this.backUpCriticalArray = this.criticalArray.map(object => { return [...object]})
    this.backUpWarningArray = this.warningArray.slice();
    this.backUpGoodArray = [...this.goodArray];

    console.log("critical array === " + JSON.stringify(this.backUpCriticalArray, null, 2));
    let completedArray = this.getAllArray();
    completedArray.forEach(element => {
      element.forEach(array => {
        if (array.combined.length == 0) {
          let newAction = {
            id: uuid(),
            // text: "Action",
            text: this.globalAction[defaultLanguage],
            type: "Action",
            img: "assets/empty.svg",
            description: "",
            actionID: ""
          }
          array.combined.push(newAction);
        }
      });
    })
  }
  
  goToViewPageFromEdit() {
    this.criticalArray = [...this.backUpCriticalArray];
    this.warningArray = [...this.backUpWarningArray];
    this.goodArray = [...this.backUpGoodArray];
    console.log("going back to view page ... " + JSON.stringify(this.backUpCriticalArray,null,2));
  }


  //https://stackoverflow.com/questions/48133216/custom-icons-on-ionic-select-with-actionsheet-interface-ionic2
  async presentActionSheet(symptomOrAction, item, defaultLanguage) { //https://ionicframework.com/docs/api/action-sheet
    symptomOrAction = symptomOrAction == "updateAction" ? "action" : symptomOrAction
    console.warn("symptomOrAction = " + symptomOrAction);
    if (this.checkSymptomOrActionEmpty(symptomOrAction)) {
      return false;
    }
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Select a " + symptomOrAction.toLowerCase() + " from below",
      cssClass: "wholeActionSheet",
      buttons: this.createButtons(item, symptomOrAction, defaultLanguage),
      mode: "ios"
    });
    await actionSheet.present();
  }

  createButtons(itemToUpdate, type, defaultLanguage) {
    let buttons = [];
    let typeToCall = type == "Symptom" ? this.settingSymptom : this.settingAction
    typeToCall.forEach((element: Setting, index) => {
      let style = document.createElement('style'); //https://github.com/ionic-team/ionic/issues/6589
      style.type = "text/css";
      style.innerHTML = ".customCSSClass" + index + '{background: url('+ "'" + element.icon + "'" + ') no-repeat !important; padding: 40px 20% 40px 25% !important; margin-top:25px !important; background-size:80px 80px !important; margin-left: 30px !important;}';
      document.getElementsByTagName('head')[0].appendChild(style);

      let elementArray = [element.enName, element.chName, element.myName, element.tmName];
      let nameLanguage = elementArray[defaultLanguage] || element.enName;

      let button = {
        // text: element.enName,
        text: nameLanguage,
        //icon: "assets/icon/cough.png",
        cssClass: 'customCSSClass'+ index,
        handler: () => {
          console.log(`${element.enName} clicked and full element --> ` + JSON.stringify(element, null, 2));
          console.log("item to update ==> " + JSON.stringify(itemToUpdate, null, 2));
      //put zone here
          this.zone.run(() => {
            if (type == "Symptom") {
              itemToUpdate.symptom.text = nameLanguage;
              itemToUpdate.symptom.img = element.icon;
              itemToUpdate.symptom.symptomID = element.id;
            }
            else {
              console.log("update action?");
              itemToUpdate.text = nameLanguage;
              itemToUpdate.img = element.icon;
              itemToUpdate.actionID = element.id;
            }
          })
          console.warn("item to update " + JSON.stringify(itemToUpdate, null, 2));
          // console.log("whole array = " + JSON.stringify(this.criticalArray));
        }
      }
      buttons.push(button);
    });
    buttons.push({
      text: "Cancel",
      icon: "close",
      role: "selected"
    })
    return buttons;
  }

  addNewCriticalArray(type, id, defaultLanguage) {
    console.log("clicked " + type); //critical or caution or good
    let thisArray = this.getArray(id);
    let newPair = {
      // 'id': 1,
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
    console.log(thisArray);
  }

  
  popUp(id, defaultLanguage) {
    let thisArray = this.getArray(id);
    if (thisArray.every(a => this.globalSymptom.includes(a.symptom.text))) {
      this.presentToastWithOptions("Actions are allowed only when symptoms have been selected!");
    }
    else {
      this.alertCtrl.create({
        header: "Select a symptom",
        inputs: this.createRadios(id),
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: 'Ok',
            handler: (alertData => {
              console.log("ok name1 = " + alertData);
              // let x = this.criticalArray.find(x => x.symptom.text == alertData);
              console.warn("this arr = " + JSON.stringify(thisArray, null, 2))
              if (alertData === undefined) {
                this.presentToastWithOptions("Please select a symptom!");
                return false; //https://stackoverflow.com/questions/45969821/alert-controller-input-box-validation
              }
              else {
                let x = thisArray.find(x => x.symptom.id == alertData);
                console.error("X + " + JSON.stringify(x,null,2));
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
                this.presentActionSheet("updateAction", newAction, defaultLanguage)
                // console.error("pushed after " + JSON.stringify(this.criticalArray));
                console.error("pushed after " + JSON.stringify(thisArray));
              }
            })
          }
        ]
      }).then(alert => {
        alert.present()
      });
    }
  }

  createRadios(id) {
    let thisArray = this.getArray(id);
    let radioBtns = [];
    // this.criticalArray.filter(word => word.symptom.text !== "Symptom").forEach(element => {
    thisArray.filter(word => !this.globalSymptom.includes(word.symptom.text)).forEach(element => {
      let radioBtn = {
        type: "radio",
        label: element.symptom.text,
        // value: element.symptom.text
        value: element.symptom.id
      }
      radioBtns.push(radioBtn);
    })
    return radioBtns;
  }

  async presentToastWithOptions(text) {
    const toast = await this.toastCtrl.create({
      header: text,
      // message: 'Click to Close',
      duration: 3000,
      position: 'bottom',
      buttons: [
        // {
        //   side: 'start',
        //   icon: 'star',
        //   text: 'Favorite',
        //   handler: () => {
        //     console.log('Favorite clicked');
        //   }
        // }, 
      {
        text: 'Close',
        role: 'cancel'
      }]
    });
    toast.present();
  }

  cleansedArray() {
    let completedArray = this.getAllArray();
    let name = ["criticalArray", "warningArray", "goodArray"];
    console.log("critical array = " + JSON.stringify(this.criticalArray));
    console.log("warning array = " + JSON.stringify(this.warningArray));
    //  console.log("critical array = " + JSON.stringify(this.completedArray[0]));
    //  console.log("warning array = " + JSON.stringify(this.completedArray[1]));
    let maparr = completedArray.map((eachArr, index) => { //https://stackoverflow.com/questions/53817342/map-and-filter-mapped-array-in-javascript
      //  eachArr = eachArr.filter(data => data.symptom.text !== "Symptom");
      eachArr = eachArr.filter(data => !this.globalSymptom.includes(data.symptom.text));
      eachArr.map(x => {
        //  x.combined = x.combined.filter(thisAction => thisAction.text !== "Action");
        x.combined = x.combined.filter(thisAction => !this.globalAction.includes(thisAction.text));
        x.combined.forEach(element => {
          delete element.whatsapp;
          delete element.arrayID; 
        });
        x.id = uuid(); 
        x.name = name[index];
      });
      return eachArr;
    });
    return maparr;
  }

  checkAllArrayEmpty(type) {
    let returnValue = false;
    if (!this.getAllArray().some(x => x.some(y => !this.globalSymptom.includes(y.symptom.text)))) {
      this.presentToastWithOptions("Please select at least one symptom before " + type + " template");
      returnValue = true;
    } // https://stackoverflow.com/a/50475787
    return returnValue;
  }

  checkSymptomOrActionEmpty(type) {
    console.warn("type = " + type);
    let thisList = type == "Action" ? this.settingAction : this.settingSymptom;
    console.warn("this list length = " + thisList.length);
    thisList.length == 0 && this.presentToastWithOptions(`No ${type} found. Please add ${type} in settings!`);
    return thisList.length == 0
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
