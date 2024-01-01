import { Component } from '@angular/core';
import { WorkoutService } from '../workout.service';
import { WorkoutPlan, WorkoutLog } from '../models/Workout-Info.model';
import { log } from '../models/workout-log.model';
import { ExerciseService } from '../exercise.service';
import { PersonalBest } from '../models/user-data.model';
import { ExerciseInfo } from '../models/exercise-info.model';


@Component({
  selector: 'app-workout-log',
  templateUrl: './workout-log.component.html',
  styleUrls: ['./workout-log.component.css']
})
export class WorkoutLogComponent {
  workoutPlan: any
  day: number
  exercises: any[] = [];
  selectedValues: any[] = [];
  isModalOpen = false;
  loggedExercises: log[] = [];
  dateOfWorkout
  selectedCheckbox: Record<number, string> = {};
 
  
  constructor(private workoutService: WorkoutService, private exerciseService: ExerciseService) {}
  
  async ngOnInit() {
    const nextWorkoutDay = await this.workoutService.getNextWorkoutDay();
    this.day = nextWorkoutDay;
    this.dateOfWorkout=new Date()
    // Fetching user data
    const userData = await this.workoutService.getWorkoutPlanByUserEmail();
  
    if (userData && userData.workoutInfo && userData.workoutInfo.workoutLog) {
      const dayKey = 'day' + this.day;
      this.workoutPlan = userData;
      const dayExercises = userData.workoutInfo.workoutLog[dayKey];
  
      if (dayExercises) {
        this.exercises = Object.keys(dayExercises).map(key => dayExercises[key]);
  
        await Promise.all(this.exercises.map(async (item, index) => {
          const setsArray = new Array(item.sets).fill(null).map((_, i) => i + 1); // Array of sets numbers
          const repsArray = new Array(item.sets).fill(item.reps); // Array of reps, duplicated for each set
          const weightsArray = await Promise.all(
            setsArray.map(async () => await this.parsePercentage(item.name, item.weight))
          );
  
          this.selectedValues[index] = {
            ...item,
            color:'green',
            sets: setsArray,
            reps: repsArray,
            weight: weightsArray
          };
        }));
      }
    }
  
    console.log(this.selectedValues);
  }

  openModal() {
    this.isModalOpen = true;
  }
  handleConfirm() {
    // Handle confirmation logic
    this.isModalOpen = false;
    this.onSubmit()
  }
  handleCancel() {
    this.isModalOpen = false;
  }

  updateWeight(event, i, index) {
    let newValue;
    if (event.target.value.toUpperCase() === 'BW') {
      newValue = 'bodyweight'; // Handle 'BW' input
    } else {
      newValue = parseFloat(event.target.value); // Convert to number for other inputs
      if (isNaN(newValue)) {
        console.log("Invalid input. Try again.");
        event.target.value = this.selectedValues[i].weight[index]; // Reset to original value
        return; // Exit the function to avoid updating with an invalid value
      }
    }
    this.selectedValues[i].weight[index] = newValue; // Update with new value
  }
updateReps(event, i, index) {
  const inputValue = parseFloat(event.target.value);
  if (isNaN(inputValue)) {
    console.log("Invalid input. Try again.");
    event.target.value = this.selectedValues[i].reps[index]; // Reset to original value
  } else {
    this.selectedValues[i].reps[index] = inputValue; // Update with new value
  }
}
  selectOption(index: number, item: any, color: string) {
    // Clear previous selections for this item
    this.selectedCheckbox[index] = color;
  
    if (color === 'green') {
      this.selectedValues[index] = { ...item, color: 'green' };
    } else if (color === 'yellow') {
      this.selectedValues[index] = { ...item, color: 'yellow' };
    } else if (color === 'red') {
      this.selectedValues[index] = { ...item, color: 'red' };
    }
  }

//useful when there is a PR for that exercise
async parsePercentage(name: string, weight: string): Promise<number | string> {
  const personalBest = await this.exerciseService.checkPersonalBest(name);
  if (typeof weight === 'string' && !personalBest ) {
    return weight;
  }
  
  if (weight.includes('%') && personalBest) {
    if (personalBest) {
      const numericValue = parseFloat(weight.replace('%', '')) / 100;
      const result = personalBest.speculative1RM * numericValue;
      return Math.round(result / 5) * 5; // Return numerical value, don't append '%'
    }
  }

  // If weight is a numeric value
  if (!isNaN(parseFloat(weight))) {
    return parseFloat(weight);
  }

  return weight; // Return as-is if it's neither percentage nor numeric
}

trackByFn(index, item) {
  return index; // or item.id if you have unique ids for items
}
  
onSubmit() {
  let exerciseInfoArray = [];
  const filteredValues = this.selectedValues.filter(value => value !== null);

  filteredValues.forEach(exercise => {
    exercise.sets.forEach((_, setIndex) => {
      let exerciseInfo: ExerciseInfo = {
        name: exercise.name,
        weight: exercise.weight[setIndex],
        reps: exercise.reps[setIndex]
      };
      exerciseInfoArray.push(exerciseInfo);
    });
  });

  this.updatePersonalBests(exerciseInfoArray, this.dateOfWorkout).then(response=>console.log(response));
  this.workoutService.logWorkoutByUserEmail(exerciseInfoArray, this.dateOfWorkout, this.day)
}

async updatePersonalBests(exerciseInfoArray, date) {
  for (const exerciseInfo of exerciseInfoArray) {
    await this.exerciseService.UpdatePersonalBest(exerciseInfo, date);
  }
}

}
