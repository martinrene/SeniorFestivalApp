import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Observable } from "rxjs/Observable";

import { Data } from "../models/data";

import { HomePage } from '../pages/home/home';
import { ActivitiesPage } from "../pages/activities/activities";
import { InformationPage } from "../pages/information/information";
import { MapPage } from "../pages/map/map";
import { MySchedulePage } from "../pages/myschedule/myschedule";
import { SafetyPage } from "../pages/safety/safety";
import { SchedulePage } from "../pages/schedule/schedule";
import { ScheduleDetailsPage } from "../pages/scheduledetails/scheduledetails";
import { ParticipantsPage } from "../pages/participants/participants";
import { DeluxePage } from "../pages/deluxe/deluxe";

import { DataService } from "../providers/data-provider";
import { DataSenderService } from "../providers/data-sender";
import { Subscription } from 'rxjs';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    @ViewChild('fabmenu') fabMenu;

    private onResumeSubscription: Subscription;
    rootPage: any = HomePage;
    pages: Array<{ title: string, icon: string, component: any }>;
    data: Observable<Data>;
    mySchedule: Observable<string[]>;
    oneSignalId: string;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        private menuCtrl: MenuController,
        private dataService: DataService,
        private dataSenderService: DataSenderService) {

        this.onResumeSubscription = platform.resume.subscribe(() => {
            this.dataService.loadAll();
        });

        this.data = this.dataService.sfData;
        this.mySchedule = this.dataService.mySchedule;
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.

            this.setupMenuSubscription();
            this.setupSubscriptionsSubscription();
            this.statusBar.styleDefault();
            this.splashScreen.hide();


            if (window["plugins"] && window["plugins"].OneSignal) {
                let thats = this;
                var notificationOpenedCallback = function (jsonData) {
                    if (jsonData.notification && jsonData.notification.payload.additionalData) {
                        if (jsonData.notification.payload.additionalData.eventId) {
                            // Slå aktivitet op
                            let subs1 = thats.data.subscribe((dataFromService) => {
                                let event = dataFromService.activityEvents.find(evt => evt.id == jsonData.notification.payload.additionalData.eventId);
                                if (event) {
                                    thats.nav.push(ScheduleDetailsPage, { evt: event, type: 1});
                                }
                                subs1.unsubscribe();
                            });
                        }
                        else if (jsonData.notification.payload.additionalData.programId) {
                            let subs2 = thats.data.subscribe((dataFromService) => {
                                let event = dataFromService.programEvents.find(evt => evt.id == jsonData.notification.payload.additionalData.programId);
                                if (event) {
                                    thats.nav.push(ScheduleDetailsPage, { evt: event, type: 0});
                                }
                                subs2.unsubscribe();
                            });
                        }
                    }

                };

                window["plugins"].OneSignal
                    .startInit("a4795203-cdf8-453a-817a-e92a29e2b980", "688154094572")
                    .handleNotificationOpened(notificationOpenedCallback)
                    .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.None)
                    .endInit();

                let that = this;

                window["plugins"].OneSignal.getPermissionSubscriptionState(function (status) {
                    that.oneSignalId = status['subscriptionStatus']['userId'];
                });

            }
        });
    }

    openPage(page) {
        this.nav.setRoot(page.component);
        this.menuCtrl.close();
    }

    menuClosed() {
        this.fabMenu.close();
    }

    setupMenuSubscription() {
        this.data.subscribe((dataFromService) => {
            this.pages = [
                { title: 'Seniorfestival', icon: 'fdf', component: HomePage }];


            if (dataFromService) {
                if (dataFromService.showMyProgram) {
                    this.pages.push({ title: 'Mit Program', icon: 'star', component: MySchedulePage });
                }
            }

            this.pages.push({ title: 'Scene', icon: 'ios-musical-notes', component: SchedulePage });
            this.pages.push({ title: 'Aktiviteter', icon: 'ios-football', component: ActivitiesPage });

            if (dataFromService) {
                if (dataFromService.showMap) {
                    this.pages.push({ title: 'Kort', icon: 'md-globe', component: MapPage });
                }

                if (dataFromService.showParticipants) {
                    this.pages.push({ title: 'Deltagere', icon: 'personer', component: ParticipantsPage });
                }

                if (dataFromService.showInfo) {
                    this.pages.push({ title: 'Information', icon: 'ios-information', component: InformationPage });
                }

                if (dataFromService.showSafety) {
                    this.pages.push({ title: 'Sikkerhed', icon: 'ios-medkit', component: SafetyPage });
                }

                if (dataFromService.showDeluxe) {
                    this.pages.push({ title: 'Deluxe', icon: 'ios-bowtie', component: DeluxePage });
                }
            }
        });

        this.dataService.loadAll();
    }

    setupSubscriptionsSubscription() {
        this.mySchedule.subscribe((subscriptions) => {
            this.dataSenderService.sendNotificationSubscriptions(this.oneSignalId, subscriptions);
        });
    }

    ngOnDestroy() {
        this.onResumeSubscription.unsubscribe();
    }
}
