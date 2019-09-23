import { Component, OnInit } from '@angular/core';
import { TemplateService } from 'src/app/services/template.service';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  categoryList = [];

  constructor(private templateService: TemplateService, private event: Events, private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.categoryList = this.templateService.globalCategory;
  }

  selectedCategory(item) {
    this.router.navigateByUrl('/tabs/settings/symptomAction').then(() => {
      this.event.publish("category", item);
    })
  }

}
