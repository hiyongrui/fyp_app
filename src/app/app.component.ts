import { Symptom, Action } from './models/symptomaction';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import {v4 as uuid} from 'uuid';
import { TemplateService } from './services/template.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})


export class AppComponent {

  listOfContact = ["69741678", "81201934", "95582490", "82676075", "67090093", "81057528", "66998151", "63885988", "90129366", "86504357",
                    "66489100", "85925983", "98852409", "82770593", "68910293", "85003922", "62005100", "64009220", "90119444", "80912345",
                    "69321545", "82910293", "94123412", "86663322", "68881111", "85552221", "69405123", "68493123", "91156425", "84211552",
                    "69218880", "89992134", "95348521", "81425621", "68221455", "81110922", "66603444", "67772333", "92234555", "81119231",
                    "61113333", "84144325", "95552231", "81220099", "68772233", "83252234", "67992214", "68859001", "98425932", "84419922"]
  listOfNameFirstLine = ["Gilberto Lim", "Susan Wong", "Natasha Lee", "Andrew Tan", "Timothy Ong", "Adam Khoo", "Wycliff Lee", "Tyson KM", "Donald Ng", "Lee Kim Huat",
                        "John Tan", "Robert Goh", "Reagan Tay", "Albert Lau", "Billy Ong", "Silvester Chew", "Martin Koh", "Louis Yeo", "Nicole Choo", "Grace Phua",
                        "Jeremy Toh", "Davis Tan", "Jasmine Lau", "Jermaine Chua", "Bryan Wong", "Desmond Lee", "Thierry Lim", "Hazel Lee", "Jackson Png", "Chan Lee",
                        "Kenny Lo", "Augustine Ong", "Jeff Phua", "Kenneth Tay", "Johnson Koh", "Nicolas Ong", "Vincent Tan", "Sean Lee", "David MK", "Jonathan KLW",
                        "Raphael Tan", "Terry Ong", "Tyler Soh", "Victoria Koo", "Wayne Lee", "Wesley Phua", "Amanda Ong", "Ryan Goh", "Raymond Ong", "Isabelle Yap"]
  listOfNric = ["S4323518D", "S3849800B", "S7400310I", "S2062526J", "S9967974C", "S1117255E", "S8934307J", "S9956222F", "S3344529F", "S7329310C", 
                "S4242789F", "S4602401Z", "S5097092B", "S1688952J", "S8918877F", "S4944132J", "S6659589G", "S5273909H", "S7256518E", "S2138435F",
                "S4277286J", "S1968009F", "S9257797Z", "S9693677Z", "S9387804C", "S6885672H", "S9377561I", "S9660876D", "S3747930F", "S5981933Z",
                "S5180294B", "S5024489Z", "S3926971F", "S1322990B", "S8562878Z", "S3351147G", "S9660052F", "S4550617G", "S2166511H", "S3636332J",
                "S9976053B", "S2811635G", "S7711051H", "S8719740I", "S0859994G", "S6260910I", "S2129378D", "S9702694G", "S3725048A", "S9842412C"]
  listOfPlanName = ["Bob Lee", "Ashley Ong", "Alvin Goh", "Cheryl Ng", "Marcus Choo", "Lucas Lim", "Kevin Tan", "Justin Phua", "Emma Lee", "Hazel Wong",
                    "Timothy Tan", "Ryan Lee", "Joshua Wong", "Joseph Lee", "Jayden Ong", "Ivan Goh", "Gordon Tay", "Max Lee", "Eugene Tan", "Adeline Yap", 
                    "Isabelle Ong", "Samuel Tan", "Fiona Goh", "Don Tan", "Desmond Tan", "Derrik Ong", "Darryl Ng", "Daniel Teo", "Caleb Koh", "Malcolom Chia", 
                    "Asher Ong", "Alexendra Lee", "Debbie Goh", "Grace Liew", "Joyce Quek", "Lucy Wong", "Naomi Yap", "Rachel Ho", "Michelle Pang", "Nicole Lam",
                    "Olivia Tan", "Sarah Lee", "Sharon Ng", "Valerie Tan", "Jason Lim", "Esther Ng", "Brandon Loo", "Benjamin Lee", "Angelica Yap", "Ernest Wong"]

