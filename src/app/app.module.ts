import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {IonicStorageModule} from '@ionic/storage';

import {HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import * as Hammer from 'hammerjs';
import { iosTransitionAnimation } from '@ionic/core/dist/collection/utils/transition/ios.transition.js';
import { MenuPopoverComponent } from './shared-module/menu-popover/menu-popover.component';
import { CategoryModalComponent } from './shared-module/category-modal/category-modal.component';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
//https://forum.ionicframework.com/t/page-transition-direction-in-ionic-4/148518/7
//https://github.com/ionic-team/ionic/issues/16829

export class CustomHammerConfig extends HammerGestureConfig {
  // overrides = {
  //     'press': { time: 1000 },  //set press delay for 1 second, default is 300ms
  //     'swipe': {
  //       direction: Hammer.DIRECTION_ALL
  //     },
  // }
  buildHammer(element: HTMLElement) {
    let mc = new Hammer(element, {touchAction: "pan-y"});
    mc.get("press").set({time:666});
    return mc;
  }
}

@NgModule({
  declarations: [AppComponent, MenuPopoverComponent, CategoryModalComponent],
  entryComponents: [MenuPopoverComponent, CategoryModalComponent],
  imports: [BrowserModule, IonicModule.forRoot({navAnimation: iosTransitionAnimation}), AppRoutingModule, IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    File,
    FileOpener,
    FileChooser,
    FilePath,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
