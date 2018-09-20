import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ActivitiesPage } from "../pages/activities/activities";
import { InformationPage } from "../pages/information/information";
import { MapPage } from "../pages/map/map";
import { MapDetailsPage } from "../pages/map/mapdetails";
import { MySchedulePage } from "../pages/myschedule/myschedule";
import { MyScheduleDayPage } from "../pages/myschedule/myscheduleday";
import { SafetyPage } from "../pages/safety/safety";
import { SchedulePage } from "../pages/schedule/schedule";
import { ScheduleDayPage } from "../pages/schedule/scheduleday";
import { ScheduleDetailsPage } from "../pages/scheduledetails/scheduledetails";
import { ParticipantsPage } from "../pages/participants/participants";
import { ParticipantsListPage } from "../pages/participants/participantslist";
import { DeluxePage } from "../pages/deluxe/deluxe";

import { DataService } from "../providers/data-provider";
import { DataSenderService } from "../providers/data-sender";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ActivitiesPage,
    InformationPage,
    MapPage,
    MapDetailsPage,
    MySchedulePage,
    MyScheduleDayPage,
    SafetyPage,
    SchedulePage,
    ScheduleDayPage,
    ScheduleDetailsPage,
    ParticipantsPage,
    ParticipantsListPage,
    DeluxePage
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
        tabsPlacement: 'bottom',
        backButtonText: '',
        backButtonIcon: 'ios-close',
        pageTransition: 'md-transition',
        iconMode: 'ios'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ActivitiesPage,
    InformationPage,
    MapPage,
    MapDetailsPage,
    MySchedulePage,
    MyScheduleDayPage,
    SafetyPage,
    SchedulePage,
    ScheduleDayPage,
    ScheduleDetailsPage,
    ParticipantsPage,
    ParticipantsListPage,
    DeluxePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataService,
    DataSenderService
  ]
})
export class AppModule {}
