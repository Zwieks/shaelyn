/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Initializes FriendlyChat.
function ShaelynChat() {
  this.checkSetup();

  // // Shortcuts to DOM Elements.
  this.chat_list_wrapper = document.getElementById('firebase-chatgroups');
  this.chat_window_wrapper = document.getElementById('firebase-chat-conversations');
  //this.chat_conversation_wrapper = document.getElementById('firebase-chat-conversations');
  // this.messageList = document.getElementById('messages');
  this.messageForm = document.getElementById('chat-form');
  this.messageInput = document.getElementById('firebase-message-input');
  this.submitButton = document.getElementById('firebase-send-chat-message');
  this.submitImageButton = document.getElementById('firebase-submitImage');
  this.imageForm = document.getElementById('chat-form');
  this.mediaCapture = document.getElementById('firebase-mediaCapture');
  this.userPic = document.getElementById('user-pic');
  // this.userName = document.getElementById('user-name');
  // this.signInButton = document.getElementById('sign-in');
  // this.signOutButton = document.getElementById('sign-out');
  // this.signInSnackbar = document.getElementById('must-signin-snackbar');

  // Saves message on form submit.
  this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
  //this.signOutButton.addEventListener('click', this.signOut.bind(this));
  //this.signInButton.addEventListener('click', this.signIn.bind(this));

  // Toggle for the button.
  var buttonTogglingHandler = this.toggleButton.bind(this);
  this.messageInput.addEventListener('keyup', buttonTogglingHandler);
  this.messageInput.addEventListener('change', buttonTogglingHandler);

  // Events for image upload.
  this.submitImageButton.addEventListener('click', function(e) {
    e.preventDefault();
    this.mediaCapture.click();
  }.bind(this));
  this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));

  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
