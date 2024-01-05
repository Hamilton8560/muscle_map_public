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


  createWorkout(userInfo, availableExercises){
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


