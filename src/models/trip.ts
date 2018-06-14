export class TripModel {
    where: string;
    startFCP: boolean
    whenDate: string;
    whenTime: string;
    howLongTotal: string;
    howLongFrom: string;
    howLongTo: string;
    moveBy: string;
    activityOption: string;
    activities: Array<{name:string}>
}
