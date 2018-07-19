// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not want to serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
//firebase.messaging();


importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase-messaging.js');

var config = {
	apiKey: "AIzaSyBIPCHDWClIz_8FeoqLwM5bEYzLkV0QSc0",
	authDomain: "shaelyn-487ff.firebaseapp.com",
	databaseURL: "https://shaelyn-487ff.firebaseio.com",
	projectId: "shaelyn-487ff",
	storageBucket: "shaelyn-487ff.appspot.com",
	messagingSenderId: "188207705889"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();