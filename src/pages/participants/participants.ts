import { Component } from '@angular/core';

import { ParticipantsListPage } from "./participantslist";

@Component({
    selector: 'page-participants',
    templateUrl: 'participants.html',
})
export class ParticipantsPage {
    tab1Root = ParticipantsListPage;
    tab2Root = ParticipantsListPage;

    constructor() {

    }
}
