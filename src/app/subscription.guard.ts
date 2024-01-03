// subscription.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StripeService } from './stripe.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate {
  constructor(private stripeService: StripeService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const hasSubscription = await this.stripeService.checkUserSubscription();
    if (!hasSubscription) {
      this.router.navigate(['membership']); // Redirect to subscription page
      return false;
    }
    return true;
  }
}
