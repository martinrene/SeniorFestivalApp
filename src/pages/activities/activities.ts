import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations'

import { Observable } from "rxjs/Observable";

import { DataService } from "../../providers/data-provider";

import { Data } from "../../models/data";
import { Event } from "../../models/event";

@Component({
    selector: 'page-activities',
    templateUrl: 'activities.html',
    animations: [
        trigger('squeezeanimation', [
            state('*', style({
                opacity: '0.85'
            })),
            transition('* => squeeze', animate('400ms ease-in', keyframes([
                style({ backgroundColor: 'rgba(60, 60, 60, 0.85)', offset: 0 }),
                style({ backgroundColor: 'rgba(60, 60, 60, 0.85)', offset: 0.1 }),
                style({ backgroundColor: 'rgba(0, 0, 0, 0.85)', offset: 0.4 }),
            ]))
        )])
    ]
})
export class ActivitiesPage {
    sfData: Observable<Data>;
    private mySchedule: Observable<string[]>;
    myScheduleIds: string[];

    constructor(public navCtrl: NavController,
                private dataService: DataService) {

        this.sfData = dataService.sfData;
        this.mySchedule = dataService.mySchedule;

        this.setupSubscriptions();
    }

    setupSubscriptions() {
        this.mySchedule.subscribe((val) => {
            this.myScheduleIds = val;
        });
    }

    imageError(evt) {
        evt.currentTarget.style.display = 'none';
    }

    addToMySchedule(evt: Event) {
        evt.state = 'squeeze';
        this.dataService.addToMySchedule(evt.id);
        setTimeout(() => {
            evt.state = '';
        }, 2000);
    }

    removeFromMySchedule(id) {
        this.dataService.removeFromMySchedule(id);
    }

    isEventOnMySchedule(id: string) {
        if (this.myScheduleIds.indexOf(id) > -1) {
            return true;
        }
        return false;
    }
}
