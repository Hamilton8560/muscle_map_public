import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Auth, User, user,getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { UserService } from 'src/user.service';
import { FormControl, FormGroup, Validators  } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserData  } from './user-data.model'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  register=false;
  


  loginForm=new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })
  registerForm=new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    dateOfBirth: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    passwordConfirm: new FormControl('')
  })
  constructor(private afAuth: AngularFireAuth, private userService:UserService, private afStore: AngularFirestore, private router: Router) {}
  
  reset(email:string){
    this.afAuth.sendPasswordResetEmail(email)
    .then(() => {
      // Handle successful password reset email sent
      console.log('Password reset email sent');
    })
    .catch(error => {
      // Handle errors (e.g., invalid email)
      console.error('Error sending password reset email:', error);
    });
}

  
signUp() {
  const user = this.registerForm.value;
  if (user.password !== user.passwordConfirm) {
    console.log("Passwords do not match");
    return;
  }

  this.userService.emailExists(user.email).subscribe(exists => {
    if (exists) {
      console.log("Email already exists");
      return;
    } else {
      this.userService.signUp(user.email, user.password)
        .then((result) => {
          if (result.user) {
            const userData = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: result.user.email,
              // Add other user data as needed
            };
            return this.afStore.collection('users').doc(result.user.uid).set(userData);
          } else {
            throw new Error('User creation failed');
          }
        })
        .then(() => {
          console.log('Registration successful');
          // Perform any additional actions on successful registration
        })
        .catch(error => {
          console.error("Registration error", error);
        });
    }
  });
}

  login(): void {
    console.log(this.loginForm.value)
    this.userService.signIn(this.loginForm.value.email, this.loginForm.value.password)
      .then(() => {
        // Handle successful login
        console.log('Login successful');
        this.router.navigate(['home'])
      })
      .catch(error => {
        // Handle login errors (e.g., invalid credentials)
        console.error('Login error', error);
      });
  }
  signInWithGoogle() {
    this.userService.signInWithGoogle().then(response => {
        const [firstName, lastName] = response.user.displayName.split(" ");
        const email = response.user.email
        console.log("names", firstName, lastName);
        const userData:UserData = {
          firstName,lastName,email
        }
        this.userService.emailExists(userData.email).subscribe(exists => {
          if (!exists) {
            this.afStore.collection('users').doc().set(userData).then(()=>
            {
              console.log("google database successful")
            })
            .catch(error=>{
              console.log("google auth database ", error)
            })
          }
          
          })
  
        
        // Check the authentication state and navigate
        if (this.userService.getAuthState()) {
            this.router.navigate(['home']);
        }
    }).catch(error => {
        console.error("Sign in failed", error);
        // Handle any errors here
    });
}

  onRegister(){
    this.register=!this.register;
  }
}
/*

signUp() {
  const userFormData = this.registerForm.value;
  if (userFormData.password !== userFormData.passwordConfirm) {
    console.error('Passwords do not match');
    return;
  }

  this.afAuth.createUserWithEmailAndPassword(userFormData.email, userFormData.password)
    .then((userCredential) => {
      // Update the display name in Firebase Authentication
      if (userCredential.user) {
        return userCredential.user.updateProfile({
          displayName: `${userFormData.firstName} ${userFormData.lastName}`
        }).then(() => userCredential); // Return userCredential for the next chain
      } else {
        throw new Error('User not found');
      }
    })
    .then((userCredential) => {
      // Save additional user data in Firestore
      const userData = {
        firstName: userFormData.firstName,
        lastName: userFormData.lastName,
        email: userFormData.email,
        dateOfBirth: userFormData.dateOfBirth,
        // any other data
      };
      return this.afStore.collection('users').doc(userCredential.user.uid).set(userData);
    })
    .then(() => {
      console.log('Registration successful');
      // Redirect or perform other actions on successful registration
    })
    .catch(error => {
      console.error('Registration error', error);
    });
}









Here are some commonly used properties of the Firebase User object:

    uid: The user's unique ID.
    email: The user's email address.
    displayName: The user's display name.
    photoURL: The user's photo URL.
    emailVerified: Boolean indicating whether the user's email address has been verified.
    phoneNumber: The user's phone number.
    providerData: An array of user's linked provider accounts (like Google, Facebook).

Methods and Functionalities

    updateProfile(): Update a user's profile information (like displayName and photoURL).
    updateEmail(): Update a user's email address.
    updatePassword(): Change a user's password.
    sendEmailVerification(): Send an email verification to a user's email.
    sendPasswordResetEmail(): Send a password reset email.
    delete(): Delete the user's account.
    getIdToken(): Get the user's ID token, used for authenticating with your backend.


    Additional User Management Functions

    reauthenticateWithCredential(credential): Prompts the user to re-enter their sign-in credentials. This is often used before sensitive operations like changing a password
     or deleting an account.
    linkWithCredential(credential): Links a user account with a new authentication provider.
    unlink(providerId): Unlinks a user from an authentication provider.
    getIdTokenResult(forceRefresh): Retrieves the Firebase ID token and associated claims for the user. This can be useful for role-based access control (RBAC) in your application.
    verifyBeforeUpdateEmail(newEmail, actionCodeSettings?): Sends a verification email to a new email address before updating the user's email in Firebase Auth.

Multi-Factor Authentication

Firebase also supports multi-factor authentication (MFA). This adds an extra layer of security to your user accounts.

    multiFactor: This property on the user object provides access to multi-factor-related properties and operations.

Reacting to Authentication State Changes

The authState observable from AngularFireAuth allows you to reactively respond to changes in the user's authentication state (login/logout). It emits a User object when the user is logged in and null when logged out.
Note

When working with Firebase Authentication, it’s important to handle the user state responsibly, particularly regarding displaying personal information and managing sensitive actions like password changes or account deletion.

By utilizing these properties and methods, you can effectively manage user authentication and related functionalities in your Angular application.
 */