ShaelynChat.prototype.initFirebase = function() {
  	// Shortcuts to Firebase SDK features.
  	this.auth = firebase.auth();
  	this.database = firebase.database();
  	this.storage = firebase.storage();
	// Initiates Firebase auth and listen to auth state changes.
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

//Create Chat Windows for the group or single chat
ShaelynChat.prototype.loadChatWindows = function(groupId, groupsnap, count, totalNum) {
  const chat_meta = document.getElementById('firebase-chat-meta');
  
  this.messagesRef = this.database.ref('ChatMessages').child(groupsnap.key);
  
  var meta = HTMLcreateChatMeta(groupsnap, count, totalNum);
  $.fn.updateOrPrependHTML("chat-meta-"+groupId, meta, chat_meta);


  //Create the CHAT WINDOWS per GROUP
  var chat_window = HTMLcreateChatWindow(groupsnap, count, totalNum);

  //Put the HTML in the container
  $.fn.updateOrPrependHTML("chat-window-"+groupId, chat_window, this.chat_window_wrapper);

  //Check the window width
  if ($(window).width()>768) {
    //Init the scrollbar
    $("#chat-window-"+groupId).mCustomScrollbar({
        theme:"light-3",
        autoHideScrollbar: true,
        advanced: {
          updateOnImageLoad: true
        }
    }).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
  }
}; 

//Creates the chat overview with all the user groups or ividual chats
ShaelynChat.prototype.loadGroups = function(groupId, groupsnap, count, totalNum, activeGroupId) {
  $('#firebase-chat-friends').addClass('hide');

  //Put the HTML in the container
  var group = HTMLcreateGroup(groupsnap.key, groupsnap.val(), count, totalNum, activeGroupId);
  $.fn.updateOrPrependHTML("chat-"+groupId, group, this.chat_list_wrapper);

  var parent = document.getElementById(this.chat_list_wrapper.childNodes[0].id+'_container');
      var loaded = document.getElementById("firebase-chat-conversations");

  if (parent == null) {
    parent = this.chat_list_wrapper;
  }

  setTimeout(function(){
    $('#firebase-chat-friends').removeClass('hide');
  }, 100);
};  

ShaelynChat.prototype.seenMessages = function(oldGroupId, newGroupId) {
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const oldChat = ref.child('ChatAttendees').child(oldGroupId).child(userId);
  const newChat = ref.child('ChatAttendees').child(newGroupId).child(userId);

  let timestamp = firebase.database.ServerValue.TIMESTAMP;
  oldChat.once('value').then(function(snapshot) {
    oldChat.update({ 
      time: timestamp
    })
  });

  newChat.once('value').then(function(snapshot) {
    newChat.update({ 
      time: "active"
    })
  });
};

// Loads chat messages history and listens for upcoming ones.
ShaelynChat.prototype.loadMessages = function(groupId, groupsnap) {
  // Loads the last 12 messages and listen for new ones.
  var setMessage = function(data) {
    var val = data.val();
    //Put the HTML in the container
    var idObject = document.getElementById('chat-window-'+groupId);
    var parent = document.getElementById(idObject.childNodes[0].id+'_container'); 
    var message = HTMLcreateChatMessage(data.key, val.from, data);

    if (parent == null) {
      parent = this.chat_list_wrapper;
    }

    //Put the HTML in the container
    $.fn.updateOrPrependHTML("chat-message-"+data.key, message, parent);

    $("#chat-window-"+groupId).mCustomScrollbar("update");
    $("#chat-window-"+groupId).mCustomScrollbar("scrollTo", "bottom");
  }.bind(this);

  this.messagesRef.orderByChild('time').limitToLast(12).on('child_added', setMessage);
  this.messagesRef.orderByChild('time').limitToLast(12).on('child_changed', setMessage);
};

ShaelynChat.prototype.init = function() {
  //Get the current user ID
	const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chat = ref.child('BetaChat');
	// Reference to the /UserChat/ database path.
	this.chatsRef = this.database.ref('UsersChat').child(userId).orderByChild('time');
	// Make sure we remove all previous listeners.
	this.chatsRef.off();
  var activeGroupId = false;
    if($('#firebase-chatgroups').find('.active').length != 0){
      activeGroupId = $('#firebase-chatgroups').find('.active').attr('id').replace('chat-', '');
    }
  this.chatsRef.on('value', snap => {

    $('#firebase-chatgroups').empty();
    //Needed for iteration and setting of the active class
    var count = 1;
    snap.forEach(function(childSnapshot) {
      //Get the user chatgroup
      let chatGroupRef = chat.child(childSnapshot.key);

      chatGroupRef.once('value', groupsnap => {
        //Create the GROUPS
        ShaelynChat.loadGroups(groupsnap.key, groupsnap, count, snap.numChildren(), activeGroupId);

        if($('#firebase-chat-conversations').find('.chat-window.active').length == 0) {
          //Create the Chat windows per Group for the messages
          ShaelynChat.loadChatWindows(groupsnap.key, groupsnap, count, snap.numChildren());

          //Create the messages and put them in the corresponding group
          ShaelynChat.loadMessages(groupsnap.key, groupsnap);
        }  
      }).then(snaper => {
        //Add one to the counter after all other things are done
        count++;
        if (snap.numChildren() == count) {
           setTimeout(function(){
            $('#firebase-chat-conversations').addClass('loaded');
          }, 500);
        }
      }); 
    });
  });
};

ShaelynChat.prototype.seenCheck = function(active_groupId, messageId) {
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chatAttendeesRef = ref.child('ChatAttendees').child(active_groupId);

  chatAttendeesRef.once('value', snap => {
    snap.forEach(function(childSnapshot) {
      if(childSnapshot.val().time != 'active') {
        const promise = firebase.database().ref().child('ChatNotSeenMessages').child(childSnapshot.key).child(active_groupId).child(messageId).set(true);

        promise.then(function() {
          //console.log(childSnapshot.key);
        }.bind(this)).catch(function(error) {
          console.error('Error writing new message to Firebase Database', error);
        });
      }
    });
  }).then(snap => {
    const postRef = firebase.database().ref().child('ChatNotSeenMessages').child(userId).child(active_groupId);
    postRef.once('value').then(function(snapCount) {
      console.log(snapCount.numChildren());
    });
  });
};

ShaelynChat.prototype.removeUnSeenMessages = function(active_groupId) {
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chatNotSeenRef = ref.child('ChatNotSeenMessages');

  const promise = chatNotSeenRef.child(userId).child(active_groupId).remove();

  promise.then(function() {
    //console.log(childSnapshot.key);
  }.bind(this)).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
};

//Saves a new message on the Firebase DB.
ShaelynChat.prototype.saveMessage = function(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (this.messageInput.value) {
    const userId = firebase.auth().currentUser.uid;
    const ref = firebase.database().ref();
    const userRef = ref.child('Users').child(userId);
    const chatAttendeesRef = ref.child('ChatAttendees');

    userRef.once('value', usersnap => {
      
    }).then(snap => {
      var active_groupId = $('#firebase-chat-conversations .active').attr('id').replace('chat-window-', '');
      var currentUser = snap.val();
      this.messagesRef = this.database.ref('ChatMessages').child(active_groupId);

      let timestamp = firebase.database.ServerValue.TIMESTAMP;
      const promise = this.messagesRef.push({
        from: snap.key,
        message: this.messageInput.value,
        name: currentUser.name,
        order: timestamp,
        text: this.messageInput.value,
        time: firebase.database.ServerValue.TIMESTAMP,
        type: 'text'
      })
      const key = promise.key

      promise.then(function() {
        const postRef = this.messagesRef.child(key)
        postRef.once('value').then(function(snapshot) {
          timestamp = snapshot.val().order * -1
          postRef.update({ 
            order: timestamp
          })
        });

        //Check if the message is already seen by other users
        ShaelynChat.seenCheck(active_groupId, key);

        //Update the UserChat Timestamp for sorting the ChatGroups
        this.updateUserChatTimestamp(active_groupId);

        // Clear message text field and SEND button state.
        ShaelynChat.resetMaterialTextfield(this.messageInput);
        this.toggleButton();
      }.bind(this)).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
      });
    });      
  }
};

