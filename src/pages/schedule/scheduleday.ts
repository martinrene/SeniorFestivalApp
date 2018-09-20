import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DataService } from "../../providers/data-provider";

import { ScheduleDetailsPage } from "../scheduledetails/scheduledetails";

import { Data } from "../../models/data";
import { Event } from "../../models/event";

@Component({
    selector: 'page-scheduleday',
    templateUrl: 'scheduleday.html'
})
export class ScheduleDayPage {
    sfData: Observable<Data>;
    eventsForDate: BehaviorSubject<Event[]>;
    private mySchedule: Observable<string[]>;
    myScheduleIds: string[];
    day: string;

    constructor(public navCtrl: NavController,
        private dataService: DataService,
        navParams: NavParams) {

        this.eventsForDate = <BehaviorSubject<Event[]>>new BehaviorSubject([]);
        this.sfData = dataService.sfData;
        this.mySchedule = dataService.mySchedule;
        this.day = navParams.data;

        this.setupSubscriptions();
    }

    setupSubscriptions() {
        this.mySchedule.subscribe((val) => {
            this.myScheduleIds = val;
        });

        this.sfData.subscribe((data) => {
            let startTime: number = 0;
            let endTime: number = 0;

            switch (this.day) {
                case 'friday':
                    startTime = new Date(2017, 8, 8, 0, 0).getTime();
                    endTime = new Date(2017, 8, 9, 4, 0).getTime();
                    break;

                case 'saturday':
                    startTime = new Date(2017, 8, 9, 0, 0).getTime();
                    endTime = new Date(2017, 8, 10, 4, 0).getTime();
                    break;

                case 'sunday':
                    startTime = new Date(2017, 8, 10, 0, 0).getTime();
                    endTime = new Date(2017, 8, 11, 4, 0).getTime();
                    break;

                default:
                    break;
            }

            let filteredEvents = data.programEvents.filter((item) => {
                                    return item.startTime.getTime() > startTime && item.startTime.getTime() < endTime;
                                    });

            this.eventsForDate.next(filteredEvents);
        });
    }

    imageError(evt) {
        evt.currentTarget.style.display = 'none';
    }

    openEventDetailsPage(evt) {
        this.navCtrl.push(ScheduleDetailsPage, { evt: evt, type: 0 });
    }
}
