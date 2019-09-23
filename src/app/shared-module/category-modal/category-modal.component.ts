import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html'
})
export class CategoryModalComponent implements OnInit {

  currentItem: any;
  filteredSymptomOrAction = [];
  symptomOrAction: string;
  symptomOrActionList = [];
  accordion: boolean;

  constructor(private navParams: NavParams, private modalController: ModalController, private toastCtrl: ToastController) {
    this.symptomOrAction = navParams.get("symptomOrAction");
    this.symptomOrActionList = navParams.get("symptomOrActionList");
    this.accordion = navParams.get("accordion");
  }

  ngOnInit() {}

  close(thisOption?) {
    this.modalController.dismiss(thisOption);
  }

  expandItem(item) {
    item.expanded = !item.expanded;
    if (this.currentItem && this.currentItem !== item)  {
      this.currentItem.expanded = false;
    }
    this.currentItem = item;
    this.filteredSymptomOrAction = this.symptomOrActionList.filter(x => x.categoryID == item.categoryList);
    this.filteredSymptomOrAction.length == 0 && this.presentToastWithOptions(`No ${this.symptomOrAction} found. Please add ${this.symptomOrAction} in settings!`)
  }



  returnLanguage(element) {
    let elementArray = [element.enName, element.chName, element.myName, element.tmName];
    return elementArray[this.navParams.data.defaultLanguage] || element.enName;
  }
  
  @ViewChild('content')content;
  scrollToItem() {
  
    this.content.scrollToTop(1000);
    setTimeout(() => {
      this.buttonShown = false;
    }, 1000);
  }
  buttonShown: boolean = false;
  scroll(ev) {
    let currentScrollHeight = ev.target.clientHeight + ev.detail.scrollTop;
    currentScrollHeight > 1500 ? //shown when more than 20 plans https://stackoverflow.com/questions/45880214/how-to-show-hide-button-dependent-on-the-position-of-content-scroll-in-ionic-2
      this.buttonShown = true 
      : this.buttonShown = false;
  }

  async presentToastWithOptions(text) {
    const toast = await this.toastCtrl.create({
      header: text,
      duration: 3000,
      position: 'bottom',
      buttons: [{
        text: 'CLOSE',
        role: 'cancel'
      }]
    });
    toast.present();
  }
}
