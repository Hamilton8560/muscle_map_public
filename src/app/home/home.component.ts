import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../user.service';
import { UserData } from '../login/user-data.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentUserData:UserData
  userEmail

constructor(private afAuth: AngularFireAuth, private firestore:AngularFirestore, private userService:UserService){}

  async ngOnInit(){
this.userEmail = await this.userService.getCurrentUserEmail()
if (this.userEmail) {
  this.currentUserData = await this.userService.getUserDataByEmail(this.userEmail);
}
console.log("userData",this.currentUserData)
}

}