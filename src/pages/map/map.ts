import { Component } from '@angular/core';

import { MyScheduleDayPage } from "../myschedule/myscheduleday";
import { MapDetailsPage } from "./mapdetails";


@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {
    tab1Root = MapDetailsPage;
    tab2Root = MapDetailsPage;

    constructor() {

    }
}
