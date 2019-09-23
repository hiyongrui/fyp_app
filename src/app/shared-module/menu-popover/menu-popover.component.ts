import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-menu-popover',
  templateUrl: './menu-popover.component.html',
  // styleUrls: ['./menu-popover.component.scss'],
})
export class MenuPopoverComponent implements OnInit {

  menuOptions = [];

  constructor(private popoverController: PopoverController, private navParams: NavParams) {
    this.menuOptions = navParams.get("menuOptions");
  }

  ngOnInit() {}

  close(thisOption) {
    this.popoverController.dismiss(thisOption);
  }

}