ShaelynChat.prototype.updateUserChatTimestamp = function(active_groupId) {
  // Create a new timestamp
  let timestamp = firebase.database.ServerValue.TIMESTAMP;

  //Get the user ID
  const userId = firebase.auth().currentUser.uid;

  // Generate the DB reference
  this.chatsRef = this.database.ref('UsersChat').child(userId);

  // Generate the UPDATE reference
  const postRef = this.chatsRef.child(active_groupId)
  postRef.update({ 
    time: timestamp
  });
};

// // Sets the URL of the given img element with the URL of the image stored in Firebase Storage.
// FriendlyChat.prototype.setImageUrl = function(imageUri, imgElement) {
//   // If the image is a Firebase Storage URI we fetch the URL.
//   if (imageUri.startsWith('gs://')) {
//     imgElement.src = FriendlyChat.LOADING_IMAGE_URL; // Display a loading image first.
//     this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
//       imgElement.src = metadata.downloadURLs[0];
//     });
//   } else {
//     imgElement.src = imageUri;
//   }
// };

// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
ShaelynChat.prototype.saveImageMessage = function(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  this.imageForm.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    return;
  }

  // We add a message with a loading icon that will get updated with the shared image.
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const userRef = ref.child('Users').child(userId);

  userRef.once('value', usersnap => {
    
  }).then(snap => {
    // Get the active chat ID
    var active_groupId = $('#firebase-chat-conversations .active').attr('id').replace('chat-window-', '');
    var currentUser = snap.val();
    this.messagesRef = this.database.ref('ChatMessages').child(active_groupId);

    let timestamp = firebase.database.ServerValue.TIMESTAMP;
    const promise = this.messagesRef.push({
      from: snap.key,
      imageUrl: ShaelynChat.LOADING_IMAGE_URL,
      name: currentUser.name,
      order: timestamp,
      time: firebase.database.ServerValue.TIMESTAMP,
      type: 'image'
    })
    const key = promise.key

    promise.then(function(data) {
      const postRef = this.messagesRef.child(key)
      postRef.once('value').then(function(snapshot) {
        timestamp = snapshot.val().order * -1
        postRef.update({ 
          order: timestamp 
        })
      });

      // Upload the image to Firebase Storage.
      var filePath = userId + '/' + data.key + '/' + file.name;
      return this.storage.ref(filePath).put(file).then(function(snapshot) {

        // Get the file's Storage URI and update the chat message placeholder.
        var fullPath = snapshot.metadata.fullPath;
        return data.update({
          imageLocation: this.storage.ref(fullPath).toString(),
          imageUrl: snapshot.downloadURL
        });
      }.bind(this));
    }.bind(this)).then(function(snap) {
        //Update the UserChat Timestamp for sorting the ChatGroups
        ShaelynChat.updateUserChatTimestamp(active_groupId);

        setTimeout(function(){
          $("#chat-window-"+active_groupId).mCustomScrollbar("update");
          $("#chat-window-"+active_groupId).mCustomScrollbar("scrollTo", "bottom");
        }, 500);
      }).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  });



  // this.messagesRef.push({
  //   name: currentUser.displayName,
  //   imageUrl: FriendlyChat.LOADING_IMAGE_URL,
  //   photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
  // }).then(function(data) {

  //   // Upload the image to Firebase Storage.
  //   var filePath = currentUser.uid + '/' + data.key + '/' + file.name;
  //   return this.storage.ref(filePath).put(file).then(function(snapshot) {

  //     // Get the file's Storage URI and update the chat message placeholder.
  //     var fullPath = snapshot.metadata.fullPath;
  //     return data.update({imageUrl: this.storage.ref(fullPath).toString()});
  //   }.bind(this));
  // }.bind(this)).catch(function(error) {
  //   console.error('There was an error uploading a file to Firebase Storage:', error);
  // });
};

