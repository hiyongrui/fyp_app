import { Component, OnInit } from '@angular/core';
import { TemplateService } from 'src/app/services/template.service';
import { File } from '@ionic-native/file/ngx';

import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { PlanService } from 'src/app/services/plan.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  path = this.file.externalRootDirectory + '/Download/'; // for Android https://stackoverflow.com/questions/49051139/saving-file-to-downloads-directory-using-ionic-3
  fileName = 'sampleionicfile.json';

  constructor(private templateService: TemplateService, private file: File, private fileChooser: FileChooser, private filePath: FilePath, private planService: PlanService) { }

  ngOnInit() {
  }

  async exportJSON(type) {
    let data = type == 'plan' ? await this.planService.getAllPlan() : await this.templateService.getAllTemplate("templateKey");
    let json = {type, data};
    console.warn("json data export", json);
    this.templateService.exportJSON(json, `All ${type} exported!`);
  }

  openFile() {
    this.fileChooser.open().then(uri => {
      console.warn("uri", uri); //content://com.android.providers.downloads.documents/document/raw%3A%2Fstorage%2Femulated%2F0%2FDownload%2Fsampleionicfile.json
      this.filePath.resolveNativePath(uri).then(resolvedFilePath => {
        console.error("resolved", resolvedFilePath); //file:///storage/emulated/0/Download/sampleionicfile.json

        let path = resolvedFilePath.substring(0, resolvedFilePath.lastIndexOf('/')); //file:///storage/emulated/0/Download
        let file = resolvedFilePath.substring(resolvedFilePath.lastIndexOf('/') + 1, resolvedFilePath.length); //sampleionicfile.json
        console.log("path", path);
        console.log("file", file);

        this.readFile(path, file);
      })
    })
  }

  readFile(path, file) {
    this.file.readAsBinaryString(path, file).then(data => {
      
      let jsonObj = JSON.parse(data);
      console.warn("JSon obj imported", jsonObj);

      jsonObj.type == "plan" ? this.planService.addPlanFromSharing(jsonObj.data) : this.templateService.addTemplateFromSharing(jsonObj.data);

    })
  }

}
