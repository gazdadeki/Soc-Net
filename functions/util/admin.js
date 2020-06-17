const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://soc-net-ad908.firebaseio.com/screams/0lv6GuFqb7ju5MvGIKr6",
    storageBucket: "soc-net-ad908.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };