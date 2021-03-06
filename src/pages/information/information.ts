import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Observable } from "rxjs/Observable";


import { DataService } from "../../providers/data-provider";

import { Data } from "../../models/data";

@Component({
    selector: 'page-information',
    templateUrl: 'information.html'
})
export class InformationPage {
    sfData: Observable<Data>;

    constructor(public navCtrl: NavController,
                private dataService: DataService) {

        this.sfData = dataService.sfData;
    }
}
