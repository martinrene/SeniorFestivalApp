import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-mapdetails',
    templateUrl: 'mapdetails.html'
})
export class MapDetailsPage {
    showFestivalPladsMap: boolean;

     constructor(public navCtrl: NavController,
        navParams: NavParams) {

        if (navParams.data === 'festivalpladsen') {
            this.showFestivalPladsMap = true;
        }
        else {
            this.showFestivalPladsMap = false;
        }
    }
}
