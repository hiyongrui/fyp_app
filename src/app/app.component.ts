import { SettingAction, Setting } from './models/symptomaction';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import {v4 as uuid} from 'uuid';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})


export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.storage.length().then(length => {
        length == 0 && (this.storage.set("settingStorageKey", this.globalSettingObj), this.storage.set("actionKey", this.globalActionObj))
      })
    });
  }

  globalSettingObj: Setting[] = [
    {
      id: uuid(),
      enName: "Fever from pdf",
      chName: "发烧",
      myName: "fever malay",
      tmName: "fever tamil",
      icon: "assets/pdfcough.png",
    },
    {
      id: uuid(),
      enName: "No breath from pdf",
      chName: "没有气息",
      myName: "no breadth malay",
      tmName: "no breadth tamil",
      icon: "assets/pdfnobreath.png"
    },
    {
      id: uuid(),
      enName: "Got breath",
      chName: "有呼吸",
      myName: "got breath malay",
      tmName: "got breath tamil",
      icon: "assets/pdfgotbreath.png"
    },
    {
      id: uuid(),
      enName: "Got cough",
      chName: "咳嗽了",
      myName: "mendapat batuk",
      tmName: "இருமல் வந்தது",
      icon: "assets/pdfredcough.png"
    },
    // {
    //   id: uuid(),
    //   enName: "High Blood Pressure",
    //   chName: "高血压",
    //   myName: "tekanan darah tinggi",
    //   tmName: "உயர் இரத்த அழுத்தம்",
    //   icon: "assets/pdfhighblood.png"
    // }
  ]
  
  globalActionObj: SettingAction[] = [
    {
      id: uuid(),
      enName: "Call 995",
      chName: "呼叫995",
      myName: "call 995 malay",
      tmName: "call 995 tamil",
      icon: "assets/pdfcall995.png",
    },
    {
      id: uuid(),
      enName: "Continue regular medications",
      chName: "继续定期服用中药",
      myName: "continue regular med malay",
      tmName: "continue regular med tamil",
      icon: "assets/pdfcontinuemed.png"
    },
    {
      id: uuid(),
      enName: "Maintain usual activities/exercise levels",
      chName: "保持通常的活动/运动水平",
      myName: "maintain usual activities malay",
      tmName: "maintain usual activities tamil",
      icon: "assets/pdfmaintain.png"
    },
    {
      id: uuid(),
      enName: "Use rescue inhalers",
      chName: "使用救援吸入器",
      myName: "Gunakan inhaler penyelamat",
      tmName: "மீட்பு இன்ஹேலரைப் பயன்படுத்தவும்",
      icon: "assets/pdfrescue.png"
    }
  ]
  
}