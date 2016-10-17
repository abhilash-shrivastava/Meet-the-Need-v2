/**
 * Created by Abhi on 10/17/16.
 */
import {Component} from '@angular/core'

@Component({
    selector: 'sender-sidebar',
    templateUrl: './sender-sidebar.component.html',
    styleUrls: ['./sender-sidebar.component.css']
})

export class SenderSidebarComponent {

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