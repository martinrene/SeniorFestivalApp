import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Data } from "../models/data";
import { Event } from "../models/event";

@Injectable()
export class DataSenderService {

    constructor(
        public http: Http) {
    }

    sendNotificationSubscriptions(oneSignalId: string, subscriptions: Array<string>): void {
        if (oneSignalId) {
            let data = {
                oneSignalId: oneSignalId,
                subscriptions: subscriptions
            };

            let url = 'http://www.martinrene.dk/seniorfestival17api2/setupSubscriptions.php';

            this.http.post(url, data)
                .map(response => response.json())
                .subscribe((data) => {
                    let t = data;
                });
        }
    }
}
