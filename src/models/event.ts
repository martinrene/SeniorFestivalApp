export class Event {
    public id: string;
    public startTime: Date;
    public endTime: Date;
    public title: string;
    public description: string;
    public state: string;
    public location: string;
    public pictureUrl: string;
    public urls: string;
    public isJpg: boolean;

    constructor(id, startTimeString, endTimeString, title, description, location, pictureUrl, urls, isJpg) {
        this.id = id;
        this.startTime = new Date(startTimeString);
        this.endTime = new Date(endTimeString);
        this.title = title;
        this.description = description;
        this.location = location;
        this.pictureUrl = pictureUrl;
        this.urls = urls;
        this.isJpg = isJpg;
    }

    printStarttime(): string {
        let minutes = this.startTime.getMinutes();
        return this.dayOfWeek[this.startTime.getDay()] + ' kl. ' + this.startTime.getHours() + ':' + (minutes.toString().length == 2 ? minutes : minutes + '0');
    }

    printStarttimeShort(): string {
        let minutes = this.startTime.getMinutes();
        return this.startTime.getHours() + ':' + (minutes.toString().length == 2 ? minutes : minutes + '0');
    }

    getPictureUrl(): string {
        if (!this.pictureUrl || this.pictureUrl == '') {
            return 'assets/events/' + this.id + '.' + (this.isJpg ? 'jpg': 'png');
        }
        else {
            return this.pictureUrl;
        }
    }


    private dayOfWeek = {
        0: 'Søndag',
        1: 'Mandag',
        2: 'Tirsdag',
        3: 'Onsdag',
        4: 'Torsdag',
        5: 'Fredag',
        6: 'Lørdag'
    };
}
