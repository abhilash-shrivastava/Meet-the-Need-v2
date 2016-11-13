/**
 * Created by Abhi on 7/28/16.
 */
import {Component, Output, EventEmitter} from '@angular/core';
import {GoogleApiService} from "../services/googleAPIService.service";


@Component({
    selector: 'panel',
    styles: [`
    .hide {
      display: none;
    },
    .list-title {
    background: #0273D4;
    color: white;
    }
    `
    ],
    template: `
  <div class="card" *ngIf="title">
    <div style="background: #0273D4; color: white; padding: 20px; width: 80%;" (click)="toggle()">{{title}}  </div>
    <div  [hidden]="!opened"><ng-content></ng-content></div>
  </div>`,
    inputs: ['title'],
})
export class Panel {
    opened: Boolean = false;
    markerArray: any;
    directionsService: any;
    map: any;
    directionsDisplay: any;
    stepDisplay: any;
    geocoder: any;
    service: any;
    constructor(private googleApi:GoogleApiService){}
    toggle () {
        this.opened = !this.opened;
    }

    initMap (id: any, address1:any, address2:any){
        this.googleApi.initAutocomplete().then(() => {
            this.callMap(id, address1, address2);
        });
    }

    callMap (id: any, address1: any, address2:any){
        this.markerArray = [];

        // Instantiate a directions service.
        this.directionsService = new google.maps.DirectionsService;

        this.geocoder = new google.maps.Geocoder();

        // Create a map and center it on Manhattan.
        this.map = new google.maps.Map(document.getElementById(id), {
            zoom: 13,
            center: {lat: 40.771, lng: -73.974}
        });

        // Create a renderer for directions and bind it to the map.
        this.directionsDisplay = new google.maps.DirectionsRenderer({map: this.map});

        // Instantiate an info window to hold step text.
        this.stepDisplay = new google.maps.InfoWindow;

        // Display the route between the initial start and end selections.
        this.calculateAndDisplayRoute(
            this.directionsDisplay, this.directionsService, this.markerArray, this.stepDisplay, this.map, address1, address2);
    }

    getDistanceAndDuration(origin:any, destination: any, req:any, callback){
        this.service = new google.maps.DistanceMatrixService;
        var distanceAndDuration = {};
        this.service.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false
        }, function(response, status) {
            if (status !== 'OK') {
                alert('Error was: ' + status);
            } else {
                var results = response.rows[0].elements;
                distanceAndDuration["distance"] = results[0].distance.text;
                distanceAndDuration["duration"] = results[0].duration.text;
                //noinspection TypeScriptUnresolvedVariable
                callback(req, distanceAndDuration);
            }
        });
    }

    codeAddress(address: any) {
        var coordinates = {};
        this.geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == 'OK') {
                coordinates["lat"] = results[0].geometry.location.lat();
                coordinates["lng"] = results[0].geometry.location.lng();
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
        return coordinates;
    }



    calculateAndDisplayRoute(directionsDisplay, directionsService,
                             markerArray, stepDisplay, map, address1: any, address2: any) {
        // First, remove any existing markers from the map.
        for (var i = 0; i < markerArray.length; i++) {
            markerArray[i].setMap(null);
        }

        // Retrieve the start and end locations and create a DirectionsRequest using
        // WALKING directions.
        directionsService.route({
            origin: address1,
            destination: address2,
            travelMode: google.maps.TravelMode.DRIVING,
        }, (response, status) => {
            // Route the directions and pass the response to a function to create
            // markers for each step.
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                this.showSteps(response, markerArray, stepDisplay, map);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
  
  geocodeAddress(city) {
    this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({'address': city}, (results, status) => {
      if (status === 'OK') {
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        return {
          lat: lat,
          lng: lng
        }
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

    showSteps(directionResult, markerArray, stepDisplay, map) {
        // For each step, place a marker, and add the text to the marker's infowindow.
        // Also attach the marker to an array so we can keep track of it and remove it
        // when calculating new routes.
        var myRoute = directionResult.routes[0].legs[0];
        for (var i = 0; i < myRoute.steps.length; i++) {
            var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
            marker.setMap(map);
            marker.setPosition(myRoute.steps[i].start_location);
            this.attachInstructionText(
                stepDisplay, marker, myRoute.steps[i].instructions, map);
        }
    }

    attachInstructionText(stepDisplay, marker, text, map) {
        google.maps.event.addListener(marker, 'click', function() {
            // Open an info window when the marker is clicked on, containing the text
            // of the step.
            stepDisplay.setContent(text);
            stepDisplay.open(map, marker);
        });
    }
  
  currentAddressMarker: any;
  destinationAddressMarker : any;
  intermediateStopsMarkers = [];
  placeMarkerAndPanTo(address, id, addressType) {
    this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({'address': address}, (results, status) => {
      if (status === 'OK') {
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        let latlng = {
          lat: lat,
          lng: lng
        };
        if (!this.map){
          this.map = new google.maps.Map(document.getElementById(id), {
            zoom: 13,
            center: latlng
          });
        }
        var infowindow = new google.maps.InfoWindow({
          content: '<p style="color:black;">'+address+'</p>'
        });
        var marker = new google.maps.Marker({
          position: latlng,
          animation: google.maps.Animation.DROP,
          map: this.map
        });
        marker.addListener('click', function() {
          infowindow.open(this.map, marker);
        });
        if (addressType === "Current Address") {
          if (this.currentAddressMarker){
            this.currentAddressMarker.setMap(null);
          }
          this.currentAddressMarker = marker;
        }
        if (addressType === "Destination Address") {
          if (this.destinationAddressMarker){
            this.destinationAddressMarker.setMap(null);
          }
          this.destinationAddressMarker = marker;
          this.map.setZoom(5);
        }
        if (addressType === "Intermediate Stop"){
          this.intermediateStopsMarkers.push({address : address,
          marker: marker
          });
        }
        this.map.setCenter(latlng);
        // this.map.panTo(latlng);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
  deleteMarkerFromIntermediateStops(intermediateStop){
    for(var index in  this.intermediateStopsMarkers){
      if (this.intermediateStopsMarkers[index].address === intermediateStop.city+ ' ' + intermediateStop.state){
        this.intermediateStopsMarkers[index].marker.setMap(null);
        this.intermediateStopsMarkers.splice(parseInt(index),1);
      }
    }
  }

  cityCircle : any;
  circleNearByCities(late, lngo, radius){
    let lat : number;
    let lng : number;
    lat = late;
    lng = lngo;
    let latlng = this.map.LatLng;
    latlng = {
      lat: lat,
      lng: lng
    };
    if (this.cityCircle){
      this.cityCircle.setMap(null);
    }
    this.cityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: latlng,
      radius: radius*1609.34
    });
  }
}
