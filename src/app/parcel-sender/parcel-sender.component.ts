/**
 * Created by Abhi on 6/11/16.
 */

import {tokenNotExpired} from 'angular2-jwt';
import {ParcelSenderDetails} from "../services/parcel-sender-details";
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouteParams, Router } from '@angular/router-deprecated';
import { ParcelSenderCRUDService } from './../services/parcel-sender-crud.service';
import {GoogleApiService} from "../services/googleAPIService.service";
import {Panel} from "../profile/panel";


@Component({
    selector: 'parcel-sender',
    templateUrl: 'app/parcel-sender/parcel-sender.component.html',
    styleUrls: ['app/parcel-sender/parcel-sender.component.css'],
    providers: [ ParcelSenderCRUDService, Panel ],
    directives: [Panel],
})

export class ParcelSenderComponent {
    errorMessage: string;
    mode = 'Observable';
    model = new ParcelSenderDetails();
    requests: any;
    showDetails = false;
    profile:any;
    data:any;
    currentCityName: string[];
    deliveryCityName: string[];
    isLoading = false;
    fetchingCurrentAddress = false;
    isCurrentAddressLoading = false;
    fetchingDeliveryAddress = false;
    isDeliveryAddressLoading = false;
    serviceProviderSelected = false;
    submitted = false;

