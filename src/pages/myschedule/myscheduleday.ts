import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DataService } from "../../providers/data-provider";

import { ScheduleDetailsPage } from "../scheduledetails/scheduledetails";

import { Data } from "../../models/data";
import { Event } from "../../models/event";

@Component({
    selector: 'page-myscheduleday',
    templateUrl: 'myscheduleday.html'
})
export class MyScheduleDayPage {
    sfData: Observable<Data>;
    eventsForDate: BehaviorSubject<Event[]>;
    private mySchedule: Observable<string[]>;
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

    private setupSubscriptions() :void {
        this.mySchedule.subscribe((scheduleData1) => {
            let sub = this.sfData.subscribe((sfDta1) => {
                let dataForMySchedule = this.generateMyScheduleData(sfDta1, scheduleData1);
                this.eventsForDate.next(this.filterEventsForDate(dataForMySchedule));
                sub.unsubscribe();
            });
        });

        this.sfData.subscribe((sfDta) => {
            let sub = this.mySchedule.subscribe((scheduleData) => {
                let dataForMySchedule = this.generateMyScheduleData(sfDta, scheduleData);
                this.eventsForDate.next(this.filterEventsForDate(dataForMySchedule));

                sub.unsubscribe();
            });
        });
    }

    imageError(evt) {
        evt.currentTarget.style.display = 'none';
    }

    openEventDetailsPage(evt) {
        this.navCtrl.push(ScheduleDetailsPage, { evt: evt, type: 1 });
    }

    private generateMyScheduleData(sfData: Data, schedule: string[]) {
        let myProgram = [];
        let myActivities = [];

        if (sfData.programEvents) {
            myProgram = sfData.programEvents.filter((item) => {
                return schedule.indexOf(item.id) > -1
            });
        }

        if (sfData.activityEvents) {
            myActivities = sfData.activityEvents.filter((item) => {
                return schedule.indexOf(item.id) > -1
            });
        }

        let myScheduledEvents = myProgram.concat(myActivities).sort((a, b) => {
            if (a.startTime < b.startTime)
                return -1;

            if (a.startTime > b.startTime)
                return 1;

            return 0;
        });

        return myScheduledEvents;
    }

    private filterEventsForDate(completeData : Event[]) {
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

        let filteredEvents = completeData.filter((item) => {
            return item.startTime.getTime() > startTime && item.startTime.getTime() < endTime;
        });

        return filteredEvents;
    }
}
