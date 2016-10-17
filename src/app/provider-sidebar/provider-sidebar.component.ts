/**
 * Created by Abhi on 10/17/16.
 */
import {Component} from '@angular/core'

@Component({
    selector: 'provider-sidebar',
    templateUrl: './provider-sidebar.component.html',
    styleUrls: ['./provider-sidebar.component.css']
})

export class ProviderSidebarComponent {

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