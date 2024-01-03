import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, firstValueFrom, map } from 'rxjs';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { UserData } from './models/user-data.model';
import { UserService } from 'src/user.service';
import { Exercise } from './models/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private afStore: AngularFirestore, private afAuth: AngularFireAuth, private fireFunction: AngularFireFunctions, private userService:UserService) {}



  async UpdatePersonalBest(exerciseInfo, date) {
    const email = await this.userService.getCurrentUserEmail();
    try {
        const userDocs = await firstValueFrom(this.afStore.collection<UserData>('users', ref => ref.where('email', '==', email)).get());
        if (userDocs.empty) {
            return null;
        }
        const userData = userDocs.docs[0].data();

        if (!userData.personalBests) {
            userData.personalBests = {};
        }

        let exerciseName = exerciseInfo.name;

        // Append '(Bodyweight)' for bodyweight exercises
        if (exerciseInfo.weight === 'bodyweight') {
            exerciseName += ' (Bodyweight)';
            // Update for bodyweight exercises
            if (!userData.personalBests[exerciseName] || exerciseInfo.reps > userData.personalBests[exerciseName].maxReps) {
                userData.personalBests[exerciseName] = {
                    maxReps: exerciseInfo.reps,
                    date,
                    bodyweight: true
                };
            }
        } else {
            // Handle weighted exercises
            const speculative1RM = exerciseInfo.weight * (1 + 0.0333 * exerciseInfo.reps);
            if (!userData.personalBests[exerciseName] || speculative1RM > userData.personalBests[exerciseName].speculative1RM) {
                userData.personalBests[exerciseName] = {
                    speculative1RM,
                    maxWeight: exerciseInfo.weight,
                    date
                };
            }
        }

        await this.afStore.collection<UserData>('users').doc(userDocs.docs[0].id).update(userData);

        return userData.personalBests[exerciseName];
    } catch (error) {
        console.error('Error fetching or updating user data:', error);
        return null;
    }
}


async checkPersonalBest(exerciseName){
      const email = await this.userService.getCurrentUserEmail();
    try {
        const userDocs = await firstValueFrom(this.afStore.collection<UserData>('users', ref => ref.where('email', '==', email)).get());
        if (userDocs.empty) {
            return null;  // No user found with the provided email
        }
        const userData = userDocs.docs[0].data();
        if (!userData.personalBests) {
          userData.personalBests = {};
          return null;
      }
      if (userData.personalBests[exerciseName]){
        console.log(userData.personalBests[exerciseName])
        return userData.personalBests[exerciseName]
      }
      else {
        return null
      }

}
catch(error){
  console.error('error fetching personal bests: ', error)
  return null;
}



}

async getAllExerciseNames(): Promise<Observable<string[]>> {
  return this.afStore.collection<Exercise>('exercises').valueChanges().pipe(
    map(exercises => exercises.map(exercise => exercise.exercise))
  );
}

}


