import { Component, Inject, ViewContainerRef, ApplicationRef } from '@angular/core';
import { BreadcrumbService } from 'ng2-breadcrumb/app/components/breadcrumbService';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

export class MenuEnum {
    static home = 'home';

    static workouts = 'workouts';
    static workoutsList = `${MenuEnum.workouts}/list`;
    static workoutsCalendar = `${MenuEnum.workouts}/calendar`;

    static exercises = 'exercises';
    static exercisesList = `${MenuEnum.exercises}/list`;
}


const Menu = [
    {
        label: 'Home',
        path: MenuEnum.home,
        icon: 'fa fa-home'
    },
    {
        label: 'Workouts',
        path: MenuEnum.workouts,
        icon: 'fa fa-list-ul',
        menu: [
            {
                label: 'Workouts List',
                path: MenuEnum.workoutsList,
                icon: 'fa fa-list-ul'
            }
        ]
    },
    {
        label: 'Exercises',
        path: MenuEnum.exercises,
        icon: 'fa fa-list-ul',
        menu: [
            {
                label: 'Exercises List',
                path: MenuEnum.exercisesList,
                icon: 'fa fa-list-ul'
            }
        ]
    },
];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    menu: any = Menu;

    loggedIn: boolean;

    constructor(private breadcrumbService: BreadcrumbService,
        private vcr: ViewContainerRef,
        private applicationRef: ApplicationRef,
        public toastr: ToastsManager) {
        this.breadcrumbsConstructor(this.menu);
        this.toastr.setRootViewContainerRef(vcr);
    }

    breadcrumbsConstructor(menu: any[]) {
        menu.forEach(item => {
            this.breadcrumbService.addFriendlyNameForRoute('/' + item.path, item.label);
            if (item.menu != null && item.menu.length > 0) {
                this.breadcrumbsConstructor(item.menu);
            }
        });
        this.breadcrumbService.addFriendlyNameForRoute('/' + 'profile', 'Profile');
        this.breadcrumbService.hideRoute('/tournaments');
        this.breadcrumbService.hideRoute('/bets');
        this.breadcrumbService.hideRoute('/leaderboards');
        this.breadcrumbService.hideRoute('/workouts');
    }


    logged() {
        this.loggedIn = true;
    }

}
