import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom, last } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { UserData } from './models/user-data.model';
import { UserService } from 'src/user.service';

@Injectable({
  providedIn: 'root'
})

export class WorkoutService {

  constructor(private afStore: AngularFirestore, private afAuth: AngularFireAuth, private fireFunction: AngularFireFunctions, private userService:UserService) {}

  async getWorkoutPlanByUserEmail(): Promise<UserData | null> {
    const email = await this.userService.getCurrentUserEmail()
    try {
      const userDocs = await firstValueFrom(this.afStore.collection<UserData>('users', ref => ref.where('email', '==', email)).get());
      if (userDocs.empty) {
        return null;  // No user found with the provided email
      }
      const userData = userDocs.docs[0].data();
      // Parse the workoutInfo if it exists
      if (userData.workoutInfo && typeof userData.workoutInfo === 'string') {
        userData.workoutInfo = JSON.parse(userData.workoutInfo);
      }
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }
  async getNextWorkoutDay(): Promise<number> {
    const email = await this.userService.getCurrentUserEmail();
    try {
      const userDocs = await firstValueFrom(this.afStore.collection<UserData>('users', ref => ref.where('email', '==', email)).get());
      if (userDocs.empty) {
        return 1; // Default to day 1 if no user found
      }
      
      const userData = userDocs.docs[0].data();
      let workoutInfo;
      if (typeof userData.workoutInfo === 'string') {
        workoutInfo = JSON.parse(userData.workoutInfo); // Parse if workoutInfo is a string
      } else {
        workoutInfo = userData.workoutInfo; // Use as is if already an object
      }
  
      const workoutLogs = await firstValueFrom(this.afStore.collection(`users/${userDocs.docs[0].id}/workouts`, ref => ref.orderBy('date', 'desc').limit(1)).get());
  
      let lastWorkoutDayNumber = 1;
      if (!workoutLogs.empty) {
        const userWorkoutData:any = workoutLogs.docs[0].data();
        lastWorkoutDayNumber = userWorkoutData.dayNumber || 1;
      }
  
      const totalWorkoutDays = Object.keys(workoutInfo.workoutLog).length;
      return (lastWorkoutDayNumber % totalWorkoutDays) + 1; // Calculate and return the next workout day
    } catch (error) {
      console.error('Error in getNextWorkoutDay:', error);
      return 1; // Return day 1 in case of error
    }
  }
  
  


  async logWorkoutByUserEmail(exerciseInfoArray, dateOfWorkout, dayNumber) {
    const email = await this.userService.getCurrentUserEmail();
    try {
      const userDocs = await firstValueFrom(this.afStore.collection<UserData>('users', ref => ref.where('email', '==', email)).get());
      if (userDocs.empty) {
        return null;
      }
  
      const userId = userDocs.docs[0].id; 
      const userData = userDocs.docs[0].data();
  
      // Create a workout log object
      const workoutLog = {
        date: dateOfWorkout,
        exercises: exerciseInfoArray,
        dayNumber, // Include the workout day number
      
      };
  
      // Add the workout log to the user's workouts sub-collection
      await this.afStore.collection(`users/${userId}/workouts`).add(workoutLog);
  
      return true;
    } catch (error) {
      console.error('Error logging workout:', error);
      return false;
    }
  }

  async addWorkoutToUser(workoutInfo) {
    const currentUser = await this.afAuth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    const userId = currentUser.uid;
    // Extract the title from the workout plan
    const title = workoutInfo.title;
    // Add the current date and time to workoutInfo
    workoutInfo.createdAt = new Date();
  
    // Update the workoutInfo in the user's document
    await this.afStore.collection('users').doc(userId).set({ workoutInfo }, { merge: true });
  
    // Add the workoutInfo with the timestamp to the programs sub-collection
    await this.afStore.collection(`users/${userId}/programs`).doc(title).set(workoutInfo);
  }

  async getLastProgram() {
    const currentUser = await this.afAuth.currentUser;
    const userId = currentUser.uid;
  
    const programsRef = this.afStore.collection(`users/${userId}/programs`, ref => 
      ref.orderBy('createdAt', 'desc').limit(1)
    );
    const querySnapshot = await programsRef.get().toPromise();
  
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
    } else {
        return null; // or handle the case when there are no programs
    }
  }
  async updateWorkoutInfoInFirebase(workoutInfo){
    const currentUser = await this.afAuth.currentUser;
    const userId = currentUser.uid;
    await this.afStore.collection('users').doc(userId).set({ workoutInfo }, { merge: true });
  }
  

  
}