    currentAddressAutocomplete: any;
    deliveryAddressAutocomplete: any;
    componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };
    states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

    onSubmit() {
        this.isLoading = true;
        this.submitted = true;
        if (this.profile["id"] != null){
            this.model["_id"] = this.profile.id;
        }
        this.model['senderEmail'] = this.profile.email;
        this.currentCityName = this.model['currentCity'].split(" ");
        this.model['currentCity'] = "";
        for (var i= 0 ; i < this.currentCityName.length; i++ ){
            this.currentCityName[i] = this.currentCityName[i].charAt(0).toUpperCase() + this.currentCityName[i].slice(1).toLowerCase();
            this.model['currentCity'] =  this.model['currentCity'] + this.currentCityName[i]
            if (i + 1 < this.currentCityName.length ){
                this.model['currentCity'] =  this.model['currentCity'] + " ";
            }
        }
        this.deliveryCityName = this.model['deliveryCity'].split(" ");
        this.model['deliveryCity'] = "";
        for (var i= 0 ; i < this.deliveryCityName.length; i++ ){
            this.deliveryCityName[i] = this.deliveryCityName[i].charAt(0).toUpperCase() + this.deliveryCityName[i].slice(1).toLowerCase();
            this.model['deliveryCity'] =  this.model['deliveryCity'] + this.deliveryCityName[i]
            if (i + 1 < this.deliveryCityName.length ){
                this.model['deliveryCity'] =  this.model['deliveryCity'] + " ";
            }
        }
        if (this.model !== null){
            this.saveParcelSenderDetails(this.model);
        }        
    }
    error: any;

    status: string;
    constructor( private router: Router, private panel: Panel,
                 private googleApi:GoogleApiService,
        private parcelSenderCRUDService: ParcelSenderCRUDService,
        private routeParams: RouteParams) {
    }

    selectProvider(provider){
        this.model['serviceProvider'] = provider;
        this.serviceProviderSelected = true;
        this.selectServiceProvider(this.model)
    }

    initializeFlag(){
        this.submitted = false;
        this.serviceProviderSelected= false;
        this.isLoading =false;
    }

    ngOnInit(): void {

        this.googleApi.initAutocomplete().then(() => {
            // Create the autocomplete object, restricting the search to geographical
            // location types.
            this.currentAddressAutocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(<HTMLInputElement>document.getElementById('currentaddressautocomplete')),
                {types: ['geocode']})
            this.deliveryAddressAutocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(<HTMLInputElement>document.getElementById('deliveryaddressautocomplete')),
                {types: ['geocode']});
        });

        this.profile = JSON.parse(localStorage.getItem('profile'));
        let id = this.routeParams.get('id');
        if (id != null){
            this.profile["id"] = id;
            this.model["_id"] = id;
        }
        this.getParcelSenderDetails(this.profile);
    }

    addProviderDistanceAndDuration(requests: any){
        for (var request in requests){
            var req = request;
            //noinspection TypeScriptUnresolvedVariable
            this.panel.getDistanceAndDuration(requests[request].currentAddreddaddressLine1 + ' ' + requests[request].currentAddreddaddressLine2 + ' ' + requests[request].currentCity
                + ' ' + requests[request].currentState + ' ' + requests[request].currentZip, this.model.currentAddreddaddressLine1 + ' ' + this.model.currentAddreddaddressLine2 + ' ' + this.model.currentCity
                + ' ' + this.model.currentState + ' ' + this.model.currentZip, req, function (req: any, distanceAndDurationToSender: any) {
                requests[req]["ProviderDistanceAndDuration"] = distanceAndDurationToSender;
                return distanceAndDurationToSender;
            });
        }
    }

    fillInAddress(addressType: string) {
        // Get the place details from the autocomplete object.
        if (addressType == "Current Address"){
            let place = this.currentAddressAutocomplete.getPlace();
            this.model.currentAddreddaddressLine1 = "";
            this.model.currentAddreddaddressLine2 = "";
            this.model.currentCity = "";
            this.model.currentState ="";
            this.model.currentZip = "";

            // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            if (place != null && place.address_components != null) {
                for (let i = 0; i < place.address_components.length; i++) {
                    let addressType = place.address_components[i].types[0];
                    if (this.componentForm[addressType]) {
                        let val = place.address_components[i][this.componentForm[addressType]];
                        if (addressType == 'street_number') {
                            this.model.currentAddreddaddressLine1 = val;
                        } else if (addressType == 'route') {
                            this.model.currentAddreddaddressLine2 = val;
                        } else if (addressType == 'locality') {
                            this.model.currentCity = val;
                        } else if (addressType == 'administrative_area_level_1') {
                            this.model.currentState = val;
                        } else if (addressType == 'postal_code') {
                            this.model.currentZip = val;
                        }
                    }
                }
                if (place.address_components.length > 0){
                    setTimeout(() => {
                        this.isCurrentAddressLoading = false;
                        this.fetchingCurrentAddress = true;
                        place['address_components'] = null;
                    }, 1);
                }
            }
        }


        if (addressType == "Delivery Address"){
            let place = this.deliveryAddressAutocomplete.getPlace();
            this.model.deliveryAddreddaddressLine1 = "";
            this.model.deliveryAddreddaddressLine2 = "";
            this.model.deliveryCity = "";
            this.model.deliveryState ="";
            this.model.deliveryZip = "";

            // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            if (place != null && place.address_components != null) {
                for (let i = 0; i < place.address_components.length; i++) {
                    let addressType = place.address_components[i].types[0];
                    if (this.componentForm[addressType]) {
                        let val = place.address_components[i][this.componentForm[addressType]];
                        if (addressType == 'street_number') {
                            this.model.deliveryAddreddaddressLine1 = val;
                        } else if (addressType == 'route') {
                            this.model.deliveryAddreddaddressLine2 = val;
                        } else if (addressType == 'locality') {
                            this.model.deliveryCity = val;
                        } else if (addressType == 'administrative_area_level_1') {
                            this.model.deliveryState = val;
                        } else if (addressType == 'postal_code') {
                            this.model.deliveryZip = val;
                        }
                    }
                }
                if (place.address_components.length > 0){
                    setTimeout(() => {
                        this.isDeliveryAddressLoading = false;
                        this.fetchingDeliveryAddress = true;
                        place['address_components'] = null;
                    }, 1);
                }
            }
        }

    }
    circle: any;
    geolocation: any
    geolocate(addressType : string) {

        if (addressType == "Current Address"){
            this.isCurrentAddressLoading = true;
            this.fetchingCurrentAddress = false;
        }
        if (addressType == "Delivery Address"){
            this.isDeliveryAddressLoading = true;
            this.fetchingDeliveryAddress = false;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.geolocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                //noinspection TypeScriptValidateTypes
                this.circle = new google.maps.Circle({
                    center: this.geolocation,
                    radius: position.coords.accuracy
                });
                if (addressType == "Current Address"){
                    this.currentAddressAutocomplete.setBounds(this.circle.getBounds());
                    this.fillInAddress(addressType);
                }
                if (addressType == "Delivery Address"){
                    this.deliveryAddressAutocomplete.setBounds(this.circle.getBounds());
                    this.fillInAddress(addressType);
                }

            });
        }
    }
    
    saveParcelSenderDetails(parcelSenderDetails: ParcelSenderDetails){
        if (!parcelSenderDetails) { return; }
        //noinspection TypeScriptUnresolvedFunction,TypeScriptUnresolvedVariable
        this.parcelSenderCRUDService.save(parcelSenderDetails)
            .subscribe(
                data  => {
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 3000);
                    this.requests = [];
                    this.requests = data;
                    this.addProviderDistanceAndDuration(this.requests);
                    if(this.requests.length > 0){
                        console.log(this.showDetails);
                        this.showDetails = true;
                    }else{
                        if (this.profile["id"] != null){
                            this.router.navigate( ['Profile'] );
                        }
                        this.showDetails = false;
                    }
                },
                error =>  this.errorMessage = <any>error
            );

    }

    selectServiceProvider(senderData){
        if (!senderData) { return; }
        //noinspection TypeScriptUnresolvedFunction,TypeScriptUnresolvedVariable
        this.parcelSenderCRUDService.selectServiceProvider(senderData)
            .subscribe(
                data  => {
                    this.requests = [];
                    this.requests = data;
                    if(this.requests.length > 0){
                        this.showDetails = true;
                    }else{
                        if (this.profile["id"] != null){
                            this.router.navigate( ['Profile'] );
                        }
                        this.showDetails = false;
                    }
                },
                error =>  this.errorMessage = <any>error
            );

    }

    getParcelSenderDetails(data){
        if (!this.profile.email) { return; }
        //noinspection TypeScriptUnresolvedFunction
        this.parcelSenderCRUDService.getParcelSenderDetails(data)
            .subscribe(
                data  => {
                    this.data = data;
                    delete this.data[0]['status'];
                    delete this.data[0]['_id'];
                    if (this.data[0]['serviceProvider']){
                        delete this.data[0]['serviceProvider']
                    }
                    this.model = this.data[0];
                },
                error =>  this.errorMessage = <any>error
            );

    }

    onChange(selectedState) {
        // this.SwitchFuction(selectedState);
    }
    
    loggedIn() {
        return tokenNotExpired();
    }
}