// // Signs-in Friendly Chat.
// FriendlyChat.prototype.signIn = function() {
//   // Sign in Firebase using popup auth and Google as the identity provider.
//   var provider = new firebase.auth.GoogleAuthProvider();
//   this.auth.signInWithPopup(provider);
// };

// // Signs-out of Friendly Chat.
// FriendlyChat.prototype.signOut = function() {
//   // Sign out of Firebase.
//   this.auth.signOut();
// };



// // Triggers when the auth state change for instance when the user signs-in or signs-out.
ShaelynChat.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    //console.log(user);
    var profilePicUrl = user.photoURL;
    var userName = user.displayName;

    // Set the user's profile pic and name.
    //this.userPic.style.backgroundImage = 'url(' + (profilePicUrl || '/images/profile_placeholder.png') + ')';
    //this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    //this.userName.removeAttribute('hidden');
    //this.userPic.removeAttribute('hidden');
    //this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
   // this.signInButton.setAttribute('hidden', 'true');

    // We load currently existing chat messages.
   	this.init();

    // We save the Firebase Messaging Device token and enable notifications.
    this.saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    //  this.userName.setAttribute('hidden', 'true');
    //this.userPic.setAttribute('hidden', 'true');
    //this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    //this.signInButton.removeAttribute('hidden');
  }
};

// // Returns true if user is signed-in. Otherwise false and displays a message.
// FriendlyChat.prototype.checkSignedInWithMessage = function() {
//   // Return true if the user is signed in Firebase
//   if (this.auth.currentUser) {
//     return true;
//   }

//   // Display a message to the user using a Toast.
//   var data = {
//     message: 'You must sign-in first',
//     timeout: 2000
//   };
//   this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
//   return false;
// };

// Saves the messaging device token to the datastore.
ShaelynChat.prototype.saveMessagingDeviceToken = function() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.database().ref('/fcmTokens').child(currentToken)
          .set(firebase.auth().currentUser.uid);
    } else {
      // Need to request permissions to show notifications.
      this.requestNotificationsPermissions();
    }
  }.bind(this)).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
};

// Requests permissions to show notifications.
ShaelynChat.prototype.requestNotificationsPermissions = function() {
  console.log('Requesting notifications permission...');
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    this.saveMessagingDeviceToken();
  }.bind(this)).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
};

// // Resets the given MaterialTextField.
ShaelynChat.prototype.resetMaterialTextfield = function(element) {
  element.value = '';
  element.focus();

  $('.chat-fieldset').removeClass('hide');
  $('#js-chat-text-input').addClass('hide');
};

// // Template for messages.
// FriendlyChat.MESSAGE_TEMPLATE =
//     '<div class="message-container">' +
//       '<div class="spacing"><div class="pic"></div></div>' +
//       '<div class="message"></div>' +
//       '<div class="name"></div>' +
//     '</div>';

// A loading image URL.
ShaelynChat.prototype.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// // Displays a Message in the UI.
// FriendlyChat.prototype.displayMessage = function(key, name, text, picUrl, imageUri) {
//   var div = document.getElementById(key);
//   // If an element for that message does not exists yet we create it.
//   if (!div) {
//     var container = document.createElement('div');
//     container.innerHTML = FriendlyChat.MESSAGE_TEMPLATE;
//     div = container.firstChild;
//     div.setAttribute('id', key);
//     this.messageList.appendChild(div);
//   }
//   if (picUrl) {
//     div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
//   }
//   div.querySelector('.name').textContent = name;
//   var messageElement = div.querySelector('.message');
//   if (text) { // If the message is text.
//     messageElement.textContent = text;
//     // Replace all line breaks by <br>.
//     messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
//   } else if (imageUri) { // If the message is an image.
//     var image = document.createElement('img');
//     image.addEventListener('load', function() {
//       this.messageList.scrollTop = this.messageList.scrollHeight;
//     }.bind(this));
//     this.setImageUrl(imageUri, image);
//     messageElement.innerHTML = '';
//     messageElement.appendChild(image);
//   }
//   // Show the card fading-in and scroll to view the new message.
//   setTimeout(function() {div.classList.add('visible')}, 1);
//   this.messageList.scrollTop = this.messageList.scrollHeight;
//   this.messageInput.focus();
// };

// Enables or disables the submit button depending on the values of the input
// fields.
ShaelynChat.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    this.submitButton.setAttribute('disabled', 'true');
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
ShaelynChat.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

window.addEventListener('load' , function() {
  window.ShaelynChat = new ShaelynChat();
});