import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../user.service';
import { UserData } from '../models/user-data.model';
import { DateService } from '../date.service';
import { StripeService } from '../stripe.service';
import { WorkoutService } from '../workout.service';
import { WorkoutPlan } from '../models/Workout-Info.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentUserData:UserData | undefined;
  weekDates=[]
  day
  userEmail
  daysOfMonth=[]
  daysOfWeek=[]
  currentDay:number
  loading=true
  workoutPlan:WorkoutPlan | undefined;
  objectKeys = Object.keys;
  
constructor(private afAuth: AngularFireAuth, private firestore:AngularFirestore, private userService:UserService, private dateService: DateService, private stripeService: StripeService,
  private workoutService: WorkoutService, private router:Router
  ){
    
    this.workoutService.getWorkoutPlanByUserEmail().then(userData => {
      if (userData) {
        this.workoutPlan = userData.workoutInfo; 
      }
    });
 this.stripeService.checkUserSubscription().then(response =>{
  if(!response){
 
    this.stripeService.onCheckout().then(()=>{this.loading=false})

  }
  else{
    this.loading=false
  }
})

}


  async ngOnInit(){
   
    const nextWorkoutDay = await this.workoutService.getNextWorkoutDay();
    this.day = nextWorkoutDay;

this.weekDates = this.dateService.getWeekDates();
this.daysOfMonth = this.weekDates.map(date => date.getDate())
this.daysOfWeek = this.weekDates.map(date => date.toLocaleDateString('en-US', {weekday:'short'}))
this.userEmail = await this.userService.getCurrentUserEmail()
if (this.userEmail) {
  this.currentUserData = await this.userService.getUserDataByEmail(this.userEmail);
}
this.currentDay=this.dateService.findCurrentDay(this.weekDates)
}

navigateToWorkout(){
  this.router.navigate(['workout'])
}

}