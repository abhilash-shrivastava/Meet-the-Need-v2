/**
 * Created by Abhi on 2/9/17.
 */
import {Component, NgZone} from '@angular/core';
import {tokenNotExpired} from "angular2-jwt";
import {PaymentService} from "../services/payment.service";
import {error} from "util";
import {PaginationService} from "ng2-pagination";
import {GoogleApiService} from "../services/googleAPIService.service";

@Component({
  selector: 'payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css'],
  providers: [PaymentService, PaginationService, GoogleApiService]
})

export class PaymentDetailsComponent {
  private profile: any;
  private chargedDetails: any;
  constructor( private paymentService: PaymentService, private zone:NgZone) {
    
  }
  ngOnInit() {
    Stripe.setPublishableKey('pk_test_sIVvogrsIcTZ0ZF7GRTc9Udk');
    this.profile = JSON.parse(localStorage.getItem('profile'));
    this.getChargedDetails();
  }
  
  private getChargedDetails() {
    this.paymentService.getChargedDetails(this.profile.email)
      .subscribe(
        data => {
          this.zone.run(() => {
            this.chargedDetails = data;
            for (let index in this.chargedDetails) {
              this.chargedDetails[index].created = this.chargedDetails[index].created.split('T')[0]
            }
          });
          console.log(data);
        },
        error => {
          console.log(error);
        }
      );
  }
  
  private loggedIn() {
    return tokenNotExpired();
  }
}

