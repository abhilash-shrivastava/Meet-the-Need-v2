/**
 * Created by Abhi on 7/30/16.
 */
import { Directive, OnInit, OnDestroy } from '@angular/core';



let nextId = 1;

// Spy on any element to which it is applied.
// Usage: <div mySpy>...</div>
@Directive({selector: '[myMap]'})
export class MapDirective implements OnInit, OnDestroy {
    
    ngOnInit()    { this.logIt(`onInit`); }

    ngOnDestroy() { this.logIt(`onDestroy`); }

    private logIt(msg: string) {
    }
}