(function() {
   	// Initialize Firebase
	const config = {
    	apiKey: "AIzaSyBIPCHDWClIz_8FeoqLwM5bEYzLkV0QSc0",
    	authDomain: "shaelyn-487ff.firebaseapp.com",
    	databaseURL: "https://shaelyn-487ff.firebaseio.com",
    	projectId: "shaelyn-487ff",
    	storageBucket: "shaelyn-487ff.appspot.com",
    	messagingSenderId: "188207705889"
  	};
  	firebase.initializeApp(config);

  	//Set the base containers
  	const username = document.getElementById('firebase-username');
  	const image = document.getElementById('firebase-image');

	firebase.auth().onAuthStateChanged((user) => {
	  	if (user) {
	      	// Create references
		  	const dbRefUserObject = firebase.database().ref().child('Users/'+user.uid);
		  	const dbRefChatObject = firebase.database().ref().child('Chat/'+user.uid);
		  	const dbRefFriendsObject = firebase.database().ref().child('Friends/'+user.uid);
		  	const dbRefFeedsObject = firebase.database().ref().child('feed/'+user.uid);
		  	const dbRefListsObject = firebase.database().ref().child('lists/'+user.uid);
			const dbRefMessagesObject = firebase.database().ref().child('messages/'+user.uid);
			const dbRefNotificationsObject = firebase.database().ref().child('notifications/'+user.uid);

		  	// Sync object USER changes
		  	dbRefUserObject.on('value', snap => {
		  		if(username) {
		  			username.innerHTML = snap.val().name
		  		}

		  		if(image) {
					image.src = snap.val().image
		  		}
		  	});
	  	}
	});
}());