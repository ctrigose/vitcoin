
import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// Initialize Firebase
let config = {
    apiKey: "AIzaSyD-MnfptvWooYLV2HlHdO1m9_MTgZckn8Q",
    authDomain: "bitcoin-cb6c7.firebaseapp.com",
    databaseURL: "https://bitcoin-cb6c7.firebaseio.com",
    projectId: "bitcoin-cb6c7",
    storageBucket: "bitcoin-cb6c7.appspot.com",
    messagingSenderId: "241612172651"
}

class Firebase {

    constructor() {
        app.initializeApp(config)

        this.auth = app.auth()
        this.db = app.database();
    }

    //AUTH API

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password)

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password)

    doSignOut = () => this.auth.signOut()

    doPasswordReset = email => this.auth.doPasswordReset(email)

    doPasswordUpdate = password => this.auth.currentUser.updatePassword(password)
    
    //DATABASE API 

    user = uid => this.db.ref(`users/${uid}`);

    users = () => this.db.ref('users');
}

export default Firebase