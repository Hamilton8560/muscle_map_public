import { WorkoutInfo, WorkoutPlan } from "./Workout-Info.model";

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    workoutInfo?: WorkoutPlan;
    uid?: string;
    personalBests?: Record<string, PersonalBest>;
    workouts?:any;
}

export interface PersonalBest {
    speculative1RM?: number;
    maxWeight?: number | string;
    maxReps?:number;
    date:Date;
    bodyweight?:boolean;
}