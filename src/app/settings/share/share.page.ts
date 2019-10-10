import { Component, OnInit } from '@angular/core';
import { TemplateService } from 'src/app/services/template.service';
import { File } from '@ionic-native/file/ngx';

import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { PlanService } from 'src/app/services/plan.service';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  android: boolean;

  constructor(private templateService: TemplateService, private file: File, private fileChooser: FileChooser, 
    private filePath: FilePath, private planService: PlanService, private filePicker: IOSFilePicker) { 
      this.android = templateService.checkPlatformAndroid();
  }

  ngOnInit() {
  }

  async exportJSON(type) {
    let data = type == 'plan' ? await this.planService.getAllPlan() : await this.templateService.getAllTemplate("templateKey");
    let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'}); //sort name a - z , name, name (1), name (2)
    data.sort((a,b) => type == 'plan' ? collator.compare(a.planName, b.planName) : collator.compare(a.name, b.name));
    let json = {type, data};
    let fileName = type == 'plan' ? 'allPlans' : 'allTemplates';
    this.templateService.exportJSON(json, fileName);
  }

  readFile(fullPath) {
    let filePath = fullPath.substring(0, fullPath.lastIndexOf("/") + 1);
    let fileName = fullPath.substring(filePath.length);
    this.file.readAsBinaryString(filePath, fileName).then(data => {
      let jsonObj = JSON.parse(data);
      if (jsonObj.identifier !== "Crisis Management") {
        this.templateService.presentToastWithOptions("Invalid file!");
        return false;
      }
      jsonObj.type == "plan" ? this.planService.addPlanFromSharing(jsonObj.data, jsonObj.type) : this.templateService.addTemplateFromSharing(jsonObj.data, jsonObj.type);
    }).catch(err => this.templateService.throwError("Error reading file!", err));
  }

  
  openAndroid() {
    this.fileChooser.open({mime: "text/plain"}).then(uri => {
      // android uri = content://com.android.providers.downloads.documents/document/raw%3A%2Fstorage%2Femulated%2F0%2FDownload%2Fsampleionicfile.txt
      this.filePath.resolveNativePath(uri).then(resolvedFilePath => {
        // native path resolved = file:///storage/emulated/0/Download/sampleionicfile.txt
        this.readFile(resolvedFilePath);
      })
    }).catch(() => {});
  }

  openIOS() {
    this.filePicker.pickFile("public.text").then(uri => {
      // ios uri = /private/var/mobile/Containers/Data/Application/xxx/tmp/io.ionic.name/sampleionicfile.txt
      let resolvedFilePath = "file:///" + uri;
      this.readFile(resolvedFilePath);
    }).catch(() => {});
  }

}
