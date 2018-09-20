import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DataService } from "../../providers/data-provider";
import { Participant } from "../../models/participant";

@Component({
    selector: 'page-participantslist',
    templateUrl: 'participantslist.html'
})
export class ParticipantsListPage {

    participants: Observable<Participant[]>;
    participantGroupsByName: BehaviorSubject<any[]>;
    participantGroupsByKreds: BehaviorSubject<any[]>;
    sorting: string = 'navn';


    constructor(public navCtrl: NavController, public navParams: NavParams, private dataService: DataService) {
        this.participants = this.dataService.participants;
        this.participantGroupsByName = <BehaviorSubject<Participant[]>>new BehaviorSubject([]);
        this.participantGroupsByKreds = <BehaviorSubject<Participant[]>>new BehaviorSubject([]);
        this.sorting = navParams.data as string;
        this.setupSubscriptionForGroupCreation();

    }

    setupSubscriptionForGroupCreation() {
        this.participants.subscribe(data => {
            if (this.sorting === 'kreds') {
                this.participantGroupsByKreds.next(this.sortByKreds(data));
            }
            else {
                this.participantGroupsByName.next(this.sortByName(data));
            }
        });
    }

    setSearchTerm(searchTerm) {
        let subscriber = this.participants.subscribe((participants) => {
            let filtered;
            if (searchTerm.length > 0) {
                filtered = participants.filter(item => {
                    let searchTermToLower = searchTerm.toLowerCase();

                    return  ~(item.navn ? item.navn.toLocaleLowerCase().indexOf(searchTermToLower) : -1) ||
                            ~(item.kreds ? item.kreds.toLocaleLowerCase().indexOf(searchTermToLower) : -1);
                });
            }
            else {
                filtered = participants;
            }

            if (this.sorting === 'kreds') {
                this.participantGroupsByKreds.next(this.sortByKreds(filtered));
            }
            else {
                this.participantGroupsByName.next(this.sortByName(filtered));
            }

            subscriber.unsubscribe();
        });
    }

    private sortByName(data) {
        let personGroups = {};

        data.forEach(p => {
            var firstLetter = p.navn.toLocaleUpperCase().charAt(0);

            if (!personGroups[firstLetter]) {
                personGroups[firstLetter] = [];
            }
            personGroups[firstLetter].push(p);
        });

        let pGroups = [];

        for (let i in personGroups) {
            pGroups.push({ group: i.toUpperCase(), persons: personGroups[i] });
        }

        pGroups.sort((a, b) => {
            if (a.group < b.group) {
                return -1;
            }

            if (a.group > b.group) {
                return 1;
            }

            return 0;
        })
        return pGroups;
    }

    private sortByKreds(data) {
        let personGroups = {};

        let dataSortedByKreds = data.sort((a, b) => {
            if (a.kreds < b.kreds) {
                return -1;
            }

            if (a.kreds > b.kreds) {
                return 1;
            }

            return 0;
        });

        let kredse = {};

        dataSortedByKreds.forEach(p => {
            if (!kredse[p.kreds]) {
                kredse[p.kreds] = [];
            }
            kredse[p.kreds].push(p);
        });

        let kredsListe = [];

        for (let k in kredse) {
            kredse[k].sort((a, b) => {
                if (a.navn < b.navn) {
                    return -1;
                }

                if (a.navn > b.navn) {
                    return 1;
                }

                return 0;
            });

            kredsListe.push(kredse[k]);
        }


        kredsListe.forEach(p => {
            var firstLetter = p[0].kreds.toLocaleUpperCase().charAt(0);

            if (!personGroups[firstLetter]) {
                personGroups[firstLetter] = [];
            }
            personGroups[firstLetter].push(p);
        });

        let pGroups = [];

        for (let i in personGroups) {
            let kredseInGroup = [];
            personGroups[i].forEach(element => {
                kredseInGroup = kredseInGroup.concat(element);
            });
            pGroups.push({ group: i.toUpperCase(), persons: kredseInGroup });
        }

        pGroups.sort((a, b) => {
            if (a.group < b.group) {
                return -1;
            }

            if (a.group > b.group) {
                return 1;
            }

            return 0;
        });

        if (pGroups[0].group.length == 0) {
            pGroups[0].group = 'Uden kreds';
        }

        return pGroups;
    }
}
