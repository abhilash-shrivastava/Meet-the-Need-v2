/**
 * Created by Abhi on 2/9/17.
 */
import {Component, NgZone} from '@angular/core';
import {tokenNotExpired} from "angular2-jwt";
import {PaymentService} from "../services/payment.service";
import {error} from "util";

interface ICardDetails {
  first_name: string;
  last_name: string;
  card_number: string;
  card_cvc: string;
  exp_month_year: string;
  DOB: any;
  type: string
}

@Component({
  selector: 'payment-charge',
  templateUrl: './payment-charge.component.html',
  styleUrls: ['./payment-charge.component.css'],
  providers: [PaymentService]
})

export class PaymentChargeComponent {
  private profile: any;
  private cardAdded: boolean = false;
  private cardDetails: ICardDetails = {
    first_name: '',
    last_name: '',
    card_number: '',
    card_cvc: '',
    exp_month_year: '',
    DOB: '',
    type: ''
  };
  constructor( private paymentService: PaymentService, private zone:NgZone) {
    
  }
  ngOnInit() {
    Stripe.setPublishableKey('pk_test_sIVvogrsIcTZ0ZF7GRTc9Udk');
    this.profile = JSON.parse(localStorage.getItem('profile'));
  }
  
  private onSubmit() {
    let cardObject = {
      number: this.cardDetails.card_number,
      cvc: this.cardDetails.card_cvc,
      exp_month: parseInt(this.cardDetails.exp_month_year.split('-')[1]),
      exp_year: parseInt(this.cardDetails.exp_month_year.split('-')[0]),
      currency: "usd",
    };
    Stripe.card.createToken(cardObject, this.stripeResponseHandler);
  }
  
  private stripeResponseHandler =  (status, response) => {
    if (status === 200 && response.id) {
      let cardDetails = response.card;
      cardDetails.token = response.id;
      cardDetails.email = this.profile.email;
      cardDetails.first_name = this.cardDetails.first_name;
      cardDetails.last_name = this.cardDetails.last_name;
      cardDetails.DOB = this.cardDetails.DOB;
      cardDetails.type = this.cardDetails.type;
      delete cardDetails['metadata'];
      console.log(cardDetails);
      this.saveCard(cardDetails);
    }
  };
  
  private saveCard(stripeResponse: any) {
    this.paymentService.saveCard(stripeResponse)
      .subscribe(
        data => {
          this.zone.run(() => {
            this.cardAdded = true;
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

