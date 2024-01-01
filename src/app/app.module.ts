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


const routes:Routes=[
  {path:'', component:LandingPageComponent},
  {path:'login',component:LoginComponent},
  {path:'home',component:HomeComponent},
  {path:'workout',component:WorkoutLogComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
     HomeComponent,
     StripeComponent,
     LandingPageComponent,
     WorkoutLogComponent,
     ModalComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(env.firebase),
    FormsModule,ReactiveFormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
