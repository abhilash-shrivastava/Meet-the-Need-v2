/**
 * Created by Abhi on 10/17/16.
 */
import {Component, Input, EventEmitter, Output} from '@angular/core'
import {RequestsService} from "../services/request.service";
import {Panel} from "../profile/panel";
import {tokenNotExpired} from "angular2-jwt/angular2-jwt";
import {GoogleApiService} from "../services/googleAPIService.service";
import {PaginationService} from "ng2-pagination/index";
import { ActivatedRoute, Router, Params } from '@angular/router';



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
    journeyDates = [];
    currentCities = [];
    destinationCities = [];
    filteredRequests= [];
    itemDescriptions = [];
    parcelStatus = [];
    journeyDateClicked = false;
    citiesClicked = false;
    currentCitiesClicked = false;
    destinationCitiesClicked = false;
    itemDescriptionClicked = false;
    statusClicked = false;
    showDetails = false;
    id: any;
    mapAddress:any;
    currentServiceAddress: any;
    currentSenderAddress:any;
    deliveryAddress:any;
    destinationAddress:any;
    status:any;
    showAllRequestClicked = false;
    card_tab=1;
  
  
    @Input('selection') selection: string;
    @Output() sidebarChange = new EventEmitter();



  openNav() {
      document.getElementById("mySidenav").style.width = "280px";
      document.getElementById("main").style.marginLeft = "280px";
  }

    closeNav() {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft= "0";
      document.body.style.backgroundColor = "white";
      this.selection='';
      this.sidebarChange.emit({
        value: this.selection
      })
    }

    constructor(private requestsService: RequestsService, private route: ActivatedRoute, private router: Router,
                private panel: Panel) {
    }

    ngOnInit(){
        this.status = null;
        this.id = null;
        this.profile = JSON.parse(localStorage.getItem('profile'));
        this.getAssignedServiceRequests(this.profile);
        this.openNav();
      console.log(this.selection);
    }
    
    updateResultsByParcelStatus(status: any){
        var temp = JSON.parse(JSON.stringify(this.filteredRequests));
        if (status.checked){
            for (var index in this.assignedServiceRequests){
                if (this.assignedServiceRequests[index].status === status.status){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.assignedServiceRequests[index]._id){
                                match = temp[i];
                            }
                        }
                        if (match){
                            match.cnt += 1;
                            for (var j in this.filteredRequests){
                                if (match.req._id === this.filteredRequests[j].req._id){
                                    this.filteredRequests.splice(parseInt(j), 1);
                                }
                            }
                            this.filteredRequests.push(match);
                        }else {
                            this.filteredRequests.push({'req' :this.assignedServiceRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.assignedServiceRequests[index], 'cnt' : 1});
                    }
                }
            }
        }else {
            for (var index in temp){
                if (temp[index].req.status === status.status){
                    if (temp[index].cnt > 1){
                        var match1;
                        for (var i in this.filteredRequests){
                            if (temp[index].req._id === this.filteredRequests[i].req._id){
                                match1 = temp[index];
                            }
                        }
                        if (match1){
                            match1.cnt -= 1;
                            for (var j in this.filteredRequests){
                                if (match1.req._id === this.filteredRequests[j].req._id){
                                    this.filteredRequests.splice(parseInt(j), 1);
                                }
                            }
                            this.filteredRequests.push(match1);
                        }
                    }else {
                        for (var i in this.filteredRequests){
                            if (temp[index].req._id === this.filteredRequests[i].req._id){
                                this.filteredRequests.splice(parseInt(i), 1);
                            }
                        }
                    }
                }
            }
        }
    }

    updateResultsByItemDescription(description: any){
        var temp = JSON.parse(JSON.stringify(this.filteredRequests));
        if (description.checked){
            for (var index in this.assignedServiceRequests){
                if (this.assignedServiceRequests[index].parcelDisclosure === description.parcelDisclosure){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.assignedServiceRequests[index]._id){
                                match = temp[i];
                            }
                        }
                        if (match){
                            match.cnt += 1;
                            for (var j in this.filteredRequests){
                                if (match.req._id === this.filteredRequests[j].req._id){
                                    this.filteredRequests.splice(parseInt(j), 1);
                                }
                            }
                            this.filteredRequests.push(match);
                        }else {
                            this.filteredRequests.push({'req' :this.assignedServiceRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.assignedServiceRequests[index], 'cnt' : 1});
                    }
                }
            }
        }else {
            for (var index in temp){
                if (temp[index].req.parcelDisclosure === description.parcelDisclosure){
                    if (temp[index].cnt > 1){
                        var match1;
                        for (var i in this.filteredRequests){
                            if (temp[index].req._id === this.filteredRequests[i].req._id){
                                match1 = temp[index];
                            }
                        }
                        if (match1){
                            match1.cnt -= 1;
                            for (var j in this.filteredRequests){
                                if (match1.req._id === this.filteredRequests[j].req._id){
                                    this.filteredRequests.splice(parseInt(j), 1);
                                }
                            }
                            this.filteredRequests.push(match1);
                        }
                    }else {
                        for (var i in this.filteredRequests){
                            if (temp[index].req._id === this.filteredRequests[i].req._id){
                                this.filteredRequests.splice(parseInt(i), 1);
                            }
                        }
                    }
                }
            }
        }
    }
    
    updateResultsByDestinationCities(city: any){
        var temp = JSON.parse(JSON.stringify(this.filteredRequests));
        if (city.checked){
            for (var index in this.assignedServiceRequests){
                if (this.assignedServiceRequests[index].serviceProvider.destinationCity === city.destinationCity){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.assignedServiceRequests[index]._id){
                                match = temp[i];
                            }
                        }
                        if (match){
                            match.cnt += 1;
                            for (var j in this.filteredRequests){
                                if (match.req._id === this.filteredRequests[j].req._id){
                                    this.filteredRequests.splice(parseInt(j), 1);
                                }
                            }
                            this.filteredRequests.push(match);
                        }else {
                            this.filteredRequests.push({'req' :this.assignedServiceRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.assignedServiceRequests[index], 'cnt' : 1});
                    }
                }
            }
        }else {
            for (var index in temp){
                if (temp[index].req.serviceProvider.destinationCity === city.destinationCity){
                    if (temp[index].cnt > 1){
                        var match1;
                        for (var i in this.filteredRequests){
                            if (temp[index].req._id === this.filteredRequests[i].req._id){
                                match1 = temp[index];
                            }
                        }
                        if (match1){
                            match1.cnt -= 1;
                            for (var j in this.filteredRequests){
                                if (match1.req._id === this.filteredRequests[j].req._id){
                                    this.filteredRequests.splice(parseInt(j), 1);
                                }
                            }
                            this.filteredRequests.push(match1);
                        }
                    }else {
                        for (var i in this.filteredRequests){
                            if (temp[index].req._id === this.filteredRequests[i].req._id){
                                this.filteredRequests.splice(parseInt(i), 1);
                            }
                        }
                    }
                }
            }
        }
    }
  
  updateResultsByCurrentCities(city: any){
  
    var temp = JSON.parse(JSON.stringify(this.filteredRequests));
    if (city.checked){
      for (var index in this.assignedServiceRequests){
        if (this.assignedServiceRequests[index].serviceProvider.currentCity === city.currentCity){
          if (temp.length >0){
            var match;
            for (var i in temp){
              if (temp[i].req._id === this.assignedServiceRequests[index]._id){
                match = temp[i];
              }
            }
            if (match){
              match.cnt += 1;
              for (var j in this.filteredRequests){
                if (match.req._id === this.filteredRequests[j].req._id){
                  this.filteredRequests.splice(parseInt(j), 1);
                }
              }
              this.filteredRequests.push(match);
            }else {
              this.filteredRequests.push({'req' :this.assignedServiceRequests[index], 'cnt' : 1});
            }
          }else {
            this.filteredRequests.push({'req' :this.assignedServiceRequests[index], 'cnt' : 1});
          }
        }
      }
    }else {
      for (var index in temp){
        if (temp[index].req.serviceProvider.currentCity === city.currentCity){
          if (temp[index].cnt > 1){
            var match1;
            for (var i in this.filteredRequests){
              if (temp[index].req._id === this.filteredRequests[i].req._id){
                match1 = temp[index];
              }
            }
            if (match1){
              match1.cnt -= 1;
              for (var j in this.filteredRequests){
                if (match1.req._id === this.filteredRequests[j].req._id){
                  this.filteredRequests.splice(parseInt(j), 1);
                }
              }
              this.filteredRequests.push(match1);
            }
          }else {
            for (var i in this.filteredRequests){
              if (temp[index].req._id === this.filteredRequests[i].req._id){
                this.filteredRequests.splice(parseInt(i), 1);
              }
            }
          }
        }
      }
    }
  }
  
  updateResultsByDate(date: any){
  
    var temp = JSON.parse(JSON.stringify(this.filteredRequests));
    if (date.checked){
      for (var index in this.assignedServiceRequests){
        if (this.assignedServiceRequests[index].serviceProvider.journeyDate === date.journeyDate){
          if (temp.length >0){
            var match;
            for (var i in temp){
              if (temp[i].req._id === this.assignedServiceRequests[index]._id){
                match = temp[i];
              }
            }
            if (match){
              match.cnt += 1;
              for (var j in this.filteredRequests){
                if (match.req._id === this.filteredRequests[j].req._id){
                  this.filteredRequests.splice(parseInt(j), 1);
                }
              }
              this.filteredRequests.push(match);
            }else {
              this.filteredRequests.push({'req' :this.assignedServiceRequests[index], 'cnt' : 1});
            }
          }else {
            this.filteredRequests.push({'req' :this.assignedServiceRequests[index], 'cnt' : 1});
          }
        }
      }
    }else {
      for (var index in temp){
        if (temp[index].req.serviceProvider.journeyDate === date.journeyDate){
          if (temp[index].cnt > 1){
            var match1;
            for (var i in this.filteredRequests){
              if (temp[index].req._id === this.filteredRequests[i].req._id){
                match1 = temp[index];
              }
            }
            if (match1){
              match1.cnt -= 1;
              for (var j in this.filteredRequests){
                if (match1.req._id === this.filteredRequests[j].req._id){
                  this.filteredRequests.splice(parseInt(j), 1);
                }
              }
              this.filteredRequests.push(match1);
            }
          }else {
            for (var i in this.filteredRequests){
              if (temp[index].req._id === this.filteredRequests[i].req._id){
                this.filteredRequests.splice(parseInt(i), 1);
              }
            }
          }
        }
      }
    }
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
                        this.getJourneyDate();
                        this.getCurrentCities();
                        this.getDestinationCities();
                        this.getItemDescriptions();
                        this.getParcelStatus();
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
    toggleCities(){
        this.citiesClicked = !this.citiesClicked;
    }
    toggleCurrentCities(){
        this.currentCitiesClicked = !this.currentCitiesClicked;
    }
    
    toggleDestinationCities(){
        this.destinationCitiesClicked = !this.destinationCitiesClicked;
    }
    
    toggleItemDescription(){
        this.itemDescriptionClicked = !this.itemDescriptionClicked;
    }

    toggleStatus(){
        this.statusClicked = !this.statusClicked;
    }
    
    toggleFiltersClicked(){
        this.router.navigate([''], { relativeTo: this.route });
        this.filtersClicked = !this.filtersClicked;
    }
    toggleActionClicked(){
        this.actionClicked = !this.actionClicked;
    }

    toggleFilter(){
        this.showAllRequestClicked =true;
        this.requestsClicked = !this.requestsClicked;
    }

    getJourneyDate(){
      var temp = [];
      for(var index in this.assignedServiceRequests){
        if (temp.indexOf(this.assignedServiceRequests[index].serviceProvider.journeyDate) <0){
          temp.push(this.assignedServiceRequests[index].serviceProvider.journeyDate);
        }  
      }
      for (var index in temp){
        var i = temp.indexOf(temp[index]);
        if (i > -1) {
          this.journeyDates.push({'journeyDate':temp[index]});
        }
      }
    }
  
    getCurrentCities(){
      var temp = [];
      for(var index in this.assignedServiceRequests){
        if (temp.indexOf(this.assignedServiceRequests[index].serviceProvider.currentCity) <0){
          temp.push(this.assignedServiceRequests[index].serviceProvider.currentCity);
        }
      }
      for (var index in temp){
        var i = temp.indexOf(temp[index]);
        if (i > -1) {
          this.currentCities.push({'currentCity':temp[index]});
        }
      }
    }
    
    getDestinationCities(){
        var temp = [];
        for(var index in this.assignedServiceRequests){
            if (temp.indexOf(this.assignedServiceRequests[index].serviceProvider.destinationCity) <0){
                temp.push(this.assignedServiceRequests[index].serviceProvider.destinationCity);
            }
        }
        for (var index in temp){
            var i = temp.indexOf(temp[index]);
            if (i > -1) {
                this.destinationCities.push({'destinationCity':temp[index]});
            }
        }
    }
    
    getItemDescriptions(){
        var temp = [];
        for(var index in this.assignedServiceRequests){
            if (temp.indexOf(this.assignedServiceRequests[index].parcelDisclosure) <0){
                temp.push(this.assignedServiceRequests[index].parcelDisclosure);
            }
        }
        for (var index in temp){
            var i = temp.indexOf(temp[index]);
            if (i > -1) {
                this.itemDescriptions.push({'parcelDisclosure':temp[index]});
            }
        }
    }

    getParcelStatus(){
        var temp = [];
        for(var index in this.assignedServiceRequests){
            if (temp.indexOf(this.assignedServiceRequests[index].status) <0){
                temp.push(this.assignedServiceRequests[index].status);
            }
        }
        for (var index in temp){
            var i = temp.indexOf(temp[index]);
            if (i > -1) {
                this.parcelStatus.push({'status':temp[index]});
            }
        }
    }
  
    loggedIn() {
        return tokenNotExpired();
    }
}