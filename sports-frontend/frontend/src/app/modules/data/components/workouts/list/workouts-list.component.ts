import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GenericServiceClass } from '../../../service/generic.service';
import { environment } from '../../../../../../environments/environment';
import { BsModalComponent } from 'ng2-bs3-modal';
import { MenuEnum } from '../../../../../app.component';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

@Component({
    selector: 'app-workouts-list',
    templateUrl: './workouts-list.component.html',
    styles: [
    ]
})
export class WorkoutsListComponent implements OnInit {

    url = environment.backEndPoint + '/api/workouts';

    route = MenuEnum.workouts;

    workoutsList$: Observable<any>;

    loading = false;

    workoutDetails: any = {};

    itemToDelete: any;

    @ViewChild('workoutsDetailsModal') workoutsDetailsModal: BsModalComponent;
    @ViewChild('deleteWorkoutModal') deleteWorkoutModal: BsModalComponent;

    constructor( @Inject(GenericServiceClass) private genericService: GenericServiceClass,
        private router: Router,
        @Inject(ToastsManager) public toastr: ToastsManager, ) { }

    ngOnInit() {
        this.loading = true;
        this.getWorkoutList();
    }

    getWorkoutList() {
        this.genericService.getListByUser(this.url, localStorage.getItem('userId')).subscribe((data: any) => {
            this.workoutsList$ = Observable.of(data);
            this.loading = false;
        });
    }
    showWorkout(item) {
        this.workoutDetails = item;
        this.workoutsDetailsModal.open();
    }

    addNewWorkout() {
        this.router.navigate([this.route + '/new']);
    }

    editWorkout(id) {
        this.router.navigate([this.route + '/' + id]);
    }

    askToDelete(id) {
        this.itemToDelete = id;
        this.deleteWorkoutModal.open();
    }

    deleteWorkout() {
        this.genericService.deleteItem(this.url, this.itemToDelete).subscribe(response => {
            this.toastr.success('Workout deleted');
            this.loading = true;
            this.getWorkoutList();
            this.deleteWorkoutModal.close();
        });
    }
}
