/**
 * Created by Abhi on 2/9/17.
 */
import {Component} from '@angular/core';
import {tokenNotExpired} from "angular2-jwt";
import {PaymentService} from "../services/payment.service";
import {error} from "util";

interface ICardDetails {
  card_number: string;
  card_cvc: string;
  exp_month_year: string;
}

@Component({
  selector: 'payment-charge',
  templateUrl: './payment-charge.component.html',
  styleUrls: ['./payment-charge.component.css'],
  providers: [PaymentService]
})

export class PaymentChargeComponent {
  private profile: any;
  private cardDetails: ICardDetails = {
    card_number: '',
    card_cvc: '',
    exp_month_year: ''
  };
  constructor( private paymentService: PaymentService) {
    
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
      exp_year: parseInt(this.cardDetails.exp_month_year.split('-')[0])
    };
    Stripe.card.createToken(cardObject, this.stripeResponseHandler);
  }
  
  private stripeResponseHandler =  (status, response) => {
    if (status === 200 && response.id) {
      let cardDetails = response.card;
      cardDetails.token = response.id;
      cardDetails.email = this.profile.email;
      delete cardDetails['metadata'];
      delete cardDetails['_proto_'];
      console.log(cardDetails);
      this.saveCard(cardDetails);
    }
  };
  
  private saveCard(stripeResponse: any) {
    this.paymentService.saveCard(stripeResponse)
      .subscribe(
        data => {
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

