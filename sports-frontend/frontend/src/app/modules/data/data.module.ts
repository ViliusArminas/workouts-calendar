import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// import { ReactiveFormsModule } from '@angular/forms';

import { DataRoutingModule } from './data-routing.module';
import { GenericServiceClass } from './service/generic.service';
import { LoadingComponent } from '../util/loading.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { WorkoutsListComponent } from './components/workouts/list/workouts-list.component';
import { WorkoutCalendarComponent } from './components/workout-calendar/workout-calendar.component';
import { CalendarModule } from 'angular-calendar';
import { AlertModule } from 'ng2-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorkoutDetailsComponent } from './components/workouts/details/workout-details.component';
import { ExercisesComponent } from './components/exercises/exercises.component';

@NgModule({
    imports: [CommonModule,
        DataRoutingModule,
        HttpClientModule,
        BsModalModule,
        FormsModule,
        AlertModule.forRoot(),
        CalendarModule.forRoot(),
        BrowserAnimationsModule,
        ReactiveFormsModule],
    exports: [LoadingComponent,
        WorkoutCalendarComponent],
    declarations: [
        LoadingComponent,
        WorkoutsListComponent,
        WorkoutCalendarComponent,
        WorkoutDetailsComponent,
        ExercisesComponent],
    providers: [
        GenericServiceClass,
    ]
})
export class DataModule { }
