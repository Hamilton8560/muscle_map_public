import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { WorkoutInfo } from '../models/Workout-Info.model';
import { ExerciseService } from '../exercise.service';
import { UserService } from 'src/user.service';
import { StripeService } from '../stripe.service';


@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent {
  workoutForm = new FormGroup({
    dateOfBirth: new FormControl('', [Validators.required]),
    weightUnit: new FormControl('LBS'),
    age:new FormControl(''),
    gender:new FormControl('', [Validators.required]),
    weight: new FormControl('', [Validators.required, Validators.minLength(1), this.maxDigitsValidator(3)]),
    goal: new FormControl([]),
    experience: new FormControl('', [Validators.required]),
    maxDeadlift: new FormControl('', [Validators.required, Validators.minLength(1), this.maxDigitsValidator(3)]),
    maxSquat:new FormControl('', [Validators.required, Validators.minLength(1), this.maxDigitsValidator(3)]),
    maxBench: new FormControl('', [Validators.required, Validators.minLength(1), this.maxDigitsValidator(3)]),
    maxRow: new FormControl('', [Validators.required, Validators.minLength(1), this.maxDigitsValidator(3)]),
    trainingDays:new FormControl('', [Validators.required, this.maxDigitsValidator(1)]),
  })
  weightType='Pounds'
date
  goals = {
    "Lose Weight": false,
    'Gain Muscle': false,
    'Strength': false,
    'Endurance': false,
    'Improve Health': false,
    'Sports Performance': false,
    'Mobility & Flexibility': false
  };
  goalsSelected=false;
  subscriptionSelected=false
  availableExercises
  workoutInfo: WorkoutInfo = {
    age:0, // 
    gender: '',
    weight: 0,
    goals: [],
    maxLifts: {
      deadlift: 0,
      squat: 0,
      benchPress: 0,
      bentoverRow: 0
    }
  };

membership=false
loading = false

constructor(private router: Router, private exerciseService:ExerciseService, private userService: UserService, private stripeService:StripeService){}

goBack(){
  this.router.
  navigate([''])
}
objectKeys(obj: any): string[] {
  return Object.keys(obj);
}
toggleGoal(goal: string) {
  this.goals[goal] = !this.goals[goal];
  console.log(`${goal}: ${this.goals[goal]}`);
}

// Function to iterate through the goals and collect selected ones
getSelectedGoals() {
  const selectedGoals = [];
  for (const goal in this.goals) {
    if (this.goals[goal]) {
      selectedGoals.push(goal);
    }
  }
  console.log('Selected Goals:', selectedGoals);
  this.workoutInfo.goals = selectedGoals
  console.log('workout ', this.workoutInfo.goals )
  this.goalsSelected=true
}

async getExerciseArray() {
  const exerciseObservable = await this.exerciseService.getAllExerciseNames();
  exerciseObservable.subscribe(exercises => {
    this.availableExercises = exercises;
  });
}
addWorkoutInfo(){
  this.workoutForm.value.goal=this.workoutInfo.goals
  const userInfo = this.workoutForm.value
  console.log(userInfo)
  this.membership = true
}

async getDateOfBirth(event): Promise<void> {
  const dateOfBirth = event.target.value;
  const userEmail = await this.userService.getCurrentUserEmail();
  this.workoutForm.value.age = this.getAge(dateOfBirth)
  if(this.workoutForm.value.age){
    setTimeout(() => {
    this.userService.updateBirthDay(userEmail, dateOfBirth)
        .then(() => {
          console.log('Date of birth and age updated successfully');
        })
        .catch(error => {
          console.error('Error updating date of birth and age', error);
        });
    },5000);
   } else {
      console.error('Invalid date of birth or user email not found');
    }
    console.log(this.workoutForm.value)
  }

weightChange(event){
  if(event.target.value == 'LBS'){
    this.weightType = 'Pounds'
  }
  else{
    this.weightType='Kilograms'
  }
 
}

getAge(dateOfBirth: string) {
  const currentDate = new Date();
  const birthday = new Date(dateOfBirth);
  
  let age = currentDate.getFullYear() - birthday.getFullYear();
  const monthDifference = currentDate.getMonth() - birthday.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthday.getDate())) {
      age--;
  }
  if(age > 1 && age < 110){
  return age.toString()
}
return null
}

subscriptionPlan(membership){
  this.loading=true;
  if (membership === 'yearly'){
    this.stripeService.onCheckoutAnnual()
  }
  else{
    this.stripeService.onCheckout()
  }

}

maxDigitsValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined) {
      return null;
    }
    const stringValue = control.value.toString();
    return stringValue.length > maxLength ? { maxDigits: true } : null;
  };
}

get dateOfBirthField() {
  return this.workoutForm.get('dateOfBirth');
} 

get weightUnitField() {
  return this.workoutForm.get('weightUnit');
}

get ageField() {
  return this.workoutForm.get('age');
}

get genderField() {
  return this.workoutForm.get('gender');
}

get weightField() {
  return this.workoutForm.get('weight');
}

get goalField() {
  return this.workoutForm.get('goal');
}

get experienceField() {
  return this.workoutForm.get('experience');
}

get maxDeadliftField() {
  return this.workoutForm.get('maxDeadlift');
}

get maxSquatField() {
  return this.workoutForm.get('maxSquat');
}

get maxBenchField() {
  return this.workoutForm.get('maxBench');
}

get maxRowField() {
  return this.workoutForm.get('maxRow');
}

get trainingDaysField() {
  return this.workoutForm.get('trainingDays');
}

}
// // export interface WorkoutInfo {
//   age: number;
//   gender: string;
//   weight: number;
//   goals: string[];
//   maxLifts: MaxLifts;
// }

// export interface MaxLifts {
//   deadlift: number;
//   squat: number;
//   benchPress: number;
//   bentoverRow: number;
// }