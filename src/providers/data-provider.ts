import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Data } from "../models/data";
import { Event } from "../models/event";
import { Participant } from "../models/participant";

@Injectable()
export class DataService {

    readonly storageKeyData = "SFData";
    readonly storageKeyMySchedule = "MitProgram";
    readonly storageKeyParticipants = "Deltagere";

    sfData: Observable<Data>;
    mySchedule: Observable<string[]>;
    participants: Observable<Participant[]>;
    private _sfData: BehaviorSubject<Data>;
    private _mySchedule: BehaviorSubject<string[]>;
    private _participants: BehaviorSubject<Participant[]>;
    private dataStore: {
        sfData: Data,
        mySchedule: string[],
        participants: Participant[]
    };

    constructor(
        public http: Http,
        private storage: Storage) {
        this.dataStore = {
            sfData: new Data(),
            mySchedule: [],
            participants: []
        };
        this._sfData = <BehaviorSubject<Data>>new BehaviorSubject(this.dataStore.sfData);
        this._mySchedule = <BehaviorSubject<string[]>>new BehaviorSubject(this.dataStore.mySchedule);
        this._participants = <BehaviorSubject<Participant[]>>new BehaviorSubject(this.dataStore.participants);
        this.sfData = this._sfData.asObservable();
        this.mySchedule = this._mySchedule.asObservable();
        this.participants = this._participants.asObservable();

        storage.get(this.storageKeyData).then((val) => {
            if (val) {
                this.dataStore.sfData = this.deserializeStringToObject(val);
                this._sfData.next(Object.assign({}, this.dataStore).sfData);
            }
        });

        storage.get(this.storageKeyMySchedule).then((val) => {
            if (val) {
                this.dataStore.mySchedule = val;
                this._mySchedule.next(Object.assign({}, this.dataStore).mySchedule);
            }
        });

        storage.get(this.storageKeyParticipants).then((val) => {
            if (val) {
                this.dataStore.participants = val;
                this._participants.next(Object.assign({}, this.dataStore).participants);
            }
        });
    }

    loadAll() {
        let urlData = '/seniorfestival17api2/getData.php?key=SeniorFestival2017';
        let urlParticipants = '/seniorfestival17api2/getParticipants.php?key=SeniorFestival2017';
        //let urlData = 'http://www.martinrene.dk/seniorfestival17api2/getData.php?key=SeniorFestival2017';
        //let urlParticipants = 'http://www.martinrene.dk/seniorfestival17api2/getParticipants.php?key=SeniorFestival2017';

        this.http.get(urlData)
            .map(response => response.json())
            .subscribe(
            dataFromService => {
                this.dataStore.sfData = this.deserializeStringToObject(dataFromService);
                this._sfData.next(Object.assign({}, this.dataStore).sfData);
                this.storage.set(this.storageKeyData, this.dataStore.sfData);
            });

        this.http.get(urlParticipants)
            .map(response => response.json())
            .subscribe(
            participantsFromService => {
                this.dataStore.participants = participantsFromService;
                this._participants.next(Object.assign({}, this.dataStore).participants);
                this.storage.set(this.storageKeyParticipants, this.dataStore.participants);
            });
    }

    addToMySchedule(id: string): void {
        if (this.dataStore.mySchedule.indexOf(id) == -1) {
            this.dataStore.mySchedule.push(id);
            this._mySchedule.next(Object.assign({}, this.dataStore).mySchedule);
            this.storage.set(this.storageKeyMySchedule, this.dataStore.mySchedule);
        }
    }

    removeFromMySchedule(id: string): void {
        let index = this.dataStore.mySchedule.indexOf(id);

        if (index > -1) {
            this.dataStore.mySchedule.splice(index, 1);
            this._mySchedule.next(Object.assign({}, this.dataStore).mySchedule);
            this.storage.set(this.storageKeyMySchedule, this.dataStore.mySchedule);
        }
    }

    deserializeStringToObject(input: any): any {
        let data: Data = new Data();
        data.generationTime = input.generationTime;
        data.info = input.info;
        data.safety = input.safety;
        data.deluxe = input.deluxe;
        data.frontpageInfo = input.frontpageInfo;
        data.showFrontpageInfo = input.showFrontpageInfo;
        data.showInfo = input.showInfo;
        data.showMap = input.showMap;
        data.showMyProgram = input.showMyProgram;
        data.showSafety = input.showSafety;
        data.showDeluxe = input.showDeluxe;
        data.mapUrl1 = input.mapUrl1;
        data.mapUrl2 = input.mapUrl2;
        data.showParticipants = input.showParticipants;
        data.pictureUrl = input.pictureUrl;

        if (input.activityEvents) {
            input.activityEvents.forEach((item) => {
                data.activityEvents.push(new Event(item.id, item.startTime, item.endTime, item.title, item.description, item.location, item.pictureUrl, item.urls, item.isJpg));
            });
        }

        if (input.programEvents) {
            input.programEvents.forEach((item) => {
                data.programEvents.push(new Event(item.id, item.startTime, item.endTime, item.title, item.description, item.location, item.pictureUrl, item.urls, item.isJpg));
            });
        }

        return data;
    }
}
