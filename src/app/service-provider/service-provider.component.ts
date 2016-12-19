/**
 * Created by Abhi on 6/11/16.
 */

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ServiceProviderDetails }        from './../services/service-provider-details';
import { ServiceProviderCRUDService } from './../services/service-provider-crud.service';
import {tokenNotExpired} from 'angular2-jwt';
import {GoogleApiService} from "../services/googleAPIService.service";
import {Panel} from "../profile/panel";
import {GeoByteService} from "../services/geobyte.service";
import {PaginationService} from "ng2-pagination";
import {PriceCalculatorService} from "../services/priceCalculator.service";


@Component({
    selector: 'service-provider',
    templateUrl: './service-provider.component.html',
    styleUrls: ['./service-provider.component.css'],
    providers: [ ServiceProviderCRUDService, Panel, GoogleApiService, GeoByteService, PaginationService, PriceCalculatorService ],
})

export class ServiceProviderComponent {
    profile: any;
    errorMessage: string;
    requests: any;
    mode = 'Observable';
    model = new ServiceProviderDetails();
    data: any;
    showDetails = false;
    currentCityName: string[];
    destinationCityName: string[];
    isLoading = false;
    submitted = false;
    fetchingCurrentAddress = false;
    isCurrentAddressLoading = false;
    fetchingDestinationAddress = false;
    isDestinationAddressLoading = false;
    parcelOrderSelected = false;
    currentAddressAutocomplete: any;
    destinationAddressAutocomplete: any;
    itineraryCityToDestinationAutocomplete: any;
    itineraryCityToCurrentAutocomplete: any;
    itineraryCityToDestinationArray = [];
    itineraryCityToCurrentArray = [];
    itineraryToDestination ={};
    itineraryToCurrent ={};
    searchAddress : any;
    nearByCities: any;
    radius: number;
    segment = 1;
    id: any;
    mapAddress:any;
    currentServiceAddress: any;
    currentSenderAddress:any;
    deliveryAddress:any;
    destinationAddress:any;
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
    componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
    };
    
    onSubmit() {
        var intermediateStops = [];
        var orderListElements = document.getElementsByTagName('OL')[0];
        if (orderListElements){
            var listElements = orderListElements.getElementsByTagName("LI");
            for (var index=0; index < listElements.length; index++){
                var citydetails = listElements[index].innerHTML.split(', ', 2);
                var cityObject ={};
                cityObject['index'] = index;
                cityObject['city'] = citydetails[0];
                citydetails = citydetails[1].split(' ');
                cityObject['state'] = citydetails[0];
                cityObject['pickUpDate'] = citydetails[2];
                intermediateStops.push(cityObject);
            }
        }
        this.model['itineraryCitiesToDestination'] = intermediateStops;
        this.isLoading = true;
        this.submitted = true;
        if (this.profile["id"] != null){
            this.model["_id"] = this.profile.id;
        }
        this.model['email'] = this.profile.email;
        this.currentCityName = this.model['currentCity'].split(" ");
        this.model['currentCity'] = "";
        for (var i= 0 ; i < this.currentCityName.length; i++ ){
            this.currentCityName[i] = this.currentCityName[i].charAt(0).toUpperCase() + this.currentCityName[i].slice(1).toLowerCase();
            this.model['currentCity'] =  this.model['currentCity'] + this.currentCityName[i]
            if (i + 1 < this.currentCityName.length ){
                this.model['currentCity'] =  this.model['currentCity'] + " ";
            }
        }
        this.destinationCityName = this.model['destinationCity'].split(" ");
        this.model['destinationCity'] = "";
        for (var i= 0 ; i < this.destinationCityName.length; i++ ){
            this.destinationCityName[i] = this.destinationCityName[i].charAt(0).toUpperCase() + this.destinationCityName[i].slice(1).toLowerCase();
            this.model['destinationCity'] =  this.model['destinationCity'] + this.destinationCityName[i];
            if (i + 1 < this.destinationCityName.length ){
                this.model['destinationCity'] =  this.model['destinationCity'] + " ";
            }
        }
      if (this.nearByCities){
        this.getNearByCities(this.model.currentCityLat, this.model.currentCityLng, this.radius*1.6);
      }else {
        if (this.model !== null){
          this.model.nearByCitiesArray = [];
          this.saveServiceProviderDetails(this.model);
        }
      }
    }
    error: any;
    status: string;
    constructor(private panel: Panel, private geoByteService: GeoByteService,
                private googleApi:GoogleApiService,
                private serviceProviderCRUDService: ServiceProviderCRUDService,
                private priceCalculatorService: PriceCalculatorService) {
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
  
  
  selectParcel(parcel){
        parcel['serviceProvider'] = this.model;
        this.parcelOrderSelected = true;
        this.card_tab=1;
        this.mapLoadAssignedService(parcel._id + 'selected-parcel', parcel.currentAddreddaddressLine1 + ' ' + parcel.currentAddreddaddressLine2 + ' ' + parcel.currentCity
      + ' ' + parcel.currentState + ' ' + parcel.currentZip, this.model.currentAddreddaddressLine1 + ' ' + this.model.currentAddreddaddressLine2 + ' ' + this.model.currentCity
      + ' ' + this.model.currentState + ' ' + this.model.currentZip, parcel.deliveryAddreddaddressLine1 + ' ' + parcel.deliveryAddreddaddressLine2 + ' ' + parcel.deliveryCity
      + ' ' + parcel.deliveryState + ' ' + parcel.deliveryZip, this.model.destinationAddreddaddressLine1 + ' ' + this.model.destinationAddreddaddressLine2 + ' ' + this.model.destinationCity
      + ' ' + this.model.destinationState + ' ' + this.model.destinationZip, 'Sender');
        this.selectParcelOrder(parcel)
    }

    initializeFlag(){
        this.submitted = false;
        this.parcelOrderSelected= false;
        this.isLoading =false;
        this.model.itineraryCitiesToDestination = [];
        this.requests = [];
    }

    ngOnInit(): void {

        this.googleApi.initAutocomplete().then(() => {
            // Create the autocomplete object, restricting the search to geographical
            // location types.
            this.currentAddressAutocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(<HTMLInputElement>document.getElementById('currentaddressautocomplete')),
                {types: ['geocode']})
            this.destinationAddressAutocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(<HTMLInputElement>document.getElementById('destinationaddressautocomplete')),
                {types: ['geocode']});
            this.itineraryCityToDestinationAutocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(<HTMLInputElement>document.getElementById('itinerarycitytodestinationautocomplete')),
                {types: ['geocode']});
            this.itineraryCityToCurrentAutocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(<HTMLInputElement>document.getElementById('itinerarycitytocurrentautocomplete')),
                {types: ['geocode']});
          this.profile = JSON.parse(localStorage.getItem('profile'));
          // let id = this.routeParams.get('id');
          // if (id != null){
          //     this.profile["id"] = id;
          //     this.model["_id"] = id;
          // }
          this.getServiceProviderDetails(this.profile);
        });
        console.log(this.model);
    }
  
    onRadiusChange(radius){
      this.panel.circleNearByCities(this.model.currentCityLat, this.model.currentCityLng,radius);
    }

    deleteCity(i:any){
      this.panel.deleteMarkerFromIntermediateStops(this.model.itineraryCitiesToDestination[i]);
      this.model.itineraryCitiesToDestination.splice(i,1);
    }

    addSenderDistanceAndDuration(requests: any){
        for (var request in requests){
            var req = request
            //noinspection TypeScriptUnresolvedVariable
            this.panel.getDistanceAndDuration(requests[request].currentAddreddaddressLine1 + ' ' + requests[request].currentAddreddaddressLine2 + ' ' + requests[request].currentCity
                + ' ' + requests[request].currentState + ' ' + requests[request].currentZip, this.model.currentAddreddaddressLine1 + ' ' + this.model.currentAddreddaddressLine2 + ' ' + this.model.currentCity
                + ' ' + this.model.currentState + ' ' + this.model.currentZip, req, function (req: any, distanceAndDurationToSender: any) {
                requests[req]["SenderDistanceAndDuration"] = distanceAndDurationToSender;
                return distanceAndDurationToSender;
            });
        }
    }

    addReceiverDistanceAndDuration(requests: any){
        for (var request in requests){
            var req = request
            //noinspection TypeScriptUnresolvedVariable
            this.panel.getDistanceAndDuration(requests[request].deliveryAddreddaddressLine1 + ' ' + requests[request].deliveryAddreddaddressLine2 + ' ' + requests[request].deliveryCity
                + ' ' + requests[request].deliveryState + ' ' + requests[request].deliveryZip, this.model.destinationAddreddaddressLine1 + ' ' + this.model.destinationAddreddaddressLine2 + ' ' + this.model.destinationCity
                + ' ' + this.model.destinationState + ' ' + this.model.destinationZip, req, function (req: any, distanceAndDurationToSender: any) {
                requests[req]["ReceiverDistanceAndDuration"] = distanceAndDurationToSender;
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


        if (addressType == "Destination Address"){
            let place = this.destinationAddressAutocomplete.getPlace();
            this.model['destinationAddreddaddressLine1'] = "";
            this.model['destinationAddreddaddressLine2'] = "";
            this.model['destinationCity'] = "";
            this.model['destinationState'] ="";
            this.model['destinationZip'] = "";
            var completeDestinationAddress=""
  
  
          // Get each component of the address from the place details
            // and fill the corresponding field on the form.
            if (place != null && place.address_components != null) {
                for (let i = 0; i < place.address_components.length; i++) {
                    let addressType = place.address_components[i].types[0];
                    if (this.componentForm[addressType]) {
                        let val = place.address_components[i][this.componentForm[addressType]];
                        if (addressType == 'street_number') {
                            this.model['destinationAddreddaddressLine1'] = val;
                          completeDestinationAddress = val;
                        } else if (addressType == 'route') {
                            this.model['destinationAddreddaddressLine2'] = val;
                          completeDestinationAddress = completeDestinationAddress + ' ' + val;
                        } else if (addressType == 'locality') {
                            this.model['destinationCity'] = val;
                            completeDestinationAddress = completeDestinationAddress + ' ' + val;
                        } else if (addressType == 'administrative_area_level_1') {
                            this.model['destinationState'] = val;
                            completeDestinationAddress = completeDestinationAddress + ' ' + val;
                        } else if (addressType == 'postal_code') {
                            this.model['destinationZip'] = val;
                            completeDestinationAddress = completeDestinationAddress + ' ' + val;
                        }
                    }
                }
              this.panel.placeMarkerAndPanTo(completeDestinationAddress, 'map', "Destination Address");
              if (place.address_components.length > 0){
                    setTimeout(() => {
                        this.isDestinationAddressLoading = false;
                        this.fetchingDestinationAddress = true;
                        place['address_components'] = null;
                    }, 1);
                }
            }
        }

    }
    circle: any;
    geolocation: any;
    geolocate(addressType : string) {
        if (addressType == "Current Address"){
            this.isCurrentAddressLoading = true;
            this.fetchingCurrentAddress = false;
        }
        if (addressType == "Destination Address"){
            this.isDestinationAddressLoading = true;
            this.fetchingDestinationAddress = false;
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
                if (addressType == "Destination Address"){
                    this.destinationAddressAutocomplete.setBounds(this.circle.getBounds());
                    this.fillInAddress(addressType);
                }

            });
        }
      // console.log(this.panel.geocodeAddress(this.model.currentCity));
    }

    itineraryCity() {
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
                    this.itineraryCityToDestinationAutocomplete.setBounds(this.circle.getBounds());
            });
        }
    }
    
    addItineraryToDestination(){
        // this.itineraryToDestination = {};
      var intermediateStop=""
      let place = this.itineraryCityToDestinationAutocomplete.getPlace();
        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        if (place != null && place.address_components != null) {
            for (let i = 0; i < place.address_components.length; i++) {
                let addressType = place.address_components[i].types[0];
                if (this.componentForm[addressType]) {
                    let val = place.address_components[i][this.componentForm[addressType]];
                    if (addressType == 'locality') {
                        this.itineraryToDestination['city'] = val;
                        intermediateStop = val;
                    } else if (addressType == 'administrative_area_level_1') {
                        this.itineraryToDestination['state'] = val;
                        intermediateStop = intermediateStop + ' ' +val;
                    } else if (addressType == 'postal_code') {
                        this.itineraryToDestination['zip'] = val;
                      intermediateStop = intermediateStop + ' ' +val;
                    }
                }
            }
            this.itineraryCityToDestinationArray.push(this.itineraryToDestination);
            this.model.itineraryCitiesToDestination = this.itineraryCityToDestinationArray;
            this.panel.placeMarkerAndPanTo(intermediateStop, 'map', "Intermediate Stop")
            if (place.address_components.length > 0){
                setTimeout(() => {
                    place['address_components'] = null;
                    this.itineraryToDestination = {};
                    this.searchAddress = "";
                }, 1);
            }
        }
    }

    addItineraryToCurrent(){
        this.itineraryToCurrent = {};
        let place = this.itineraryCityToCurrentAutocomplete.getPlace();
        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        if (place != null && place.address_components != null) {
            for (let i = 0; i < place.address_components.length; i++) {
                let addressType = place.address_components[i].types[0];
                if (this.componentForm[addressType]) {
                    let val = place.address_components[i][this.componentForm[addressType]];
                    if (addressType == 'locality') {
                        this.itineraryToCurrent['city'] = val;
                    } else if (addressType == 'administrative_area_level_1') {
                        this.itineraryToCurrent['state'] = val;
                    } else if (addressType == 'postal_code') {
                        this.itineraryToCurrent['zip'] = val;
                    }
                }
            }
            this.itineraryCityToCurrentArray.push(this.itineraryToCurrent);
            this.model.itineraryCitiesToCurrent = this.itineraryCityToCurrentArray;
            console.log(this.model.itineraryCitiesToCurrent);
            if (place.address_components.length > 0){
                setTimeout(() => {
                    place['address_components'] = null;
                    this.itineraryToCurrent = {};
                    this.searchAddress = "";
                }, 1);
            }
        }
    }
    
    saveServiceProviderDetails(serviceProviderDetails: ServiceProviderDetails){
        if (!serviceProviderDetails) { return; }
        //noinspection TypeScriptUnresolvedFunction,TypeScriptUnresolvedVariable
        this.serviceProviderCRUDService.save(serviceProviderDetails)
            .subscribe(
                data  => {
                    this.requests = data;
                    this.addSenderDistanceAndDuration(this.requests);
                    this.addReceiverDistanceAndDuration(this.requests);
                    setTimeout(() => {
                        this.isLoading = false;
                    }, 3000);
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
  
  getParcelPrice(){
    if (!this.model.maxParcelHeight && !this.model.maxParcelLength && !this.model.maxParcelWidth && !this.model.maxParcelWeigth) { return; }
    //noinspection TypeScriptUnresolvedFunction,TypeScriptUnresolvedVariable
    this.priceCalculatorService.getParcelPrice(this.model)
      .subscribe(
        data  => {
          this.parcelRates = data;
        },
        error =>  this.errorMessage = <any>error
      );
    
  }
  
  getNearByCities(lat:any, lng:any, radius:any){
    if (!lat || !lng || !radius) { return; }
    this.geoByteService.getNearByCities(lat, lng, radius)
      .subscribe(
        data  => {
          this.getCities(data);
          if (this.model !== null){
            this.saveServiceProviderDetails(this.model);
          }
        },
        error =>  this.errorMessage = <any>error
      );
    
  }
  
  getCities(data: any){
    this.model.nearByCitiesArray = [];
    for (var index in data){
      this.model.nearByCitiesArray.push(data[index][1]);
    }
  }
  
    selectParcelOrder(senderData){
        if (!senderData) { return; }
        //noinspection TypeScriptUnresolvedFunction,TypeScriptUnresolvedVariable
        this.serviceProviderCRUDService.selectParcelOrder(senderData)
            .subscribe(
                data  => {
                    this.requests = [];
                    this.requests = data;
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

    getServiceProviderDetails(data){
        if (!this.profile.email) { return; }
        //noinspection TypeScriptUnresolvedFunction
        this.serviceProviderCRUDService.getServiceProviderDetails(data)
            .subscribe(
                data  => {
                    this.data = data;
                    if(this.data[0] === null){
                        return;
                    }
                    if (this.data[0].serviceProvider){
                        delete this.data[0].serviceProvider['_id']
                        this.model = this.data[0].serviceProvider;
                    }else {
                        delete this.data[0]['_id']
                        this.model = this.data[0];
                    }
                  var completeCurrentAddress = this.model.currentAddreddaddressLine1 + ' ' + this.model.currentAddreddaddressLine2 + ' ' +  this.model.currentCity + ' ' + this.model.currentState + ' ' + this.model.currentZip;
                  this.panel.placeMarkerAndPanTo(completeCurrentAddress, 'map', "Current Address");
                  var completeDestinationAddress = this.model.destinationAddreddaddressLine1 + ' ' + this.model.destinationAddreddaddressLine2 + ' ' +  this.model.destinationCity + ' ' + this.model.destinationState + ' ' + this.model.destinationZip;
                  this.panel.placeMarkerAndPanTo(completeDestinationAddress, 'map', "Destination Address");
                  for (var index in this.model.itineraryCitiesToDestination){
                    var intermediateStop = this.model.itineraryCitiesToDestination[index].city + ' ' + this.model.itineraryCitiesToDestination[index].state;
                    this.panel.placeMarkerAndPanTo(intermediateStop, 'map', "Intermediate Stop")
                  }
                },
                error =>  this.errorMessage = <any>error
            );

    }

    loggedIn() {
        return tokenNotExpired();
    }

    onChange(selectedState) {
        // this.SwitchFuction(selectedState);
    }

    states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
    cities = [];

    SwitchFuction = function (state) {
        switch (state) {
            case 'Alabama':
                this.cities = ["Alabama cities"];
                break;
            case 'Alaska':
                this.cities = ["Alaska cities"];
                break;
            default: this.cities = [];

        }
    };
}