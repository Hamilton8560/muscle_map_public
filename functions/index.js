/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/*
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
*/

const functions = require("firebase-functions");
const admin = require("firebase-admin");
// eslint-disable-next-line max-len
const stripe = require("stripe")("sk_test_51NDASeHv8mumYCroLPdMO7BWRmh4v5dFAsTlX5lnIBGY6urv7dqOTe6tKPCh8fs0T0oGQZsaegRKsRVX776RD8Qq00NdfRXVzt");

admin.initializeApp();

exports.getUserSubscription = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    // eslint-disable-next-line max-len
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
  }

  const userId = context.auth.uid;
  const customerRef = admin.firestore().collection("customers").doc(userId);
  const customerDoc = await customerRef.get();

  if (!customerDoc.exists) {
    return {hasSubscription: false};
  }

  const stripeCustomerId = customerDoc.data().stripeId;
  // eslint-disable-next-line max-len
  const subscriptions = await stripe.subscriptions.list({customer: stripeCustomerId, status: "active"});

  return {hasSubscription: subscriptions.data.length > 0};
});

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
