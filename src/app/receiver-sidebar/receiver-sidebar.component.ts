/**
 * Created by Abhi on 10/17/16.
 */
import {Component} from '@angular/core'

@Component({
    selector: 'receiver-sidebar',
    templateUrl: './receiver-sidebar.component.html',
    styleUrls: ['./receiver-sidebar.component.css']
})

export class ReceiverSidebarComponent {

    actionClicked = false;
    requestsClicked = false;
    filtersClicked = false;
    
    toggleFiltersClicked(){
        this.filtersClicked = !this.filtersClicked;
    }
    toggleActionClicked(){
        this.actionClicked = !this.actionClicked;
    }

    toggleFilter(){
        this.requestsClicked = !this.requestsClicked;
    }
}