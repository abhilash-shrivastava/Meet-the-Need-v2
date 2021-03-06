/**
 * Created by Abhi on 10/16/16.
 */
/**
 * Created by Abhi on 10/15/16.
 */
import {Component} from '@angular/core';
import {Panel} from "../profile/panel";
import {RequestsService} from "../services/request.service";
import {GoogleApiService} from "../services/googleAPIService.service";
import {PaginationService} from "ng2-pagination/index";
import {tokenNotExpired} from "angular2-jwt/angular2-jwt";

@Component({
    selector: 'parcel-receiving',
    templateUrl: './parcel-receiving.component.html',
    styleUrls: ['./parcel-receiving.component.css'],
    providers: [PaginationService, RequestsService, Panel, GoogleApiService],

})

export class ParcelReceivingComponent{

    profile: any;
    assignedServiceRequests:any;
    errorMessage: string;
    showDetails = false;
    id: any;
    mapAddress:any;
    currentServiceAddress: any;
    currentSenderAddress:any;
    deliveryAddress:any;
    destinationAddress:any;
    status:any;
    card_tab=1;

    constructor(private requestsService: RequestsService,
                private panel: Panel) {
    }

    ngOnInit(){
        this.status = null;
        this.id = null;
        this.profile = JSON.parse(localStorage.getItem('profile'));
        this.profile.status = 'Parcel Given To Service Provider';
        this.getAssignedServiceRequests(this.profile);
    }

    onStatusChangeClick(parcelId){
        this.changeParcelStatus({email: this.profile.email, parcelId: parcelId});
    }

    onRejectClick(requestId, requestType){
        if (confirm("Reject Request?")){
            this.rejectRequest({requestId: requestId, requestType: requestType});
        }
    }
    
    mapLoadAssignedService(id:any, currentSenderAddress: any, currentServiceAddress:any, deliveryAddress:any, destinationAddress:any, type:any){
        
        this.currentServiceAddress = currentServiceAddress;
        this.currentSenderAddress = currentSenderAddress;
        this.deliveryAddress = deliveryAddress;
        this.destinationAddress = destinationAddress;
        
        if (this.id !== id && type === 'Title'){
            this.id = id;
            this.panel.initMap(this.id, this.currentServiceAddress, this.currentSenderAddress);
            this.mapAddress = "Map Direction To Parcel Sender";
        }
        
        if (type === 'Sender'){
            this.id = id;
            this.panel.initMap(this.id, this.currentServiceAddress, this.currentSenderAddress);
            this.mapAddress = "Map Direction To Parcel Sender";
        }
        if (type === 'Receiver'){
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

    loggedIn() {
        return tokenNotExpired();
    }
}