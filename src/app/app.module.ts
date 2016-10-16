import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import {ServiceProviderComponent} from "./service-provider/service-provider.component";
import {MapDirective} from "./profile/map.directive";
import {Panel} from "./profile/panel";
import {ProfileComponent} from "./profile/profile.component";
import {PaginationControlsCmp, PaginatePipe} from "ng2-pagination/index";
import {AcceptParcelComponent} from "./accept-parcel/accept-parcel.component";
import {ParcelReceivingComponent} from "./parcel-receiving/parcel-receiving.component";
import {ParcelDeliveryComponent} from "./parcel-delivery/parcel-delivery.component";
import {AllServiceRequestsComponent} from "./all-service-requests/all-service-requests.component";
import {ParcelSenderComponent} from "./parcel-sender/parcel-sender.component";
import {AcceptServiceComponent} from "./accept-service/accept-service.component";



// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    ServiceProviderComponent,  
    NoContentComponent,
    MapDirective,
    Panel,
    ProfileComponent,
    PaginationControlsCmp,
    PaginatePipe,
    AcceptParcelComponent,
    ParcelReceivingComponent,
    ParcelDeliveryComponent,
    AllServiceRequestsComponent,
    ParcelSenderComponent,
    AcceptServiceComponent  
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}

