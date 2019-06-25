import { Setting } from './../../models/setting';
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { SettingService } from 'src/app/services/setting.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-settings',
  templateUrl: './edit-settings.page.html',
  styleUrls: ['./edit-settings.page.scss'],
})
export class EditSettingsPage implements OnInit {

  editID: string;
  selectedTab: string;
  contentDetails: Setting = {} as any; //or put contactDetails?.enName in the html page https://stackoverflow.com/questions/35074365/typescript-interface-default-values, else have error   
  //error typeError: cannot read property 'enName' of undefined, https://stackoverflow.com/questions/47498666/cannot-read-property-of-undefined-angular-4-typescript

  // thisForm = new FormGroup({ //https://angular.io/api/forms/FormControlName#use-with-ngmodel
  //   english: new FormControl('', Validators.required),
  //   chinese: new FormControl('')
  // });

  thisForm = this.formBuilder.group({
    english: ['', Validators.required],
    chinese: '',
    malay: '',
    tamil: ''
  })

  constructor(private activatedRoute: ActivatedRoute, private settingService: SettingService, public formBuilder: FormBuilder, private router:Router) { }

  ngOnInit() {
    this.editID = this.activatedRoute.snapshot.paramMap.get("id");
    console.log("hello this page params = " + this.editID);
    this.selectedTab = this.activatedRoute.snapshot.paramMap.get("selectedTab");
    console.log("this selected tab = " + this.selectedTab);
    if (this.editID == "add") {
      this.contentDetails.enName = "New " + this.selectedTab;
    }
    else {
      this.settingService.getOneSetting(this.selectedTab, this.editID).then((obj) => {
        console.error("OBJ --->> " + JSON.stringify(obj,null,2))
        this.contentDetails = obj;
        console.log("content = " + JSON.stringify(this.contentDetails));
        this.thisForm.controls['english'].setValue(obj.enName);
        this.thisForm.controls['chinese'].setValue(obj.chName);
        this.thisForm.controls['malay'].setValue(obj.myName);
        this.thisForm.controls['tamil'].setValue(obj.tmName);
      })
    }
    // this.thisForm = this.formBuilder.group({
    //   title: new FormControl('', Validators.required)
    // })
  }

  save(value) {
    console.log("clicked save " + JSON.stringify(value));
    let newValues = {
      id: this.editID,
      enName: value.english,
      chName: value.chinese,
      myName: value.malay,
      tmName: value.tamil
    }
    let functionToCall = this.editID == "add" ? this.settingService.addReusable(this.selectedTab, newValues) : this.settingService.updateOneSetting(this.selectedTab, newValues)
    functionToCall.then(() => {
      this.goBack();
    })
  }

  goBack() {
    //this.router.navigate(['/tabs/settings/symptomAction'])
    this.router.navigateByUrl("/tabs/settings/symptomAction"); //https://stackoverflow.com/questions/41678356/router-navigate-does-not-call-ngoninit-when-same-page
  }
}
