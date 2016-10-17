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
    selector: 'receiver-action',
    templateUrl: './receiver-action.component.html',
    styleUrls: ['./receiver-action.component.css'],
    providers: [PaginationService, RequestsService, Panel, GoogleApiService],

})

export class ReceiverActionComponent{

    profile: any;
    parcelReceivingRequests:any;
    errorMessage: string;
    showDetails = false;
    id: any;
    mapAddress:any;
    currentServiceAddress: any;
    currentSenderAddress:any;
    deliveryAddress:any;
    destinationAddress:any;
    status:any;

    constructor(private requestsService: RequestsService,
                private panel: Panel) {
    }

    ngOnInit(){
        this.status = null;
        this.id = null;
        this.profile = JSON.parse(localStorage.getItem('profile'));
        this.profile.status = 'Parcel Delivered To Receiver';
        this.getParcelReceivingRequests(this.profile);
    }

    onStatusChangeClick(parcelId){
        this.changeParcelStatus({email: this.profile.email, parcelId: parcelId});
    }

    mapLoadAssignedReceiver(id:any, currentSenderAddress: any, currentServiceAddress:any, deliveryAddress:any, destinationAddress:any, status:any){

        this.currentServiceAddress = currentServiceAddress;
        this.currentSenderAddress = currentSenderAddress;
        this.deliveryAddress = deliveryAddress;
        this.destinationAddress = destinationAddress;

        if (this.id !== id && (status == 'Assigned To Service Provider' || status === 'Pending Approval At Service Provider' || status === 'Pending Approval At Parcel Sender')){
            this.id = id;
            this.panel.initMap(this.id, this.currentSenderAddress, this.currentServiceAddress);
            this.mapAddress = "Map Direction Between Service Provider and Parcel Sender";
        }
        if (this.id !== id && (status == 'Parcel Given To Service Provider' || status =='Parcel Collected From Sender' || status =='Parcel Delivered To Receiver' || status =='Parcel Received From Service Provider')){
            this.id = id;
            this.panel.initMap(this.id, this.deliveryAddress, this.destinationAddress);
            this.mapAddress = "Map Direction To Service Provider";
        }
    }

    getParcelReceivingRequests(data){
        if (!this.profile.email) { return; }
        //noinspection TypeScriptUnresolvedFunction
        this.requestsService.getParcelReceivingRequests(data)
            .subscribe(
                data  => {
                    this.parcelReceivingRequests = data;
                    if(this.parcelReceivingRequests.length > 0){
                        this.showDetails = true;
                    }else{
                        this.showDetails = false;
                    }
                    this.id = null;
                    this.mapLoadAssignedReceiver(this.id, this.currentServiceAddress, this.currentSenderAddress, this.deliveryAddress, this.destinationAddress, this.status);

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
                    this.getParcelReceivingRequests(this.profile);
                },
                error =>  this.errorMessage = <any>error
            );
    }

    loggedIn() {
        return tokenNotExpired();
    }
}