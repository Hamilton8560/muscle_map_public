import { Component } from '@angular/core';
import { StripeService } from '../stripe.service';
import { createCheckoutSession } from "@invertase/firestore-stripe-payments";

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent {
  userSubscribed:boolean;
priceId='price_1OIjzCHv8mumYCroaeFInANE'
  constructor(private stripeService:StripeService){}

  ngOnInit(){
    
  }

  validateSubscription(){
  this.stripeService.checkUserSubscription().then((response)=>{
     this.userSubscribed = response
    })
  }

  onClickSubscribe(){
    this.stripeService.onCheckout()
  }

}


/*
Cloud functions
createCustomer
Creates a Stripe customer object when a new user signs up.

createCheckoutSession
Creates a Checkout session to collect the customer's payment details.

createPortalLink
Creates links to the customer portal for the user to manage their payment & subscription details.

handleWebhookEvents
Handles Stripe webhook events to keep subscription statuses in sync and update custom claims.

onUserDeleted
Deletes the Stripe customer object and cancels all their subscriptions when the user is deleted in Firebase Authentication.

onCustomerDataDeleted
Deletes the Stripe customer object and cancels all their subscriptions when the customer doc in Cloud Firestore is deleted.



Cloud Secret Manager secrets
STRIPE_API_KEY
Stripe API key with restricted access

Values for these configuration parameters will be stored in Cloud Secret Manager and managed by Firebase Extensions 
(Firebase Extensions Service Agent will be granted Secret Admin role on these secrets).
STRIPE_WEBHOOK_SECRET
Stripe webhook secret

Values for these configuration parameters will be stored in Cloud Secret Manager and managed by Firebase Extensions 
(Firebase Extensions Service Agent will be granted Secret Admin role on these secrets).

*/