import { Component } from '@angular/core';

import { MyScheduleDayPage } from "./myscheduleday";

@Component({
    selector: 'page-myschedule',
    templateUrl: 'myschedule.html',
})
export class MySchedulePage {
    tab1Root = MyScheduleDayPage;
    tab2Root = MyScheduleDayPage;
    tab3Root = MyScheduleDayPage;

    constructor() {

    }
}
