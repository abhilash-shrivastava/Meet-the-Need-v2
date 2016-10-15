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

import { ParcelSenderDetails } from './parcel-sender-details';

@Injectable()
export class ParcelSenderCRUDService{

    constructor (private http: Http) {}

    private parcelSenderDetailsSaveUrl = 'http://localhost:9000/provider-list';
    save (parcelSenderDetails: ParcelSenderDetails ): Observable<ParcelSenderDetails> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(parcelSenderDetails);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        //noinspection TypeScriptUnresolvedFunction
        return this.http.post(this.parcelSenderDetailsSaveUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private getParcelSenderDetailsUrl = 'http://localhost:9000/sender-details';
    getParcelSenderDetails (data): Observable<string> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        //noinspection TypeScriptUnresolvedFunction
        return this.http.post(this.getParcelSenderDetailsUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private selectServiceProviderUrl = 'http://localhost:9000/select-provider';
    selectServiceProvider (senderData ): Observable<{}> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(senderData);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        //noinspection TypeScriptUnresolvedFunction
        return this.http.post(this.selectServiceProviderUrl, body, options)
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