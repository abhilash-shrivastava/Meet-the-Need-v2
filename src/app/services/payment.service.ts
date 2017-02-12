/**
 * Created by Abhi on 2/11/17.
 */
import { Injectable }    from '@angular/core';
import {Http, Jsonp, RequestOptions, Headers} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class PaymentService {
  constructor (private http: Http, private jsonp: Jsonp) {}
  
  public saveCard (cardDetails: any) {
    let saveCardDetailsURL = 'http://localhost:9000/payment-charge';
    let body = JSON.stringify(cardDetails);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': 'bearer '+localStorage.getItem('id_token')+'' });
    let options = new RequestOptions({ headers: headers });
  
    //noinspection TypeScriptUnresolvedFunction
    return this.http.post(saveCardDetailsURL, body, options)
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