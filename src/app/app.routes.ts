import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { NoContentComponent } from './no-content';
import {ServiceProviderComponent} from "./service-provider/service-provider.component";


export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  {path: 'service-provider',    component: ServiceProviderComponent},
  { path: '**',    component: NoContentComponent }
];
