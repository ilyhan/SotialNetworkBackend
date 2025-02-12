const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
    apiKey: "AIzaSyD6OI6IiaCnz6TX-z6O604rsZJ40UoTOSI",
    authDomain: "postnest-dcc77.firebaseapp.com",
    projectId: "postnest-dcc77",
    storageBucket: "postnest-dcc77.appspot.com",
    messagingSenderId: "653085832518",
    appId: "1:653085832518:web:2a3079d556b39be2ebe147",
};

const app = initializeApp(firebaseConfig);
const auth = getStorage(app);

module.exports = {
    auth
}