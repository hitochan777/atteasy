export enum AttendanceType {
    Arrive=0,
    Leave=1
}

export class Attendance {
    constructor(public id: string, public occurredAt: Date, public type: AttendanceType) {}
}