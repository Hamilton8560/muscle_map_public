import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, User, user,getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserData } from './app/models/user-data.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth: AngularFireAuth, private afStore:AngularFirestore) { }

  async updateBirthDay(dateOfBirth: string): Promise<void> {
    const currentUser = await this.afAuth.currentUser;
    const userId = currentUser.uid;
    const birthday = new Date(dateOfBirth);
    const age = new Date().getFullYear() - birthday.getFullYear();
    
    return this.afStore.collection('users').doc(userId).update({ dateOfBirth });
  }

  signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Sign in with email/password
  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Sign out
  signOut() {
    return this.afAuth.signOut();
  }
  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider);
  }

  // Get the auth state
  getAuthState() {
    return this.afAuth.authState;
  }

  // Send password reset email
  sendPasswordResetEmail(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  // Update user profile
  updateProfile(displayName: string, photoURL: string) {
    const user = firebase.auth().currentUser;
    if(!user){
      console.log("no user")
      return null
    }
    return user.updateProfile({ displayName, photoURL });
  }

  //add new user
  addUser(userData:UserData){
    this.afStore.collection('user').add(userData)
    .then(docRef =>{
      console.log('Document written with ID: ', docRef.id);
    })
    .catch(error =>{
      console.error('Error adding document: ', error);
    })
  }

  emailExists(email: string): Observable<boolean> {
    return this.afStore.collection('users', ref => ref.where('email', '==', email))
      .valueChanges()
      .pipe(
        take(1),
        map(users => users.length > 0)
      );
  }


  async getUserDataByEmail(email: string): Promise<UserData | null> {
    try {
      const userDocs = await firstValueFrom(this.afStore.collection<UserData>('users', ref => ref.where('email', '==', email)).get());
      if (userDocs.empty) {
        return null;  // No user found with the provided email
      }
      return userDocs.docs[0].data();  // Assuming email is unique and returning the first result
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }


  createUserDocument(userData: UserData) {
    // Ensure the UID from Firebase Auth is used as the document ID
    return this.afStore.collection('users').doc(userData.uid).set(userData, { merge: true });
  }
  

  async getCurrentUserEmail(): Promise<string | null> {
    const user = await firstValueFrom(this.afAuth.user);
    return user ? user.email : null;
  }



  // Email verification
  sendVerificationMail() {
    const user = firebase.auth().currentUser;
    if(!user){
      console.log("no user")
      return null
    }
    return user.sendEmailVerification();
  }



}


