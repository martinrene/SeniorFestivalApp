import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations'
import { Observable } from "rxjs/Observable";
import { Subscription } from "rxjs/Subscription";

import { Event } from "../../models/event";
import { DataService } from "../../providers/data-provider";

@Component({
    selector: 'page-scheduledetails',
    templateUrl: 'scheduledetails.html',
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
export class ScheduleDetailsPage {
    evt: Event;
    private mySchedule: Observable<string[]>;
    myScheduleIds: string[];
    type: number;
    links: Array<any>;

    myScheduleSubscription : Subscription;


    constructor(
        public navCtrl: NavController,
        params: NavParams,
        private dataService: DataService) {
        this.evt = params.data.evt;
        this.type = params.data.type;
        this.mySchedule = dataService.mySchedule;
        this.links = [];

        this.setupSubscriptions();
        this.generateUrlList();
    }

    generateUrlList() {
        if (this.evt) {
            if (this.evt.urls) {
                let urlSplits = this.evt.urls.split('|');

                urlSplits.forEach((item) => {

                    let splitters = item.split('!');

                    this.links.push(
                        {
                            text : splitters[0],
                            url : splitters[1]
                        }
                    );
                });
            }
        }
    }

    setupSubscriptions() {
        this.myScheduleSubscription = this.mySchedule.subscribe((val) => {
            this.myScheduleIds = val;
        });
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
        if (this.type == 1) {
            this.navCtrl.pop();
        }
    }

    isEventOnMySchedule(id: string) {
        if (this.myScheduleIds.indexOf(id) > -1) {
            return true;
        }
        return false;
    }

    imageError(evt) {
        evt.currentTarget.style.display = 'none';
    }

    navigateBack() {
        this.navCtrl.pop();
    }

    ngOnDestroy() {
        this.myScheduleSubscription.unsubscribe();
    }
}
