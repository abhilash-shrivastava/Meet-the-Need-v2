import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import {ServiceProviderComponent} from "./service-provider/service-provider.component";
import {AcceptParcelComponent} from "./accept-parcel/accept-parcel.component";
import {ParcelReceivingComponent} from "./parcel-receiving/parcel-receiving.component";
import {ParcelDeliveryComponent} from "./parcel-delivery/parcel-delivery.component";
import {AllServiceRequestsComponent} from "./all-service-requests/all-service-requests.component";
import {ParcelSenderComponent} from "./parcel-sender/parcel-sender.component";
import {AcceptServiceComponent} from "./accept-service/accept-service.component";
import {ParcelGivenComponent} from "./parcel-given/parcel-given.component";
import {AllParcelRequestsComponent} from "./all-parcel-requests/all-parcel-requests.component";
import {ReceiverActionComponent} from "./receiver-action/receiver-action.component";
import {AllReceiverRequestsComponent} from "./all-receiver-requests/all-receiver-requests.component";


export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  {path: 'all-receiver-requests',    component: AllReceiverRequestsComponent},
  {path: 'receiver-action',    component: ReceiverActionComponent},
  {path: 'all-parcel-requests',    component: AllParcelRequestsComponent},
  {path: 'parcel-given',    component: ParcelGivenComponent},
  {path: 'accept-service',    component: AcceptServiceComponent},
  {path: 'parcel-sender',    component: ParcelSenderComponent},
  {path: 'service-provider',    component: ServiceProviderComponent},
  {path: 'accept-parcel',    component: AcceptParcelComponent},
  {path: 'parcel-receiving',    component: ParcelReceivingComponent},
  {path: 'parcel-delivery',    component: ParcelDeliveryComponent},
  {path: 'all-service-requests',    component: AllServiceRequestsComponent},
  { path: '**',    component: NoContentComponent }
];
