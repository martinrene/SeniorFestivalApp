import { Event } from "./event";

export class Data {
    public generationTime : number;
    public programEvents : Array<Event>;
    public activityEvents : Array<Event>;
    public info : string;
    public safety : string;
    public deluxe : string;
    public frontpageInfo : string;
    public showFrontpageInfo: boolean;
    public showMyProgram: boolean;
    public pictureUrl: boolean;
    public showMap: boolean;
    public showInfo: boolean;
    public showDeluxe: boolean;
    public showSafety: boolean;
    public showParticipants: boolean;
    public mapUrl1: string;
    public mapUrl2: string;

    constructor() {
        this.programEvents = [];
        this.activityEvents = [];
    }
}
