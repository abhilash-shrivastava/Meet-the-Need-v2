/**
 * Created by Abhi on 10/17/16.
 */
import {Component, Input} from '@angular/core'
import {RequestsService} from "../services/request.service";
import {Panel} from "../profile/panel";
import {tokenNotExpired} from "angular2-jwt/angular2-jwt";
import {GoogleApiService} from "../services/googleAPIService.service";
import {PaginationService} from "ng2-pagination/index";


@Component({
    selector: 'provider-sidebar',
    templateUrl: './provider-sidebar.component.html',
    styleUrls: ['./provider-sidebar.component.css'],
    providers: [PaginationService, RequestsService, Panel, GoogleApiService],
})

export class ProviderSidebarComponent {

    profile: any;
    errorMessage: string;
    actionClicked = false;
    requestsClicked = false;
    filtersClicked = false;
    assignedServiceRequests:any;
    journeyDateClicked = false;
    showDetails = false;
    id: any;
    mapAddress:any;
    currentServiceAddress: any;
    currentSenderAddress:any;
    deliveryAddress:any;
    destinationAddress:any;
    status:any;
    showAllRequestClicked = false;


    openNav() {
      document.getElementById("mySidenav").style.width = "350px";
      document.getElementById("main").style.marginLeft = "350px";
      document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    }

    closeNav() {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft= "0";
      document.body.style.backgroundColor = "white";
    }

    constructor(private requestsService: RequestsService,
                private panel: Panel) {
    }

    ngOnInit(){
        this.status = null;
        this.id = null;
        this.profile = JSON.parse(localStorage.getItem('profile'));
        this.getAssignedServiceRequests(this.profile);
        this.openNav();
    }
    onStatusChangeClick(parcelId){
        this.changeParcelStatus({email: this.profile.email, parcelId: parcelId});
    }

    onRejectClick(requestId, requestType){
        if (confirm("Reject Request?")){
            this.rejectRequest({requestId: requestId, requestType: requestType});
        }
    }

    mapLoadAssignedService(id:any, currentSenderAddress: any, currentServiceAddress:any, deliveryAddress:any, destinationAddress:any, status:any){

        this.currentServiceAddress = currentServiceAddress;
        this.currentSenderAddress = currentSenderAddress;
        this.deliveryAddress = deliveryAddress;
        this.destinationAddress = destinationAddress;

        if (this.id !== id && (status === 'Assigned To Service Provider' || status === 'Pending Approval At Service Provider' || status === 'Pending Approval At Parcel Sender')){
            this.id = id;
            this.panel.initMap(this.id, this.currentServiceAddress, this.currentSenderAddress);
            this.mapAddress = "Map Direction To Parcel Sender";
        }
        if (this.id !== id && (status === 'Parcel Given To Service Provider' || status ==='Parcel Collected From Sender' || status ==='Parcel Delivered To Receiver' || status =='Parcel Received From Service Provider')){
            this.id = id;
            this.panel.initMap(this.id, this.destinationAddress, this.deliveryAddress);
            this.mapAddress = "Map Direction To Receiver"
        }
    }
    
    getAssignedServiceRequests(data){
        if (!this.profile.email) { return; }
        //noinspection TypeScriptUnresolvedFunction
        this.requestsService.getAssignedServiceRequests(data)
            .subscribe(
                data  => {
                    this.assignedServiceRequests = data;
                    console.log(this.assignedServiceRequests);
                    if(this.assignedServiceRequests.length > 0){
                        this.showDetails = true;
                    }else{
                        this.showDetails = false;
                        console.log(this.showDetails);
                    }
                    this.id = null;
                    this.mapLoadAssignedService(this.id, this.currentServiceAddress, this.currentSenderAddress, this.deliveryAddress, this.destinationAddress, this.status);
                },
                error =>  this.errorMessage = <any>error
            );

    }

    res: any;
    changeParcelStatus(data){
        if (!data.email || !data.parcelId) { return; }
        //noinspection TypeScriptUnresolvedFunction
        this.requestsService.setParcelStatus(data)
            .subscribe(
                data  => {
                    this.id = null;
                    this.res = data;
                    this.getAssignedServiceRequests(this.profile);
                },
                error =>  this.errorMessage = <any>error
            );
    }

    rejectRequest(data){
        if (!data.requestId || !data.requestType) { return; }
        //noinspection TypeScriptUnresolvedFunction
        this.requestsService.rejectRequest(data)
            .subscribe(
                data  => {
                    this.res = data;
                    if (this.res.role == 'Service'){
                        this.getAssignedServiceRequests(this.profile);                    }
                },
                error =>  this.errorMessage = <any>error
            );
    }
    
    toggleJourneyDate(){
        this.journeyDateClicked = !this.journeyDateClicked;
    }
    toggleFiltersClicked(){
        this.filtersClicked = !this.filtersClicked;
    }
    toggleActionClicked(){
        this.actionClicked = !this.actionClicked;
    }

    toggleFilter(){
        this.showAllRequestClicked =true;
        this.requestsClicked = !this.requestsClicked;
    }

    loggedIn() {
        return tokenNotExpired();
    }
}