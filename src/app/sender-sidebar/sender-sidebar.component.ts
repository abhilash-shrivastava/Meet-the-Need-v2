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
    selector: 'sender-sidebar',
    templateUrl: './sender-sidebar.component.html',
    styleUrls: ['./sender-sidebar.component.css'],
    providers: [PaginationService, RequestsService, Panel, GoogleApiService],
    
})

export class SenderSidebarComponent {

    actionClicked = false;
    requestsClicked = false;
    filtersClicked = false;
    profile: any;
    parcelRequests: any;
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
    
    @Input('selection') selection: string;
    @Output() sidebarChange = new EventEmitter();
    
    constructor(private requestsService: RequestsService, private route: ActivatedRoute, private router: Router,
                private panel: Panel) {
    }
    
    ngOnInit(){
        this.status = null;
        this.id = null;
        this.profile = JSON.parse(localStorage.getItem('profile'));
        this.getAssignedSenderRequests(this.profile);
        this.openNav();
    }
    
    updateResultsByParcelStatus(status: any){
        var temp = JSON.parse(JSON.stringify(this.filteredRequests));
        if (status.checked){
            for (var index in this.parcelRequests){
                if (this.parcelRequests[index].status === status.status){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.parcelRequests[index]._id){
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
                            this.filteredRequests.push({'req' :this.parcelRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.parcelRequests[index], 'cnt' : 1});
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
            for (var index in this.parcelRequests){
                if (this.parcelRequests[index].parcelDisclosure === description.parcelDisclosure){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.parcelRequests[index]._id){
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
                            this.filteredRequests.push({'req' :this.parcelRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.parcelRequests[index], 'cnt' : 1});
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
            for (var index in this.parcelRequests){
                if (this.parcelRequests[index].deliveryCity === city.deliveryCity){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.parcelRequests[index]._id){
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
                            this.filteredRequests.push({'req' :this.parcelRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.parcelRequests[index], 'cnt' : 1});
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
            for (var index in this.parcelRequests){
                if (this.parcelRequests[index].currentCity === city.currentCity){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.parcelRequests[index]._id){
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
                            this.filteredRequests.push({'req' :this.parcelRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.parcelRequests[index], 'cnt' : 1});
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
            for (var index in this.parcelRequests){
                if (this.parcelRequests[index].serviceProvider.journeyDate === date.dispatchDate){
                    if (temp.length >0){
                        var match;
                        for (var i in temp){
                            if (temp[i].req._id === this.parcelRequests[index]._id){
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
                            this.filteredRequests.push({'req' :this.parcelRequests[index], 'cnt' : 1});
                        }
                    }else {
                        this.filteredRequests.push({'req' :this.parcelRequests[index], 'cnt' : 1});
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
        document.getElementById("mySidenav").style.width = "350px";
        document.getElementById("main").style.marginLeft = "350px";
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
    
    onRejectClick(requestId, requestType){
        if (confirm("Reject Request?")){
            this.rejectRequest({requestId: requestId, requestType: requestType});
        }
    }
    
    mapLoadAssignedParcel(id:any, currentSenderAddress: any, currentServiceAddress:any, deliveryAddress:any, destinationAddress:any, status:any){
        
        this.currentServiceAddress = currentServiceAddress;
        this.currentSenderAddress = currentSenderAddress;
        this.deliveryAddress = deliveryAddress;
        this.destinationAddress = destinationAddress;
        
        
        if (this.id !== id && (status == 'Assigned To Service Provider' || status === 'Pending Approval At Service Provider' || status === 'Pending Approval At Parcel Sender') ){
            this.id = id;
            this.panel.initMap(this.id, this.currentSenderAddress, this.currentServiceAddress);
            this.mapAddress = "Map Direction To Service Provider";
        }
        if (this.id !== id && (status == 'Parcel Given To Service Provider' || status =='Parcel Collected From Sender' || status =='Parcel Delivered To Receiver' || status =='Parcel Received From Service Provider')){
            this.id = id;
            this.panel.initMap(this.id, this.deliveryAddress, this.destinationAddress);
            this.mapAddress = "Map Direction Between Service Provider and Receiver";
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
                        this.getDispatchDates();
                        this.getCurrentCities();
                        this.getDeliveryCities();
                        this.getItemDescriptions();
                        this.getParcelStatus();
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
                        this.getAssignedSenderRequests(this.profile);                    }
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
        for(var index in this.parcelRequests){
            if (temp.indexOf(this.parcelRequests[index].serviceProvider.journeyDate) <0){
                temp.push(this.parcelRequests[index].serviceProvider.journeyDate);
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
        for(var index in this.parcelRequests){
            if (temp.indexOf(this.parcelRequests[index].serviceProvider.currentCity) <0){
                temp.push(this.parcelRequests[index].serviceProvider.currentCity);
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
        for(var index in this.parcelRequests){
            if (temp.indexOf(this.parcelRequests[index].serviceProvider.destinationCity) <0){
                temp.push(this.parcelRequests[index].serviceProvider.destinationCity);
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
        for(var index in this.parcelRequests){
            if (temp.indexOf(this.parcelRequests[index].parcelDisclosure) <0){
                temp.push(this.parcelRequests[index].parcelDisclosure);
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
        for(var index in this.parcelRequests){
            if (temp.indexOf(this.parcelRequests[index].status) <0){
                temp.push(this.parcelRequests[index].status);
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