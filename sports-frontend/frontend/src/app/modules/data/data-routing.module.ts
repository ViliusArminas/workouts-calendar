import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuEnum } from '../../../app/app.component';
import { WorkoutsListComponent } from './components/workouts/list/workouts-list.component';
import { WorkoutCalendarComponent } from './components/workout-calendar/workout-calendar.component';
import { WorkoutDetailsComponent } from './components/workouts/details/workout-details.component';
import { ExercisesComponent } from './components/exercises/exercises.component';

const routes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: MenuEnum.workoutsList, component: WorkoutsListComponent },
    { path: MenuEnum.workouts + '/:id', component: WorkoutDetailsComponent },
    { path: MenuEnum.workouts + '/new', component: WorkoutDetailsComponent },
    { path: MenuEnum.workoutsCalendar, component: WorkoutCalendarComponent },
    { path: MenuEnum.exercisesList, component: ExercisesComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DataRoutingModule { }
