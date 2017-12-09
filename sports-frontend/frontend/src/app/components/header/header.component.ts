import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { RequestOptions, Headers, Http } from '@angular/http';
import { environment } from '../../../environments/environment';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userName = localStorage.getItem('userMail');
  login_username: string;
  login_password: string;
  register_username: string;
  register_password: string;
  register_password2: string;
  registerOpen = false;

  wrongCredentials: boolean;
  loggedOut: boolean;

  constructor(private authService: AuthService,
    private router: Router,
    private http: Http,
    @Inject(ToastsManager) public toastr: ToastsManager, ) { }
  ngOnInit() {

  }
  logout() {
    if (this.authService.isLoggedIn()) {
      this.authService.logout();
      this.router.navigate(['/home']);
    }
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  registerButton(event) {
    event.stopPropagation();
    this.registerOpen = true;
  }

  registerButtonCancel(event) {
    event.stopPropagation();
    this.registerOpen = false;
  }

  register(event) {
    event.stopPropagation();
    this.authService.register(this.register_username, this.register_password, this.register_password2).subscribe((response) => {
      this.registerOpen = false;
      this.toastr.success('Registration succesfull');
    },
      (error) => {
        const errMessage = JSON.parse(error._body);
        this.toastr.error(errMessage.message);
      });
  }

  login(event) {
    event.stopPropagation();
    this.wrongCredentials = false;
    this.authService.login(this.login_username, this.login_password).then(() => {
      if (this.authService.isLoggedIn()) {
        const authToken = localStorage.getItem('access_token');
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', `Bearer ${authToken}`);
        const options = new RequestOptions({ headers: headers });
        this.http.get(environment.backEndPoint + '/api/Account/UserInfo', options).subscribe((data: any) => {
          const d: any = JSON.parse(data._body);
          this.toastr.success('Logged in');
          localStorage.setItem('userMail', d.email);
          localStorage.setItem('userId', d.id);
          this.userName = d.email;
        });
        this.router.navigate(['/']);

      } else {
        this.wrongCredentials = true;
      }
    });
    return true;
  }

}
