/**
 * Created by Abhi on 6/11/16.
 */

import {tokenNotExpired} from 'angular2-jwt';
import {ParcelSenderDetails} from "../services/parcel-sender-details";
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ParcelSenderCRUDService } from './../services/parcel-sender-crud.service';
import {GoogleApiService} from "../services/googleAPIService.service";
import {Panel} from "../profile/panel";
import {ActivatedRoute } from '@angular/router';
import {PaginationService} from "ng2-pagination";
import {PriceCalculatorService} from "../services/priceCalculator.service";


@Component({
    selector: 'parcel-sender',
    templateUrl: './parcel-sender.component.html',
    styleUrls: ['./parcel-sender.component.css'],
    providers: [ ParcelSenderCRUDService, Panel, GoogleApiService, PaginationService, PriceCalculatorService ]
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
    id: any;
    mapAddress:any;
    currentServiceAddress: any;
    currentSenderAddress:any;
    deliveryAddress:any;
    destinationAddress:any;

    currentAddressAutocomplete: any;
    deliveryAddressAutocomplete: any;
    segment = 1;
    disabled1 = true;
    disabled2 = false;
    disabled3 = false;
    disabled4 = false;
    disabled5 = false;
    disabled6 = false;
    class1 = 'btn btn-primary btn-circle';
    class2 = 'btn btn-default btn-circle';
    class3 = 'btn btn-default btn-circle';
    class4 = 'btn btn-default btn-circle';
    class5 = 'btn btn-default btn-circle';
    class6 = 'btn btn-default btn-circle';
    geocoder: any;
    card_tab = 1;
    parcelRates: any;
    private sub: any;      // -> Subscriber
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
    constructor( private panel: Panel,
                 public route: ActivatedRoute,
                 private googleApi:GoogleApiService,
                 private parcelSenderCRUDService: ParcelSenderCRUDService,
                private paginationService: PaginationService, private priceCalculatorService: PriceCalculatorService) {
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
        this.requests = [];
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
            this.profile = JSON.parse(localStorage.getItem('profile'));
            // get URL parameters
            this.sub = this.route
              .params
              .subscribe(params => {
                  this.profile["id"] = params['id'];
                  this.model["_id"] = params['id'];
                  console.log(this.profile.id);
              });
            this.getParcelSenderDetails(this.profile);
        });
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
    addReceiverDistanceAndDuration(requests: any){
        for (var request in requests){
            var req = request
            //noinspection TypeScriptUnresolvedVariable
            this.panel.getDistanceAndDuration(requests[request].destinationAddreddaddressLine1 + ' ' + requests[request].destinationAddreddaddressLine2 + ' ' + requests[request].destinationCity
              + ' ' + requests[request].destinationState + ' ' + requests[request].destinationZip, this.model.deliveryAddreddaddressLine1 + ' ' + this.model.deliveryAddreddaddressLine2 + ' ' + this.model.deliveryCity
              + ' ' + this.model.deliveryState + ' ' + this.model.deliveryZip, req, function (req: any, distanceAndDurationToReceiver: any) {
                requests[req]["ReceiverDistanceAndDuration"] = distanceAndDurationToReceiver;
                return distanceAndDurationToReceiver;
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
            var completeCurrentAddress=""
    
            // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            if (place != null && place.address_components != null) {
                for (let i = 0; i < place.address_components.length; i++) {
                    let addressType = place.address_components[i].types[0];
                    if (this.componentForm[addressType]) {
                        let val = place.address_components[i][this.componentForm[addressType]];
                        if (addressType == 'street_number') {
                            this.model.currentAddreddaddressLine1 = val;
                            completeCurrentAddress = val;
                        } else if (addressType == 'route') {
                            this.model.currentAddreddaddressLine2 = val;
                            completeCurrentAddress = completeCurrentAddress + ' ' + val;
                        } else if (addressType == 'locality') {
                            this.model.currentCity = val;
                            completeCurrentAddress = completeCurrentAddress + ' ' + val;
                        } else if (addressType == 'administrative_area_level_1') {
                            this.model.currentState = val;
                            completeCurrentAddress = completeCurrentAddress + ' ' + val;
                        } else if (addressType == 'postal_code') {
                            this.model.currentZip = val;
                            completeCurrentAddress = completeCurrentAddress + ' ' + val;
                        }
                    }
                }
                this.geocoder = new google.maps.Geocoder();
                this.geocoder.geocode({'address': completeCurrentAddress}, (results, status) => {
                    if (status === 'OK') {
                        this.model.currentCityLat = results[0].geometry.location.lat();
                        this.model.currentCityLng = results[0].geometry.location.lng();
                    } else {
                        alert('Geocode was not successful for the following reason: ' + status);
                    }
                });
                if (place.address_components.length > 0){
                    setTimeout(() => {
                        this.isCurrentAddressLoading = false;
                        this.fetchingCurrentAddress = true;
                        place['address_components'] = null;
                        this.panel.placeMarkerAndPanTo(completeCurrentAddress, 'map', "Current Address")
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
            var completeDeliveryAddress=""
    
            // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            if (place != null && place.address_components != null) {
                for (let i = 0; i < place.address_components.length; i++) {
                    let addressType = place.address_components[i].types[0];
                    if (this.componentForm[addressType]) {
                        let val = place.address_components[i][this.componentForm[addressType]];
                        if (addressType == 'street_number') {
                            this.model.deliveryAddreddaddressLine1 = val;
                            completeDeliveryAddress = val;
                        } else if (addressType == 'route') {
                            this.model.deliveryAddreddaddressLine2 = val;
                            completeDeliveryAddress = completeDeliveryAddress + ' ' + val;
                        } else if (addressType == 'locality') {
                            this.model.deliveryCity = val;
                            completeDeliveryAddress = completeDeliveryAddress + ' ' + val;
                        } else if (addressType == 'administrative_area_level_1') {
                            this.model.deliveryState = val;
                            completeDeliveryAddress = completeDeliveryAddress + ' ' + val;
                        } else if (addressType == 'postal_code') {
                            this.model.deliveryZip = val;
                            completeDeliveryAddress = completeDeliveryAddress + ' ' + val;
                        }
                    }
                }
                this.panel.placeMarkerAndPanTo(completeDeliveryAddress, 'map', "Delivery Address");
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
                    this.addReceiverDistanceAndDuration(this.requests);
                    if(this.requests.length > 0){
                        console.log(this.showDetails);
                        this.showDetails = true;
                    }else{
                        if (this.profile["id"] != null){
                            // this.router.navigate( ['Profile'] );
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
                    console.log(this.requests);
                    if(this.requests.length > 0){
                        this.showDetails = true;
                    }else{
                        if (this.profile["id"] != null){
                            // this.router.navigate( ['Profile'] );
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
                    if(this.data[0] === null){
                        return;
                    }
                    delete this.data[0]['status'];
                    delete this.data[0]['_id'];
                    if (this.data[0]['serviceProvider']){
                        delete this.data[0]['serviceProvider']
                    }
                    this.model = this.data[0];
                    var completeCurrentAddress = this.model.currentAddreddaddressLine1 + ' ' + this.model.currentAddreddaddressLine2 + ' ' +  this.model.currentCity + ' ' + this.model.currentState + ' ' + this.model.currentZip;
                    this.panel.placeMarkerAndPanTo(completeCurrentAddress, 'map', "Current Address");
                    var completeDeliveryAddress = this.model.deliveryAddreddaddressLine1 + ' ' + this.model.deliveryAddreddaddressLine2 + ' ' +  this.model.deliveryCity + ' ' + this.model.deliveryState + ' ' + this.model.deliveryZip;
                    this.panel.placeMarkerAndPanTo(completeDeliveryAddress, 'map', "Delivery Address");
                },
                error =>  this.errorMessage = <any>error
            );

    }
    
    getParcelPrice(){
        if (!this.model.parcelHeight || !this.model.parcelLength || !this.model.parcelWidth || !this.model.parcelWeight) { return; }
        //noinspection TypeScriptUnresolvedFunction,TypeScriptUnresolvedVariable
        this.priceCalculatorService.getParcelPrice(this.model)
          .subscribe(
            data  => {
                this.parcelRates = data;
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