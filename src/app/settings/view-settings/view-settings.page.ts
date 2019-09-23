import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-view-settings',
  templateUrl: './view-settings.page.html',
  styleUrls: ['./view-settings.page.scss'],
})
export class ViewSettingsPage implements OnInit {

  constructor(private router: Router, public event:Events) { }

  ngOnInit() {
  }

  onClick(id) {
    let settingURLArray = ['/tabs/settings/category', '/tabs/settings/tutorial', '/tabs/settings/about'];
    this.router.navigateByUrl(settingURLArray[id]); //routing start from root level
  }

}
