/**
 * Created by Abhi on 6/23/16.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable }     from 'rxjs/Observable';

import { ServiceProviderDetails } from './service-provider-details';

@Injectable()
export class RequestsService{

    constructor (private http: Http) {}

    private getAssignedServiceRequestsUrl = 'http://localhost:9000/assigned-service-request';
    getAssignedServiceRequests (data): Observable<string> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.getAssignedServiceRequestsUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private getUnassignedServiceRequestsUrl = 'http://localhost:9000/unassigned-service-request';
    getUnassignedServiceRequests (data): Observable<string> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.getUnassignedServiceRequestsUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private getAssignedSenderRequestsUrl = 'http://localhost:9000/assigned-sender-request';
    getAssignedSenderRequests (data): Observable<string> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.getAssignedSenderRequestsUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private getUnassignedSenderRequestsUrl = 'http://localhost:9000/unassigned-sender-request';
    getUnassignedSenderRequests (data): Observable<string> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.getUnassignedSenderRequestsUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    

    private getParcelReceivingRequestsUrl = 'http://localhost:9000/parcel-receiving-request';
    getParcelReceivingRequests (data): Observable<string> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.getParcelReceivingRequestsUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }
    
    private setParcelStatusUrl = 'http://localhost:9000/change-status';
    setParcelStatus (data): Observable<string> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.setParcelStatusUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private cancelRequestUrl = 'http://localhost:9000/cancel-request';
    cancelRequest (data): Observable<string> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.cancelRequestUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private updateRequestUrl = 'http://localhost:9000/update-request';
    updateRequest (data): Observable<string> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.updateRequestUrl, body, options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    private rejectRequestUrl = 'http://localhost:9000/reject-request';
    rejectRequest (data): Observable<string> {
        //console.log(serviceProviderDetails);
        let body = JSON.stringify(data);
        let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.rejectRequestUrl, body, options)
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