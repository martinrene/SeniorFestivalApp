import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DataService } from "../../providers/data-provider";

import { Data } from "../../models/data";
import { Event } from "../../models/event";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    sfData: Observable<Data>;
    showProgram: boolean;
    eventsForNow: BehaviorSubject<Event[]>;
    private mySchedule: Observable<string[]>;

    constructor(
        public navCtrl: NavController,
        private dataService: DataService) {
        this.eventsForNow = <BehaviorSubject<Event[]>>new BehaviorSubject([]);
        this.sfData = dataService.sfData;
        this.mySchedule = dataService.mySchedule;

        this.setupSubscriptions();
    }

    private setupSubscriptions(): void {
        this.mySchedule.subscribe((scheduleData1) => {
            let sub = this.sfData.subscribe((sfDta1) => {
                let dataForMySchedule = this.generateMyScheduleData(sfDta1, scheduleData1);
                this.eventsForNow.next(this.filterEventsForNow(dataForMySchedule));
                sub.unsubscribe();
            });
        });

        this.sfData.subscribe((sfDta) => {
            let sub = this.mySchedule.subscribe((scheduleData) => {
                let dataForMySchedule = this.generateMyScheduleData(sfDta, scheduleData);
                this.eventsForNow.next(this.filterEventsForNow(dataForMySchedule));

                sub.unsubscribe();
            });
        });
    }


    private generateMyScheduleData(sfData: Data, schedule: string[]): Event[] {
        let myProgram = [];
        let myActivities = [];

        if (schedule.length > 0) {
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
        }
        else {
            myProgram = sfData.programEvents;
            myActivities = sfData.activityEvents;
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

    private filterEventsForNow(completeData: Event[]): Event[] {
        let now = new Date().getTime();
        let returnArray: Event[] = [];

        let indexOfNextEvent = completeData.findIndex(item => item.startTime.getTime() > now);

        if (indexOfNextEvent == -1) {
            return [];
        }

        if (indexOfNextEvent == 0) {
            returnArray.push(completeData[0]);

            if (completeData.length > 2) {
                returnArray.push(completeData[1]);
            }
        }
        else {
            returnArray.push(completeData[indexOfNextEvent - 1]);
            returnArray.push(completeData[indexOfNextEvent]);
        }

        return returnArray;
    }
}
