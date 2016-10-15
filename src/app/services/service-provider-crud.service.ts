/**
 * Created by Abhi on 6/11/16.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable }     from 'rxjs/Observable';

import { ServiceProviderDetails } from './service-provider-details';

@Injectable()
export class ServiceProviderCRUDService{

    constructor (private http: Http) {}

    private serviceProviderDetailsSaveUrl = 'http://localhost:9000/sender-list';
    save (serviceProviderDetails: ServiceProviderDetails ): Observable<ServiceProviderDetails> {
        let body = JSON.stringify(serviceProviderDetails);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        //noinspection TypeScriptUnresolvedFunction
        return this.http.post(this.serviceProviderDetailsSaveUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private getServiceProviderDetailsUrl = 'http://localhost:9000/service-details';
    getServiceProviderDetails (data): Observable<string> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        //noinspection TypeScriptUnresolvedFunction
        return this.http.post(this.getServiceProviderDetailsUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private selectParcelOrderUrl = 'http://localhost:9000/select-parcel';
    selectParcelOrder (senderData ): Observable<{}> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(senderData);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        //noinspection TypeScriptUnresolvedFunction
        return this.http.post(this.selectParcelOrderUrl, body, options)
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