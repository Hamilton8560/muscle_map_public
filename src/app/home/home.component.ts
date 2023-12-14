import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../user.service';
import { UserData } from '../login/user-data.model';
import { DateService } from '../date.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentUserData:UserData | undefined;
  weekDates=[]
  userEmail
  daysOfMonth=[]
  daysOfWeek=[]
  currentDay:number
constructor(private afAuth: AngularFireAuth, private firestore:AngularFirestore, private userService:UserService, private dateService: DateService){
 
}


  async ngOnInit(){
   
   
this.weekDates = this.dateService.getWeekDates();
this.daysOfMonth = this.weekDates.map(date => date.getDate())
this.daysOfWeek = this.weekDates.map(date => date.toLocaleDateString('en-US', {weekday:'short'}))
this.userEmail = await this.userService.getCurrentUserEmail()
if (this.userEmail) {
  this.currentUserData = await this.userService.getUserDataByEmail(this.userEmail);
}
this.currentDay=this.dateService.findCurrentDay(this.weekDates)
}

}