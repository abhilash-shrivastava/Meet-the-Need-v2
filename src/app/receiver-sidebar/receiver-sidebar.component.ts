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
    selector: 'receiver-sidebar',
    templateUrl: './receiver-sidebar.component.html',
    styleUrls: ['./receiver-sidebar.component.css'],
    providers: [PaginationService, RequestsService, Panel, GoogleApiService],
    
})

export class ReceiverSidebarComponent {

    actionClicked = false;
    profile: any;
    requestsClicked = false;
    filtersClicked = false;
    parcelReceivingRequests:any;
    errorMessage: string;
    dispatchDates = [];
    currentCities = [];
    deliveryCities = [];
    filteredRequests= [];
    itemDescriptions = [];
    parcelStatus = [];
    dispatchDateClicked = false;
    citiesClicked = false;
    currentCitiesClicked = false;
    deliveryCitiesClicked = false;
    itemDescriptionClicked = false;
    statusClicked = false;
    showAllRequestClicked = false;
    showDetails = false;
    id: any;
    mapAddress:any;
    currentServiceAddress: any;
    currentSenderAddress:any;
    deliveryAddress:any;
    destinationAddress:any;
    status:any;
    card_tab = 1;
    
    @Input('selection') selection: string;
    @Output() sidebarChange = new EventEmitter();
    
    constructor(private requestsService: RequestsService, private route: ActivatedRoute, private router: Router,
                private panel: Panel) {
    }
    
    ngOnInit(){
        this.status = null;
        this.id = null;
        this.profile = JSON.parse(localStorage.getItem('profile'));
        this.getParcelReceivingRequests(this.profile);
        this.openNav();
    }
    
    mapLoadAssignedReceiver(id:any, currentSenderAddress: any, currentServiceAddress:any, deliveryAddress:any, destinationAddress:any, type:any){
        
        this.currentServiceAddress = currentServiceAddress;
        this.currentSenderAddress = currentSenderAddress;
        this.deliveryAddress = deliveryAddress;
        this.destinationAddress = destinationAddress;
        
        if (this.id !== id && type === 'Title'){
            this.id = id;
            this.panel.initMap(this.id, this.deliveryAddress, this.destinationAddress);
            this.mapAddress = "Map Direction To Service Provider";
        }
        if (type === 'Provider'){
            this.id = id;
            this.panel.initMap(this.id, this.deliveryAddress, this.destinationAddress);
            this.mapAddress = "Map Direction To Service Provider";
        }
        if (type === 'Sender'){
            this.id = id;
            this.panel.initMap(this.id, this.currentSenderAddress, this.currentServiceAddress);
            this.mapAddress = "Map Direction from Provider to Sender";
        }
    }
    
