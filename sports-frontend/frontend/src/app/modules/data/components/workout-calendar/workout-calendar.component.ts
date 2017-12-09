import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { getMonth, startOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { AlertModule } from 'ng2-bootstrap';
import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarDateFormatter
} from 'angular-calendar';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import * as RRule from 'rrule';
import { GenericServiceClass } from '../../service/generic.service';
import { environment } from '../../../../../environments/environment';
import { BsModalComponent } from 'ng2-bs3-modal';


const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};

interface RecurringEvent {
    id: number;
    title: string;
    color: any;
    rrule?: {
        freq: RRule.Frequency,
        bymonth?: number,
        bymonthday?: number,
        byweekday?: RRule.Weekday[]
    };
}


@Component({
    selector: 'app-workout-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './workout-calendar.component.html',
    styles: ['./workout-calendar.component.css']
})

export class WorkoutCalendarComponent implements OnInit {

    workouts: any[];
    loading = false;
    itemLoading: boolean;

    workoutDetails: any = {};

    url = environment.backEndPoint + '/api/workouts';

    view = 'month';
    locale = 'en';
    refresh: Subject<any> = new Subject();

    viewDate: Date = new Date();
    otherDate: Date = new Date();
    endDate = this.otherDate.setMonth(this.otherDate.getMonth() + 1);

    calendarEvents: CalendarEvent[] = [];
    activeDayIsOpen = true;
    recurringEvents: RecurringEvent[] = [];

    @ViewChild('workoutsDetailsModal') workoutsDetailsModal: BsModalComponent;


    constructor(private modal: AlertModule, private genericServiceClass: GenericServiceClass, private ref: ChangeDetectorRef) { }

    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    ngOnInit() {
        this.refreshList();
    }

    refreshList() {

        this.genericServiceClass.getListByUser(this.url, localStorage.getItem('userId')).subscribe(c => {
            this.workouts = c;
            this.workouts.forEach(work => {
                work.workoutDays.forEach(day => {

                    const data = {
                        id: work.workoutId,
                        title: work.workoutName,
                        color: colors.red,
                        rrule: {
                            freq: RRule.MONTHLY,
                            byweekday: this.getWeekDayTwoCharsCode(day.workoutDayWeekDay).nth(+day.workoutDayMonthWeek),
                        }
                    };
                    this.recurringEvents.push(data);
                });
            });

            this.updateCalendarEvents(this.recurringEvents);
            this.loading = false;
            this.refresh.next();
        },
            err => {
                if (err.status === 401) {
                }
            });

    }

    dayClicked({ date, events }: { date: Date, events: RecurringEvent[] }): void {

        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
    }

    handleEvent(action: string, event: RecurringEvent): void {
        this.openWorkout(event.id);
        this.workouts.slice();
    }

    openWorkout(id) {
        this.itemLoading = true;
        this.genericServiceClass.getItem(this.url, id).subscribe((data: any) => {
            this.workoutDetails = data;
            this.itemLoading = false;
            this.workoutsDetailsModal.open();
            this.ref.markForCheck();
        });
    }

    updateCalendarEvents(recurringEvents: RecurringEvent[]): void {

        this.calendarEvents = [];

        const startOfPeriod: any = {
            month: startOfMonth,
            week: startOfWeek,
            day: startOfDay
        };

        const endOfPeriod: any = {
            month: endOfMonth,
            week: endOfWeek,
            day: endOfDay
        };

        this.recurringEvents.forEach(event => {
            const rule: RRule = new RRule(Object.assign({}, event.rrule, {
                dtstart: startOfPeriod[this.view](this.viewDate),

                until: endOfPeriod[this.view](this.endDate)
            }));

            rule.all().forEach((date) => {
                this.calendarEvents.push(Object.assign({}, event, {
                    start: new Date(date)
                }));
            });
        });
        this.refresh.next();
    }

    getWeekDayTwoCharsCode(weekDay: number) {
        switch (weekDay) {
            case 1:
                return RRule.MO;
            case 2:
                return RRule.TU;
            case 3:
                return RRule.WE;
            case 4:
                return RRule.TH;
            case 5:
                return RRule.FR;
            case 6:
                return RRule.SA;
            case 7:
                return RRule.SU;
            default:
                return null;
        }
    }

}
