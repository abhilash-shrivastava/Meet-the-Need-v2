import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import {ServiceProviderComponent} from "./service-provider/service-provider.component";
import {AcceptParcelComponent} from "./accept-parcel/accept-parcel.component";
import {ParcelReceivingComponent} from "./parcel-receiving/parcel-receiving.component";
import {ParcelDeliveryComponent} from "./parcel-delivery/parcel-delivery.component";
import {AllServiceRequestsComponent} from "./all-service-requests/all-service-requests.component";
import {ParcelSenderComponent} from "./parcel-sender/parcel-sender.component";


export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  {path: 'parcel-sender',    component: ParcelSenderComponent},
  {path: 'service-provider',    component: ServiceProviderComponent},
  {path: 'accept-parcel',    component: AcceptParcelComponent},
  {path: 'parcel-receiving',    component: ParcelReceivingComponent},
  {path: 'parcel-delivery',    component: ParcelDeliveryComponent},
  {path: 'all-service-requests',    component: AllServiceRequestsComponent},
  { path: '**',    component: NoContentComponent }
];
