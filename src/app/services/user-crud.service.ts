/**
 * Created by Abhi on 6/14/16.
 */
/**
 * Created by Abhi on 6/11/16.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { UserDetails } from './user';

@Injectable()
export class UserCRUDService{

    constructor (private http: Http) {}

    private userDetailsSaveUrl = 'http://localhost:9000/save-user';
    save (userDetails: UserDetails ): Observable<UserDetails> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(userDetails);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.userDetailsSaveUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}