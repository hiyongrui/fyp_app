import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const TEMPLATE_KEY = "templateKey";
const WARNING_KEY = "warningKey";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private storage: Storage) { }

  createTemplate(finalArray) {
    let arrKey = [TEMPLATE_KEY, WARNING_KEY];

    let promises = [this.getAllTemplate(TEMPLATE_KEY), this.getAllTemplate(WARNING_KEY)];
    return Promise.all(promises).then(data => { //https://forum.ionicframework.com/t/localstorage-best-practice-to-set-multiple-keys/130106
      console.warn("data == " + JSON.stringify(data));
      finalArray.forEach((element, index) => {
        console.warn(JSON.stringify(element));
        data[index] = data[index] || [];
        if (element && element.length > 0) { //https://stackoverflow.com/questions/46022712/how-to-check-if-local-storage-key-does-not-exist
          console.log(element[0].combined);
          element[0].combined = element[0].combined.filter(item => item.text !== "Action");
          // element[0].combined.slice().reverse().forEach((item,index,object) => {
          //   if (item.text == "Action") {
          //     element[0].combined.splice(object.length - 1 - index, 1) //https://stackoverflow.com/questions/24812930/how-to-remove-element-from-array-in-foreach-loop
          //   }
          // });
          console.log("afetr filter error " + JSON.stringify(element));
          data[index].push(element);
          console.error("data index == " + JSON.stringify(data[index]));
        }
        return this.storage.set(arrKey[index], data[index]);
      })
    })
    // return this.getAllTemplate(TEMPLATE_KEY).then(val => {
    //   val = val || [];
    //   val.push(finalArray);
    //   return this.storage.set(TEMPLATE_KEY, finalArray)
    // })
  } 

  getAllTemplate(type) {
    return this.storage.get(type);
  }
    
} //end of this fucking class

 

  /*
  constructor(private storage: Storage) { }

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
  */
// }
