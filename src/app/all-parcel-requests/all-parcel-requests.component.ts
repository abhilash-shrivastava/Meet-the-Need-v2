/**
 * Created by Abhi on 10/16/16.
 */
/**
 * Created by Abhi on 10/16/16.
 */
import {Component} from '@angular/core';
import {Panel} from "../profile/panel";
import {RequestsService} from "../services/request.service";
import {GoogleApiService} from "../services/googleAPIService.service";
import {PaginationService} from "ng2-pagination/index";
import {tokenNotExpired} from "angular2-jwt/angular2-jwt";
import { Router } from '@angular/router';


@Component({
    selector: 'all-parcel-requests',
    templateUrl: './all-parcel-requests.component.html',
    styleUrls: ['./all-parcel-requests.component.css'],
    providers: [PaginationService, RequestsService, Panel, GoogleApiService],

})

export class AllParcelRequestsComponent{
    profile: any;
    parcelRequests: any;
    errorMessage: string;
    showDetails = false;
    id: any;
    mapAddress:any;
    currentServiceAddress: any;
    currentSenderAddress:any;
    deliveryAddress:any;
    destinationAddress:any;
    status:any;
    card_tab = 1;

    constructor(private requestsService: RequestsService, private router: Router,
                private panel: Panel) {
    }

    ngOnInit(){
        this.status = null;
        this.id = null;
        this.profile = JSON.parse(localStorage.getItem('profile'));
        this.getAssignedSenderRequests(this.profile);
    }

    onStatusChangeClick(parcelId){
        this.changeParcelStatus({email: this.profile.email, parcelId: parcelId});
    }

    onRejectClick(requestId, requestType){
        if (confirm("Reject Request?")){
            this.rejectRequest({requestId: requestId, requestType: requestType});
        }
    }
    
    onCancelClick(requestId, requestType){
        if (confirm("Cancel Request?")){
            if (requestType == 'Service'){
                this.cancelRequest({requestId: requestId, requestType: requestType})
            }
            if (requestType == 'Parcel'){
                this.cancelRequest({requestId: requestId, requestType: requestType})
            }
        }
    }
    
    onUpdateClick(requestId, requestType){
        if (requestType == 'Service'){
            this.router.navigate( ['service-provider', {id: requestId}] );
        }
        if (requestType == 'Parcel'){
            this.router.navigate( ['parcel-sender', {id: requestId}] );
        }
    }
    
    mapLoadAssignedParcel(id:any, currentSenderAddress: any, currentServiceAddress:any, deliveryAddress:any, destinationAddress:any, type:any){
        
        this.currentServiceAddress = currentServiceAddress;
        this.currentSenderAddress = currentSenderAddress;
        this.deliveryAddress = deliveryAddress;
        this.destinationAddress = destinationAddress;
        
        
        if (this.id !== id && type === 'Title'){
            this.id = id;
            this.panel.initMap(this.id, this.currentSenderAddress, this.currentServiceAddress);
            this.mapAddress = "Map Direction To Service Provider";
        }
        if (type === 'Provider'){
            this.id = id;
            this.panel.initMap(this.id, this.currentSenderAddress, this.currentServiceAddress);
            this.mapAddress = "Map Direction To Service Provider";
        }
        if (type === 'Receiver'){
            this.id = id;
            this.panel.initMap(this.id, this.deliveryAddress, this.destinationAddress);
            this.mapAddress = "Map Direction from Service Provider to Receiver";
        }
    }


    getAssignedSenderRequests(data){
        if (!this.profile.email) { return; }
        //noinspection TypeScriptUnresolvedFunction
        this.requestsService.getAssignedSenderRequests(data)
            .subscribe(
                data  => {
                    this.parcelRequests = data;
                    if(this.parcelRequests.length > 0){
                        this.showDetails = true;
                    }else{
                        this.showDetails = false;
                    }
                    this.id = null;
                    this.mapLoadAssignedParcel(this.id, this.currentServiceAddress, this.currentSenderAddress, this.deliveryAddress, this.destinationAddress, this.status);

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
                    this.getAssignedSenderRequests(this.profile);
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
                        this.getAssignedSenderRequests(this.profile);
                    }
                },
                error =>  this.errorMessage = <any>error
            );
    }
    
    cancelRequest(data){
        if (!data.requestId || !data.requestType) { return; }
        //noinspection TypeScriptUnresolvedFunction
        this.requestsService.cancelRequest(data)
          .subscribe(
            data  => {
                this.res = data;
                if (this.res.role == 'Parcel'){
                    this.getAssignedSenderRequests(this.profile);
                }
            },
            error =>  this.errorMessage = <any>error
          );
    }

    loggedIn() {
        return tokenNotExpired();
    }
}