/**
 * Created by Abhi on 7/23/16.
 */
import { Injectable }    from '@angular/core';
import { Http } from '@angular/http';


const url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAXd8KlVO4CH52NrFf1yrWQEbPJAd0Zjg4&libraries=places&callback=initAutocomplete";

@Injectable()
export class GoogleApiService {
    private loadMap: Promise<any>;

    constructor(private http:Http) {
        this.loadMap = new Promise((resolve) => {
            window['initAutocomplete'] = () => {
                resolve();
            };
            this.loadScript()
        });
    }

    public initAutocomplete():Promise<any> {
        return this.loadMap;
    }

    private loadScript() {
        let script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';

        if (document.body.contains(script)) {
            return;
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    }
}