import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// const db = admin.firestore();

export const loginWithGoogle = functions.https.onRequest((req, res) => {
    const { idToken } = req.body;
  
    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        const { email } = decodedToken;
        res.status(200).send({ message: 'Login successful', email });
      })
      .catch((error) => {
        console.error('Login error:', error);
        res.status(500).send({ message: 'Login failed' });
      });
});

export const hello = functions.https.onRequest((req, res) => {
    res.status(200).send({ message: 'hello successful', });
});
  