  listOfCategory = this.templateService.globalCategory

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private templateService: TemplateService
  ) {
    // for(let i = 100; i--;) {
      // let globalPlanObj = {
          // id: uuid(),
          // ccontact: "100000" + i,
          // cname: "cname" + i,
          // createdDate: new Date().toLocaleString('en-GB', {hour12: true}), //https://angular.io/api/common/DatePipe
          // https://stackoverflow.com/a/32301169, https://stackoverflow.com/a/13136778, looping backwards date working on browser/emulator not on my device for some reason?
          // createdDate: new Date(Date.now() - (864e5 * (100-i))).toLocaleString(), 
          // language: 0,
          // name: "nameplan" + i,
          // nric: "S1234567Z" + i,
          // planName: "planName" + i,
          // appointment: [],
          // templates: []
      // }
      // this.globalPlan.push(globalPlanObj)
      for (let i = 0; i < 50; i++) {
        let planObj = {
          id: uuid(),
          ccontact: this.listOfContact[i],
          cname: "Brandon Tan",
          createdDate: new Date(Date.now() - (864e5 * (50-i))).toLocaleString('en-US'),
          language: 0,
          name: this.listOfNameFirstLine[i],
          nric: this.listOfNric[i],
          planName: this.listOfPlanName[i],
          appointment: [],
          templates: []
        }
        this.globalPlanObj.unshift(planObj)
      }
    // }
    this.initializeApp();
  }

  globalPlanObj = [];

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      setTimeout(() => {
          this.splashScreen.hide();
      }, 400); //https://stackoverflow.com/questions/546100514/why-white-screen-stuck-after-splash-screen-in-ionic-4
      // this.splashScreen.hide();
      //https://forum.ionicframework.com/t/after-splash-screen-display-white-screen-long-time/80162/100
      //https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/#preferences
      this.storage.length().then(length => {
        length == 0 && (
          this.storage.set("symptomKey", this.globalSymptomObj), this.storage.set("actionKey", this.globalActionObj), this.storage.set("planKey", this.globalPlanObj), this.storage.set("categoryKey", this.listOfCategory)
        );
      })
    });
  }

  globalSymptomObj: Symptom[] = [
    //start of 1st category symptom = Asthma, id = S1xxx
    {
      id: "S1001",
      enName: "Experience shortness of breath more than 2 times per week",
      chName: "气喘-每周超过两次",
      myName: "",
      tmName: "",
      icon: "assets/asthma/asthma-experience-shortness-of-breath-more-than-2-times-per-week.jpg",
      categoryID: this.listOfCategory[0]
    },
    {
      id: "S1002",
      enName: "More coughing than usual",
      chName: "咳嗽比平时多",
      myName: "",
      tmName: "",
      icon: "assets/asthma/asthma-more-coughing-than-usual.jpg",
      categoryID: this.listOfCategory[0]
    },
    {
      id: "S1003",
      enName: "Not able to sleep due to breathlessness",
      chName: "喘的无法入眠",
      myName: "",
      tmName: "",
      icon: "assets/asthma/asthma-not-able-to-sleep-due-to-breathlessness.jpg",
      categoryID: this.listOfCategory[0]
    },
    {
      id: "S1004",
      enName: "No shortness of breath",
      chName: "没有气喘",
      myName: "",
      tmName: "",
      icon: "assets/asthma/asthma-no-shortness-of-breath.jpg",
      categoryID: this.listOfCategory[0]
    },
    {
      id: "S1005",
      enName: "Cannot speak in full sentences",
      chName: "喘的无法说话",
      myName: "",
      tmName: "",
      icon: "assets/asthma/asthma-cannot-speak-in-full-sentences.jpg",
      categoryID: this.listOfCategory[0]
    },
    {
      id: "S1006",
      enName: "Cough worseing over 3 days, unrelieved by Salbutamol inhaler",
      chName: "",
      myName: "",
      tmName: "",
      icon: "assets/asthma/asthma-cough-worseing-over-3-days-unrelieved-by-Salbutamol-inhaler.jpg",
      categoryID: this.listOfCategory[0]
    },
    {
      id: "S1007",
      enName: "Not able to sleep due to breathlessness",
      chName: "喘的无法入眠",
      myName: "",
      tmName: "",
      icon: "assets/asthma/asthma-not-able-to-sleep-due-to-breathlessness-2.jpg",
      categoryID: this.listOfCategory[0]
    },
    //end of 1st category symptom

    //start of 2nd category symptom = COPD, id = S2xxx
    {
      id: "S2001",
      enName: "More coughing than usual",
      chName: "咳嗽比平时多",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-more-coughing-than-usual.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2002",
      enName: "Increase sputum production",
      chName: "比平常更多痰",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-increase-sputum-production.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2003",
      enName: "I have less energy for my daily activities",
      chName: "活动量减少",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-i-have-less-energy-for-my-daily-activities.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2004",
      enName: "Shortness of breath",
      chName: "气喘",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-shortness-of-breath.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2005",
      enName: "spectum is green yellow",
      chName: "青或黄色的痰",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-sputum-is-green-yellow.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2006",
      enName: "Not able to sleep due to breathlessness",
      chName: "由于呼吸困难而无法入睡",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-not-able-to-sleep-due-to-breathlessness.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2007",
      enName: "Use quick relief inhaler/nebuliser more frequent",
      chName: "更频密地使用快速吸乳器或喷雾器",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-use-quick-relief-inhaler-nebuliser-more-frequent.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2008",
      enName: "No shortness of breath",
      chName: "没有气喘",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-no-shortness-of-breath.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2009",
      enName: "cannot speak in full sentences",
      chName: "喘的无法说话",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-cannot-speak-in-full-sentences.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2010",
      enName: "chest pain",
      chName: "胸口疼痛",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-chest-pain.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2011",
      enName: "cough worsening over 3 days",
      chName: "咳嗽恶化，不受药物舒解",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-cough-worsening-over-3-days.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2012",
      enName: "fever or shaking chills",
      chName: "发烧发抖",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-fever-or-shaking-chills.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2013",
      enName: "I have less energy for my daily activities-2",
      chName: "无法进行日常作息",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-I-have-less-energy-for-my-daily-activities-2.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2014",
      enName: "severe shortness of breath even at rest",
      chName: "休息时也很喘",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-severe-shortness-of-breath-even-at-rest.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "S2015",
      enName: "Not able to sleep due to breathlessness-2",
      chName: "喘的无法入眠",
      myName: "",
      tmName: "",
      icon: "assets/COPD/copd-not-able-to-sleep-due-to-breathlessness-red.jpg",
      categoryID: this.listOfCategory[1]
    }, 
    //end of 2nd category symptom

    //start of 3rd category symptom = General, id = S3xxx
    {
      id: "S3001",
      enName: "Temperature more than 39 degree celcius",
      chName: "体温超过39度",
      myName: "",
      tmName: "",
      icon: "assets/general/general-Temperature-more-than-39-degree-celcius.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3002",
      enName: "Old pain but not relieved by pain medicine",
      chName: "长期疼痛--药物无法缓解",
      myName: "",
      tmName: "",
      icon: "assets/general/general-Old-pain-but-not-relieved-by-pain-medicine.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3003",
      enName: "old pain not worsening",
      chName: "长期疼痛--没有更加严重",
      myName: "",
      tmName: "",
      icon: "assets/general/general-old-pain-not-worsening.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3004",
      enName: "worsening shortness of breath with activity",
      chName: "做日常活动时会喘",
      myName: "",
      tmName: "",
      icon: "assets/general/general-worsening-shortness-of-breath-with-activity.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3005",
      enName: "Usual activity or exercise level",
      chName: "维持日常活动",
      myName: "",
      tmName: "",
      icon: "assets/general/general-Usual-activity-or-exercise-level.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3006",
      enName: "No shortness of breath",
      chName: "没有气喘",
      myName: "",
      tmName: "",
      icon: "assets/general/general-No-shortness-of-breath.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3007",
      enName: "High Blood glucose reading >  mmol/L",
      chName: "血糖超过 >  mmol/L",
      myName: "",
      tmName: "",
      icon: "assets/general/general-High-Blood-glucose-reading.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3008",
      enName: "Low Blood glucose reading",
      chName: "血糖少过 <  mmol/L",
      myName: "",
      tmName: "",
      icon: "assets/general/general-Low-Blood-glucose-reading.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3009",
      enName: "confused",
      chName: "精神混乱",
      myName: "",
      tmName: "",
      icon: "assets/general/general-confused.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3010",
      enName: "Temperature more than 39 degree celcius",
      chName: "体温超过度",
      myName: "",
      tmName: "",
      icon: "assets/general/general-Temperature-more-than-39-degree-celcius-2.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3011",
      enName: "New pain, never had before and worsening",
      chName: "疼痛持续增加 (新症状)",
      myName: "",
      tmName: "",
      icon: "assets/general/general-New-pain,-never-had-before-and-worsening.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3012",
      enName: "low blood presure <  mmHg",
      chName: "血压少过  mmHg",
      myName: "",
      tmName: "",
      icon: "assets/general/general-high-blood-presure-mmHg.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3013",
      enName: "high blood presure >  mmHg",
      chName: "血压超过  mmHg",
      myName: "",
      tmName: "",
      icon: "assets/general/general-low-blood-presure-mmHg.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3014",
      enName: "loss of appetite",
      chName: "没有胃口",
      myName: "",
      tmName: "",
      icon: "assets/general/general-loss-of-appetite.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "S3015",
      enName: "loss of appetite-2",
      chName: "胃口变差",
      myName: "",
      tmName: "",
      icon: "assets/general/general-loss-of-appetite-2.jpg",
      categoryID: this.listOfCategory[2]
    },
    //end of 3rd category symptom

    //start of 4th category symptom = Heart Failure, id = S4xxx
    {
      id: "S4001",
      enName: "Dry hacking cough",
      chName: "干咳",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-Dry-hacking-cough.jpg",
      categoryID: this.listOfCategory[3]
    },
    {
      id: "S4002",
      enName: "I have less energy for my daily activities",
      chName: "活动量减少",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-I-have-less-energy-for-my-daily-activities.jpg",
      categoryID: this.listOfCategory[3] 
    },
    {
      id: "S4003",
      enName: "sudden weight gain of more than  kg in 24 hours",
      chName: "24小时内体重增加  kg",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-sudden-weight-gain-of-more-than-kg-in-24-hours.jpg",
      categoryID: this.listOfCategory[3] 
    },   
    {
      id: "S4004",
      enName: "swelling of leg, ankle and feet",
      chName: "腿部浮肿 (水肿)",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-swelling-of-leg-ankle-and-feet.jpg",
      categoryID: this.listOfCategory[3] 
    },   
    {
      id: "S4005",
      enName: "No shortness of breath",
      chName: "没有气喘",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-no-shortness-of-breath.jpg",
      categoryID: this.listOfCategory[3] 
    },
    {
      id: "S4006",
      enName: "Discomfort or swelling in abdomen",
      chName: "腹部肿胀或不适",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-Discomfort-or-swelling-in-abdomen.jpg",
      categoryID: this.listOfCategory[3]
    },
    {
      id: "S4007",
      enName: "Frequent dry hacking cough",
      chName: "干咳频率增加",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-Frequent-dry-hacking-cough.jpg",
      categoryID: this.listOfCategory[3]
    },
    {
      id: "S4008",
      enName: "I have less energy for my daily activities -2",
      chName: "活动量减少",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-I-have-less-energy-for-my-daily-activities-2.jpg",
      categoryID: this.listOfCategory[3]
    },
    {
      id: "S4009",
      enName: "severe shortness of breath even at rest",
      chName: "休息时也很喘",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-severe-shortness-of-breath-even-at-rest.jpg",
      categoryID: this.listOfCategory[3]
    },
    {
      id: "S4010",
      enName: "sudden weight gain of more than kg in 24 hours - 2",
      chName: "24小时内体重增加  kg",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-sudden-weight-gain-of-more-than-kg-in-24-hours-2.jpg",
      categoryID: this.listOfCategory[3]
    },
    {
      id: "S4011",
      enName: "Increase swelling of leg, ankle and feet",
      chName: "腿部更浮肿",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-Increase-swelling-of-leg-ankle-and-feet.jpg",
      categoryID: this.listOfCategory[3]
    },
    {
      id: "S4012",
      enName: "cannot lie flat on the bed",
      chName: "无法平躺睡觉",
      myName: "",
      tmName: "",
      icon: "assets/heart-failure/heart-failure-cannot-lie-flat-on-the-bed.jpg",
      categoryID: this.listOfCategory[3]
    }, 
    //end of 4th category symptom
    
  ]
  
  globalActionObj: Action[] = [
    //start of 1st category action, id = A1xxx
    {
      id: "A1001",
      enName: "Increase use of reliever more than 2 times per week",
      chName: "每周使用缓解剂超过两次",
      myName: "",
      tmName: "",
      icon: "assets/management/management-increase-use-of-reliever-more-than-2-times-per-week.jpg",
      categoryID: this.listOfCategory[0]
    },
    //end of 1st category action

    //start of 2nd category action, id = A2xxx
    {
      id: "A2001",
      enName: "Call 995",
      chName: "拨打995",
      myName: "",
      tmName: "",
      icon: "assets/management/management-call-995.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "A2002",
      enName: "Continue your regular medicine",
      chName: "定时吃药",
      myName: "",
      tmName: "",
      icon: "assets/management/management-continue-your-regular-medicine.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "A2003",
      enName: "Start antibiotic tab every  hours",
      chName: "抗生素-每天  次，每次  粒",
      myName: "",
      tmName: "",
      icon: "assets/management/management-Start-antibiotic-tab-every-hours.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "A2004",
      enName: "Start prednisolone 5mg tab every morning for 5 days",
      chName: "类固醇5mg，每天早上吃  粒，吃  天",
      myName: "",
      tmName: "",
      icon: "assets/management/management-start-prednisolone-5mg-tab-every-morning-for-5-days.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "A2005",
      enName: "Use oxygen L hours",
      chName: "使用氧气 公升",
      myName: "",
      tmName: "",
      icon: "assets/management/management-use-oxygen.jpg",
      categoryID: this.listOfCategory[1]
    },
    {
      id: "A2006",
      enName: "Use of quick relief inhaler puffs every  hours",
      chName: "用快速吸入器，每  小时，按  次",
      myName: "",
      tmName: "",
      icon: "assets/management/management-use-of-quick-relief-inhaler.jpg",
      categoryID: this.listOfCategory[1]
    },
    //end of 2nd category action

    //start of 3rd category action, id = A3xxx
    {
      id: "A3001",
      enName: "Continue your regular medicine",
      chName: "定时吃药",
      myName: "",
      tmName: "",
      icon: "assets/management/management-continue-your-regular-medicine.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "A3002",
      enName: "low fat",
      chName: "少油",
      myName: "",
      tmName: "",
      icon: "assets/management/management-low-fat.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "A3003",
      enName: "low salt",
      chName: "少盐",
      myName: "",
      tmName: "",
      icon: "assets/management/management-low-salt.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "A3004",
      enName: "call tcs",
      chName: "致电",
      myName: "",
      tmName: "",
      icon: "assets/management/management-call-tcs.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "A3005",
      enName: "see family doctor",
      chName: "看家庭医生",
      myName: "",
      tmName: "",
      icon: "assets/management/management-see-family-doctor.jpg",
      categoryID: this.listOfCategory[2]
    },
    {
      id: "A3006",
      enName: "see polyclinics",
      chName: "看家庭医生",
      myName: "",
      tmName: "",
      icon: "assets/management/management-see-polyclinics.jpg",
      categoryID: this.listOfCategory[2]
    },
    //end of 3rd category action

    //start of 4th category action, id = A4xxx
    {
      id: "A4001",
      enName: "Continue your regular medicine",
      chName: "定时吃药",
      myName: "",
      tmName: "",
      icon: "assets/management/management-continue-your-regular-medicine.jpg",
      categoryID: this.listOfCategory[3]
    },
    {
      id: "A4002",
      enName: "Keep to fluid restriction of  L/day",
      chName: "一天不可喝超过  公升的水",
      myName: "",
      tmName: "",
      icon: "assets/management/management-Keep-to-fluid-restriction-of-L-day.jpg",
      categoryID: this.listOfCategory[3]
    },
    //end of 4th category action

  ]

  // globalPlanObj = [
  //   {
  //     id: uuid(),
  //     ccontact: "81201934", //show in plan
  //     cname: "Brandon Tan",
  //     createdDate: new Date(Date.now() - (86400000*10)).toLocaleString('en-US'), //show in plan
  //     language: 0,
  //     name: "Brandon Loo", //show on first line in plan
  //     nric: "S3849800B",
  //     planName: "Malcolm Lee", //show on header plan
  //     appointment: [],
  //     templates: []
  //   },
  //   {
  //     id: uuid(),
  //     ccontact: "95582490",
  //     cname: "Ernest Lee",
  //     createdDate:new Date(Date.now() - (86400000*5)).toLocaleString('en-US'),
  //     language: 0,
  //     name: "Ernest Tan",
  //     nric: "S7400310I",
  //     planName: "Ivan",
  //     appointment: [],
  //     templates: []
  //   },
  //   {
  //     id: uuid(),
  //     ccontact: "82676075",
  //     cname: "Angelica",
  //     createdDate:new Date(Date.now() - (86400000*9)).toLocaleString('en-US'),
  //     language: 0,
  //     name: "Amber Lim",
  //     nric: "S2062526J",
  //     planName: "John Koo",
  //     appointment: [],
  //     templates: []
  //   },
  //   {
  //     id: uuid(),
  //     ccontact: "91057528",
  //     cname: "Zoe Tay",
  //     createdDate: new Date(Date.now() - 86400000).toLocaleString('en-US'),
  //     language: 0,
  //     name: "Esther Zhang",
  //     nric: "S2062526J",
  //     planName: "Samuel Ang",
  //     appointment: [],
  //     templates: []
  //   },
  // ]
}