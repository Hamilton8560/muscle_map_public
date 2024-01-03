import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(private db: AngularFirestore, private afAuth: AngularFireAuth, private fireFunction: AngularFireFunctions) {}

  async createCheckoutSession(priceId: string): Promise<void> {
    const user = await firstValueFrom(this.afAuth.user);
    if (!user) {
      throw new Error('User not logged in');
    }

    const docRef = await this.db
      .collection(`customers/${user.uid}/checkout_sessions`)
      .add({
        price: priceId,
        success_url: 'http://localhost:4200/home',
        cancel_url: 'http://localhost:4200/membership',
      });

    return new Promise((resolve, reject) => {
      const unsubscribe = docRef.onSnapshot(snap => {
        const data:any = snap.data();
        console.log("data",data)
        if (data) {
          if (data.error) {
            unsubscribe();
            reject(`An error occurred: ${data.error.message}`);
          } else if (data.url) {
            unsubscribe();
            window.location.assign(data.url);
            resolve();
          }
        }
      }, reject);
    });
  }

  async onCheckout() {
    try {
      await this.createCheckoutSession('price_1OIh5zHv8mumYCropRMdQHIM');
    } catch (error) {
      console.error('Checkout error', error);
      alert(error);
    }
  }
  async onCheckoutAnnual(){
    try {
      await this.createCheckoutSession('price_1OU6yaHv8mumYCrosrjid90G');
    } catch (error) {
      console.error('Checkout error', error);
      alert(error);
    }
  }


async checkUserSubscription(): Promise<boolean> {
  const callable = this.fireFunction.httpsCallable('getUserSubscription');
  try {
    const result = await callable({}).toPromise();
    return result.hasSubscription;
  } catch (error) {
    console.error('Error checking subscription', error);
    return false;
  }
}


}
