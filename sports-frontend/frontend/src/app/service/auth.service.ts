import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import { tokenIsPresent } from 'ng2-bearer';
import { environment } from '../../environments/environment';
import { ToastsManager } from 'ng2-toastr';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthService {

  constructor(private http: Http,
    @Inject(ToastsManager) public toastr: ToastsManager, ) { }

  login(username: string, password: string): Promise<void> {
    const headers = new Headers();
    const body = new URLSearchParams();

    body.set('Content-Type', 'application/x-www-form-urlencoded');
    body.set('grant_type', 'password');
    body.set('username', username);
    body.set('password', password);


    return this.http.post(environment.backEndPoint + '/api/Token', body, { headers: headers })
      .toPromise()
      .then(token => {
        localStorage.setItem('access_token', token.json().access_token);
      }).catch(err => {
        console.log(err);
        console.log('Wrong credentials');
      });
  }

  register(username: string, password: string, password2: string): Observable<any> {
    const body: any = {};
    body.email = username;
    body.password = password;
    body.confirmPassword = password2;

    return this.http.post(environment.backEndPoint + '/api/Account/Register', body)
      .map((r: Response) => r as any)
      .catch((error: any) => Observable.throw(error));
  }

  isLoggedIn() {
    return tokenIsPresent();
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userMail');
  }


}
