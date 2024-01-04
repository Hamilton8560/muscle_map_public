import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Exercise } from './models/exercise.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  private workoutUrl = "http://127.0.0.1:5000/generate-workout"

  constructor(private http: HttpClient, private store: AngularFirestore) {}

  // async createWorkout(workoutInfo): Promise<any> {
  //   try {
  //     const availableExercises = await this.getAllExerciseNames().toPromise();
  //     const body = { workoutInfo, availableExercises };
  //     return await this.http.post(this.workoutUrl, body).toPromise();
  //   } catch (error) {
  //     console.error('Error in createWorkout:', error);
  //     throw error;
  //   }
  // }
  // async createWorkout(workoutInfo){
  //   const availableExercises = await this.getAllExerciseNames().toPromise()
  //   console.log( "workoutInfo: ", workoutInfo, "availableExercises: ", availableExercises)
  //   const body = { workoutInfo,availableExercises };
  //   return this.http.post(this.workoutUrl, body);
  // }
  createWorkout(userInfo, availableExercises){
    // let availableExercises
    // this.getAllExerciseNames().subscribe(response=>{availableExercises = response})
    console.log( "workoutInfo: ", userInfo, "availableExercises: ", availableExercises)
    const body = { userInfo, availableExercises };
    console.log(userInfo, " final")
    return this.http.post(this.workoutUrl, body);
  }

  getAllExerciseNames(): Observable<string[]> {
    return this.store.collection<Exercise>('exercises').valueChanges().pipe(
      map(exercises => exercises.map(exercise => exercise.exercise))
    );
  }

}


// generateWorkouts() {
//   this.workoutForm.value.goal = this.selectedGoals;
//   const userInfo = this.workoutForm.value;
//   this.exercisesService.createWorkout(this.workoutInfo, userInfo, this.availableExercises).subscribe(
//     response => {
//       // Map the response to the WorkoutPlan interface
//       const myWorkoutPlan: WorkoutPlan = response;
//       console.log(myWorkoutPlan);
      
//       const email =  "gabelabbate@gmail.com"
//       this.usersService.addOrUpdateWorkoutInfo(email,myWorkoutPlan)
//       // You can now use 'myWorkoutPlan' in your component as per your requirement
//     },
//     error => {
//       console.log('error', error);
//     }
//   );
// }