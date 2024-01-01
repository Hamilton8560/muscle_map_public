export interface WorkoutInfo {
    age: number;
    gender: string;
    weight: number;
    goals: string[];
    maxLifts: MaxLifts;
  }
  
  export interface MaxLifts {
    deadlift: number;
    squat: number;
    benchPress: number;
    bentoverRow: number;
  }
  
  export interface WorkoutLog {
    [day: string]: DayExercises;
  }
  
  export interface DayExercises {
    [exercise: string]: ExerciseDetails;
  }
  
  export interface ExerciseDetails {
    name: string;
    sets: number;
    reps: number;
    weight: string | number;  // Use 'string' for percentages and 'number' for absolute weights
  }
  
  export interface NutritionRecommendations {
    dailyCalories: number;
    dailyFats: number;
    dailyCarbs: number;
    dailyProtein: number;
    percentFats: string;
    percentCarbs: string;
    percentProtein: string;
    description: string;
  }
  
  export interface WorkoutPlan {
    workoutInfo: WorkoutInfo;
    focus: string;
    workoutLog: WorkoutLog;
    nutritionRecommendations: NutritionRecommendations;
    recommendedExercises: string[];
    title:string;
    explanations:string;
  }
