import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    @Input()
    menu: any[];

    userName = localStorage.getItem('userMail');

    constructor(private authService: AuthService,
        private router: Router) { }
    ngOnInit() {

    }
    logout() {
        if (this.authService.isLoggedIn()) {
            this.authService.logout();
            this.router.navigate(['/login']);
        }
    }

    isLoggedIn() {
        return this.authService.isLoggedIn();
    }
}
