import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../../../../environments/environment';
import { GenericServiceClass } from '../../../service/generic.service';
import { ToastsManager } from 'ng2-toastr';
import { MenuEnum } from '../../../../../app.component';

@Component({
    selector: 'app-workout-details',
    templateUrl: './workout-details.component.html'
})
export class WorkoutDetailsComponent implements OnInit {

    exercisesList$: Observable<any>;
    exercisesUrl = environment.backEndPoint + '/api/exer';

    muscleGroupsList$: Observable<any>;
    muscleGroupsUrl = environment.backEndPoint + '/api/MuscleGroups';

    workoutUrl = environment.backEndPoint + '/api/workouts';

    exercises: any[] = [];
    workoutDays: any[] = [];
    muscleGroups: any[] = [];

    editing = false;
    loading = false;

    weeksOfMonth: any[] = [1, 2, 3, 4];
    daysOfWeek: any[] = [1, 2, 3, 4, 5, 6, 7];

    urlParam: any;
    formObject = {
        'workoutId': [null],
        'workoutName': [null, Validators.required],
        'exercise': [null],
        'workoutDayMonthWeek': [null],
        'workoutDayWeekDay': [null]
    };

    @ViewChild('form') form;

    constructor( @Inject(Router) public router: Router,
        @Inject(ActivatedRoute) public activatedRoute: ActivatedRoute,
        @Inject(FormBuilder) private formBuilder: FormBuilder,
        @Inject(GenericServiceClass) private genericService: GenericServiceClass,
        @Inject(ToastsManager) public toastr: ToastsManager, ) { }

    ngOnInit() {
        this.form = this.formBuilder.group(this.formObject);
        this.getRouterParameter();
        this.loadClasificators();
        this.loadItem();
    }

    getRouterParameter() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.urlParam = params['id'];
        });
    }

    loadClasificators() {
        this.genericService.getListByUser(this.exercisesUrl, localStorage.getItem('userId')).subscribe((data: any) => {
            this.exercisesList$ = Observable.of(data);
        });
        this.genericService.getList(this.muscleGroupsUrl).subscribe((data: any) => {
            this.muscleGroupsList$ = Observable.of(data);
        });

    }

    loadItem() {
        this.loading = true;
        if (this.urlParam !== 'new') {
            this.genericService.getItem(this.workoutUrl, this.urlParam).subscribe((data: any) => {
                this.form.controls['workoutId'].setValue(data.workoutId);
                this.form.controls['workoutName'].setValue(data.workoutName);
                this.exercises = data.exercises;
                this.workoutDays = data.workoutDays;
                this.toastr.success('Workout loaded');
                this.loading = false;
            });
        } else {
            this.loading = false;
        }
    }

    save(data, valid) {
        const workout: any = {};
        if (valid && this.exercises.length !== 0 && this.workoutDays.length !== 0) {
            workout.workoutId = data.workoutId;
            workout.workoutName = data.workoutName;
            workout.exercises = this.exercises;
            workout.workoutDays = this.workoutDays;
            workout.muscleGroups = this.muscleGroups;
            workout.ApplicationUserId = localStorage.getItem('userId');
            console.log(workout);
            if (this.urlParam === 'new') {
                this.genericService.insertItem(this.workoutUrl, workout).subscribe(res => {
                    console.log(res);
                    this.toastr.success('Workout created');
                    this.router.navigate([MenuEnum.workoutsList]);
                },
                    (err) => {
                        this.toastr.success('Workout insert error');
                    });
            } else {
                this.genericService.updateItem(this.workoutUrl + '/update', this.urlParam, workout).subscribe(res => {
                    this.toastr.success('Workout updated');
                    this.router.navigate([MenuEnum.workoutsList]);
                },
                    (err) => {
                        this.toastr.success('Workout update error');
                    });
            }
        } else {
            this.toastr.error('Please fill all required information');
        }
    }

    exerciseInMuscleGroup(exercise, muscleGroupId) {
        for (const e in exercise.muscleGroups) {
            if (exercise.muscleGroups[e].muscleGroupId === muscleGroupId) {
                return true;
            }
        }
        return false;
    }

    addExercise() {
        const exercise = this.form.controls['exercise'].value;
        let exerciseAlreadyIn = false;
        if (exercise) {
            for (const e in this.exercises) {
                if (this.exercises[e].exerciseId === exercise.exerciseId) {
                    exerciseAlreadyIn = true;
                }
            }
            if (exerciseAlreadyIn) {
                this.toastr.error('Exercise already in workout');
            } else {
                this.exercises.push(exercise);
                this.toastr.success('Exercise added');
            }
        }
    }

    addWorkoutDay() {
        const workoutDay: any = {};
        let workoutDayAlreadyIn = false;
        if (this.form.controls['workoutDayMonthWeek'].value && this.form.controls['workoutDayWeekDay'].value) {
            workoutDay.workoutDayMonthWeek = this.form.controls['workoutDayMonthWeek'].value;
            workoutDay.workoutDayWeekDay = this.form.controls['workoutDayWeekDay'].value;
            for (const w in this.workoutDays) {
                if (this.workoutDays[w].workoutDayMonthWeek === workoutDay.workoutDayMonthWeek
                    && this.workoutDays[w].workoutDayWeekDay === workoutDay.workoutDayWeekDay) {
                    workoutDayAlreadyIn = true;
                }
            }
            if (workoutDayAlreadyIn) {
                this.toastr.error('This combination of workout day is already added');
            } else {
                this.workoutDays.push(workoutDay);
                this.toastr.success('Workout day added');
            }
        } else {
            this.toastr.error('Please fill both workout day fields');
        }

    }

    deleteExercise(index) {
        this.exercises.splice(index, 1);
        this.toastr.success('Exercise removed');
    }

    deleteWorkoutDay(index) {
        this.workoutDays.splice(index, 1);
        this.toastr.success('Workout day removed');
    }

    routeBack() {
        this.router.navigate([MenuEnum.workoutsList]);
    }
}
