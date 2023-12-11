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


const routes:Routes=[
  {path:'',component:LoginComponent},
  {path:'home',component:HomeComponent}
]

@NgModule({
  declarations: [
    AppComponent,

    LoginComponent,
     HomeComponent
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