    updateResultsByParcelStatus(status: any){
        var temp = JSON.parse(JSON.stringify(this.filteredRequests));
        if (status.checked){
            for (var index in this.parcelReceivingRequests){
                if (this.parcelReceivingRequests[index].status === status.status){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.parcelReceivingRequests[index]._id){
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
                            this.filteredRequests.push({'req' :this.parcelReceivingRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.parcelReceivingRequests[index], 'cnt' : 1});
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
            for (var index in this.parcelReceivingRequests){
                if (this.parcelReceivingRequests[index].parcelDisclosure === description.parcelDisclosure){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.parcelReceivingRequests[index]._id){
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
                            this.filteredRequests.push({'req' :this.parcelReceivingRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.parcelReceivingRequests[index], 'cnt' : 1});
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
    
    updateResultsByDeliveryCities(city: any){
        var temp = JSON.parse(JSON.stringify(this.filteredRequests));
        if (city.checked){
            for (var index in this.parcelReceivingRequests){
                if (this.parcelReceivingRequests[index].deliveryCity === city.deliveryCity){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.parcelReceivingRequests[index]._id){
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
                            this.filteredRequests.push({'req' :this.parcelReceivingRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.parcelReceivingRequests[index], 'cnt' : 1});
                    }
                }
            }
        }else {
            for (var index in temp){
                if (temp[index].req.deliveryCity === city.deliveryCity){
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
            for (var index in this.parcelReceivingRequests){
                if (this.parcelReceivingRequests[index].currentCity === city.currentCity){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.parcelReceivingRequests[index]._id){
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
                            this.filteredRequests.push({'req' :this.parcelReceivingRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.parcelReceivingRequests[index], 'cnt' : 1});
                    }
                }
            }
        }else {
            for (var index in temp){
                if (temp[index].req.currentCity === city.currentCity){
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
            for (var index in this.parcelReceivingRequests){
                if (this.parcelReceivingRequests[index].serviceProvider.journeyDate === date.dispatchDate){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.parcelReceivingRequests[index]._id){
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
                            this.filteredRequests.push({'req' :this.parcelReceivingRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.parcelReceivingRequests[index], 'cnt' : 1});
                    }
                }
            }
        }else {
            for (var index in temp){
                if (temp[index].req.serviceProvider.journeyDate === date.dispatchDate){
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
    
    openNav() {
        document.getElementById("mySidenav").style.width = "280px";
        document.getElementById("main").style.marginLeft = "280px";
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
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
    
    onStatusChangeClick(parcelId){
        this.changeParcelStatus({email: this.profile.email, parcelId: parcelId});
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
    
    getParcelReceivingRequests(data){
        if (!this.profile.email) { return; }
        //noinspection TypeScriptUnresolvedFunction
        this.requestsService.getParcelReceivingRequests(data)
          .subscribe(
            data  => {
                this.parcelReceivingRequests = data;
                if(this.parcelReceivingRequests.length > 0){
                    this.showDetails = true;
                    this.getDispatchDates();
                    this.getCurrentCities();
                    this.getDeliveryCities();
                    this.getItemDescriptions();
                    this.getParcelStatus();
                }else{
                    this.showDetails = false;
                }
                this.id = null;
                this.mapLoadAssignedReceiver(this.id, this.currentServiceAddress, this.currentSenderAddress, this.deliveryAddress, this.destinationAddress, this.status);
                
            },
            error =>  this.errorMessage = <any>error
          );
        
    }
    
    toggleDispatchDate(){
        this.dispatchDateClicked = !this.dispatchDateClicked;
    }
    toggleCities(){
        this.citiesClicked = !this.citiesClicked;
    }
    toggleCurrentCities(){
        this.currentCitiesClicked = !this.currentCitiesClicked;
    }
    
    toggleDeliveryCities(){
        this.deliveryCitiesClicked = !this.deliveryCitiesClicked;
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
    
    getDispatchDates(){
        var temp = [];
        for(var index in this.parcelReceivingRequests){
            if (temp.indexOf(this.parcelReceivingRequests[index].serviceProvider.journeyDate) <0){
                temp.push(this.parcelReceivingRequests[index].serviceProvider.journeyDate);
            }
        }
        for (var index in temp){
            var i = temp.indexOf(temp[index]);
            if (i > -1) {
                this.dispatchDates.push({'dispatchDate':temp[index]});
            }
        }
    }
    
    getCurrentCities(){
        var temp = [];
        for(var index in this.parcelReceivingRequests){
            if (temp.indexOf(this.parcelReceivingRequests[index].serviceProvider.currentCity) <0){
                temp.push(this.parcelReceivingRequests[index].serviceProvider.currentCity);
            }
        }
        for (var index in temp){
            var i = temp.indexOf(temp[index]);
            if (i > -1) {
                this.currentCities.push({'currentCity':temp[index]});
            }
        }
    }
    
    getDeliveryCities(){
        var temp = [];
        for(var index in this.parcelReceivingRequests){
            if (temp.indexOf(this.parcelReceivingRequests[index].serviceProvider.destinationCity) <0){
                temp.push(this.parcelReceivingRequests[index].serviceProvider.destinationCity);
            }
        }
        for (var index in temp){
            var i = temp.indexOf(temp[index]);
            if (i > -1) {
                this.deliveryCities.push({'deliveryCity':temp[index]});
            }
        }
    }
    
    getItemDescriptions(){
        var temp = [];
        for(var index in this.parcelReceivingRequests){
            if (temp.indexOf(this.parcelReceivingRequests[index].parcelDisclosure) <0){
                temp.push(this.parcelReceivingRequests[index].parcelDisclosure);
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
        for(var index in this.parcelReceivingRequests){
            if (temp.indexOf(this.parcelReceivingRequests[index].status) <0){
                temp.push(this.parcelReceivingRequests[index].status);
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