import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AppComponent } from './app.component';
import { Routes, RouterModule } from '@angular/router';
import { environment as env } from 'src/environments/environment';
import { LoginComponent } from './login/login.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { StripeComponent } from './stripe/stripe.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { WorkoutLogComponent } from './workout-log/workout-log.component';
import { ModalComponent } from './modal/modal.component';
import { MembershipComponent } from './membership/membership.component';
import { SubscriptionGuard } from './subscription.guard';
import { AuthGuard } from './auth.guard';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http';
// canActivate: [AuthGuard, SubscriptionGuard]
const routes:Routes=[
  {path:'', component:LandingPageComponent},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent, canActivate: [AuthGuard, SubscriptionGuard]},
  {path:'workout',component:WorkoutLogComponent},
  {path:'membership',component:MembershipComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
     HomeComponent,
     StripeComponent,
     LandingPageComponent,
     WorkoutLogComponent,
     ModalComponent,
     MembershipComponent,
    
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(env.firebase),
    FormsModule,ReactiveFormsModule,
    CalendarModule,BrowserAnimationsModule,
    TableModule,InputTextModule,HttpClientModule

  ],
  providers: [ SubscriptionGuard, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
