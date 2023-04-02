const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");
admin.initializeApp();


exports.listUsers = functions.https.onCall('corsEnabledFunction', async  (data, context) => {
    response.set('Access-Control-Allow-Origin', '*');
  const listUsersResult = await admin.auth().listUsers();
  const users = listUsersResult.users.map((userRecord) => {
    return {
      uid: userRecord.uid,
      email: userRecord.email,
    };
  });
  return users;
});
