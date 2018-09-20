import { Component } from '@angular/core';

import { ScheduleDayPage } from "./scheduleday";

@Component({
    selector: 'page-schedule',
    templateUrl: 'schedule.html',
})
export class SchedulePage {
    tab1Root = ScheduleDayPage;
    tab2Root = ScheduleDayPage;
    tab3Root = ScheduleDayPage;

    constructor() {

    }
}
