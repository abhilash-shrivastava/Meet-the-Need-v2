import { Injectable }    from '@angular/core';
import { Http, Jsonp, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class GeoByteService{

  constructor (private http: Http, private jsonp: Jsonp) {}

  getNearByCities (lat: any, lng:any, radius:any ): Observable<any> {
    let getNearByCitiesURL = 'http://gd.geobytes.com/GetNearbyCities';

    let params = new URLSearchParams();
    params.set('radius', radius); // the user's search value
    params.set('Latitude', lat);
    params.set('Longitude', lng);
    params.set('limit', '20');
    params.set('callback', 'JSONP_CALLBACK');
    params.set('format', 'json');
    //noinspection TypeScriptUnresolvedFunction
    return this.jsonp.get(getNearByCitiesURL, { search: params })
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