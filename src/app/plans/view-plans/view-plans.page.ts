import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from './../../services/plan.service';
import { ActionSheetController } from '@ionic/angular';
import { PlanDetailsPage } from '../plan-details/plan-details.page';


@Component({
  selector: 'app-view-plans',
  templateUrl: './view-plans.page.html',
  styleUrls: ['./view-plans.page.scss'],
})
export class ViewPlansPage implements OnInit {

  constructor(private router: Router, private PlanService: PlanService, public actionSheetController: ActionSheetController) {

  }
  details: any;
  plan: any;

  public searchTerm: string = "";
  public items: string[];

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.PlanService.getAllPlan().then(plandetails => {
      this.details = plandetails
    });
  }
  //search item(s)
  setFilteredItems() {
    this.PlanService.getPlanFilter(this.searchTerm).then(sname => {
      this.details = sname;
      console.log(sname);
    })
    console.log("check   " + this.searchTerm);
  }

  //redirect
  onClick() {
    this.router.navigateByUrl('tabs/plans/newPlan');
  }

  //redirect
  goToTestPage() {
    this.router.navigateByUrl('/templatedetails');
  }

  goEdit(item) {
    this.router.navigateByUrl('tabs/plans/editplan/' + item.id)
  }

  deleteItem(item) {
    this.PlanService.deletePlanByID(item.id).then(item => {

    });
  }
  //Filter
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Filter by',
      buttons: [{
        text: 'Letters: A to Z',
        role: 'destructive',
        icon: 'arrow-round-down',
        handler: () => {

          console.log('A to Z');
        }
      }, {
        text: 'Letters: Z to A',
        icon: 'arrow-round-up',
        handler: () => {

          console.log('Z to A');
        }
      }, {
        text: 'Date: New to Old',
        icon: 'Trending-down',
        handler: () => {

          console.log('N to O');
        }
        // }, {
        //   text: 'Cancel',
        //   icon: 'close',
        //   role: 'cancel',
        //   handler: () => {
        //     console.log('Cancel');
        //   }
        // }]
      }]
    });
    await actionSheet.present();
  }
  //sort by date


  //sort by A-Z


  //sort by Z-A








}
