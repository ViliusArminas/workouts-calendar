import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { MenuEnum } from '../../../../app.component';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr';
import { Router } from '@angular/router';
import { GenericServiceClass } from '../../service/generic.service';
import { BsModalComponent } from 'ng2-bs3-modal';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-exercises',
    templateUrl: './exercises.component.html'
})
export class ExercisesComponent implements OnInit {
    url = environment.backEndPoint + '/api/exer';
    url2 = environment.backEndPoint + '/api/exercises';
    exerciseList$: Observable<any>;

    muscleGroupsList$: Observable<any>;
    muscleGroupsUrl = environment.backEndPoint + '/api/MuscleGroups';

    loading = false;

    action: string;

    exerciseDetails: any = {};

    itemToDelete: any;

    formObject = {
        'exerciseId': [null],
        'exerciseName': [null, Validators.required],
        'muscleGroups': [null, Validators.required],
    };

    @ViewChild('deleteExerciseModal') deleteExerciseModal: BsModalComponent;
    @ViewChild('exerciseModal') exerciseModal: BsModalComponent;
    @ViewChild('exercisesForm') exercisesForm;

    constructor( @Inject(GenericServiceClass) private genericService: GenericServiceClass,
        private router: Router,
        @Inject(ToastsManager) public toastr: ToastsManager,
        @Inject(FormBuilder) private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.loading = true;
        this.exercisesForm = this.formBuilder.group(this.formObject);
        this.getExercisesList();
        this.loadClasificators();
    }

    loadClasificators() {
        this.genericService.getList(this.muscleGroupsUrl).subscribe((data: any) => {
            this.muscleGroupsList$ = Observable.of(data);
        });
    }

    getExercisesList() {
        this.genericService.getListByUser(this.url, localStorage.getItem('userId')).subscribe((data: any) => {
            this.exerciseList$ = Observable.of(data);
            this.loading = false;
        });
    }

    askToDelete(id) {
        this.itemToDelete = id;
        this.deleteExerciseModal.open();
    }

    addNewExercise() {
        this.action = 'Add new';
        this.exercisesForm = this.formBuilder.group(this.formObject);
        this.exerciseModal.open();
    }

    editExercise(exercise) {
        this.action = 'Update';
        this.exercisesForm.controls['exerciseId'].setValue(exercise.exerciseId);
        this.exercisesForm.controls['exerciseName'].setValue(exercise.exerciseName);
        if (exercise.muscleGroups[0] !== undefined) {
            this.exercisesForm.controls['muscleGroups'].setValue(exercise.muscleGroups[0]);
        } else {
            this.exercisesForm.controls['muscleGroups'].setValue(null);
        }
        this.exerciseModal.open();
    }

    deleteExercise() {
        this.genericService.deleteItem(this.url + '/delete', this.itemToDelete).subscribe(response => {
            this.toastr.success('Exercise deleted');
            this.loading = true;
            this.getExercisesList();
            this.deleteExerciseModal.close();
        },
            (error) => {
                const errMessage = JSON.parse(error._body);
                this.toastr.error(errMessage.message);
            });
    }

    saveExercise(data, valid) {
        if (valid) {
            const exerciseData: any = {};
            exerciseData.exerciseId = data.exerciseId;
            exerciseData.exerciseName = data.exerciseName;
            exerciseData.muscleGroups = [];
            exerciseData.muscleGroups[0] = data.muscleGroups;
            if (data.exerciseId !== null) {
                this.genericService.updateItem(this.url2, data.exerciseId, exerciseData).subscribe((res) => {
                    this.toastr.success('Exercise Updated');
                    this.getExercisesList();
                    this.exerciseModal.close();
                },
                    (err) => {
                        this.toastr.error('Exercise Update Error');
                    });
            } else {
                exerciseData.ApplicationUserId = localStorage.getItem('userId');
                this.genericService.insertItem(this.url, exerciseData).subscribe((res) => {
                    this.toastr.success('Exercise Inserted');
                    this.getExercisesList();
                    this.exerciseModal.close();
                },
                    (err) => {
                        this.toastr.error('Exercise Insert Error');
                    });
            }
        } else {
            this.toastr.error('Please fill all required information');
        }
    }

    equals(o1: any, o2: any) {
        return o1 === o2;
    }
}
