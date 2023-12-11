import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, User, user,getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afAuth: AngularFireAuth, private afStore:AngularFirestore) { }

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

