import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class GenericServiceClass {

    constructor(private http: Http) { }

    autorizationOptions() {
        const authToken = localStorage.getItem('access_token');
        const headers = new Headers({ 'Accept': 'application/json' });
        headers.append('Authorization', `Bearer ${authToken}`);
        const options = new RequestOptions({ headers: headers });
        return options;
    }

    getList(url): Observable<any> {
        return this.http.get(url, this.autorizationOptions())
            .map((r: Response) => r.json() as any)
            .catch((error: any) => Observable.throw(error));
    }

    getListByUser(url, userId): Observable<any> {
        return this.http.get(url + '/list/' + userId, this.autorizationOptions())
            .map((r: Response) => r.json() as any)
            .catch((error: any) => Observable.throw(error));
    }

    getItem(url, id): Observable<any> {
        return this.http.get(url + '/' + id, this.autorizationOptions())
            .map((r: Response) => r.json() as any)
            .catch((error: any) => Observable.throw(error));
    }

    updateItem(url, id, item) {
        return this.http.put(url + '/' + id, item, this.autorizationOptions())
            .map((r: Response) => r.json() as any)
            .catch((error: any) => Observable.throw(error));
    }

    insertItem(url, item) {
        return this.http.post(url, item, this.autorizationOptions())
            .map((r: Response) => r.json() as any)
            .catch((error: any) => Observable.throw(error));
    }

    deleteItem(url, id) {
        return this.http.delete(url + '/' + id, this.autorizationOptions())
            .map((r: Response) => r.json() as any)
            .catch((error: any) => Observable.throw(error));
    }
}
