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
  this.botFirstChatMessage = i18n.firebase.chat.firstmessage.bottext;
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

ShaelynChat.prototype.playSound = function(groupId){
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chatAttendeesRef = ref.child('ChatAttendees').child(groupId).child(userId);
  chatAttendeesRef.once('value', snap => {
    if(snap.val().notification == true) {
      var filename = '/sounds/notify'; 
      document.getElementById("firebase-chat-sounds").innerHTML='<audio autoplay="autoplay"><source src="' + filename + '.mp3" type="audio/mpeg" /><source src="' + filename + '.ogg" type="audio/ogg" /><embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" /></audio>';
    }
  });  
}

//Create Chat Windows for the group or single chat
ShaelynChat.prototype.loadChatWindows = function(groupId, groupsnap, count, totalNum) {
  const chat_meta = document.getElementById('firebase-chat-meta');
  
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
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chatAttendeesRef = ref.child('ChatAttendees').child(groupId);
  //const chatAttendeeRef = chatAttendeesRef.child(userId);
  var setChatGroup = function(data) {
    ref.child('Users').child(data.key).once('value', usersnap => {
      var friend = HTMLcreateListFriend("chat", groupId, usersnap);

      var friends_list = document.getElementById('chatfriends-'+groupId);

      $.fn.updateOrPrependHTML(groupId+"chatfriend-"+usersnap.key, friend, friends_list);     
    });            

    chatAttendeesRef.once('value', snapchat => {
      //Put the HTML in the container
      var group = HTMLcreateGroup(groupsnap.key, groupsnap.val(), count, totalNum, activeGroupId, snapchat.val().notseen);
      $.fn.updateOrPrependHTML("chat-"+groupId, group, this.chat_list_wrapper);
    }).then(userData => {

    });
  }.bind(this);

  //TRIGGERD WHEN CHATATTENDEES --> GROUPID IS TRIGGERED
  var setChatGroupChanged = function(data) {
    var date = new Date($.now());

    document.getElementById('chat-'+groupId).removeAttribute("style");

    document.getElementById('chat-'+groupId).style.order = -date.getTime()/1000|0;
    document.getElementById('chat-'+groupId).setAttribute('data-order', date.getTime()/1000|0);

    if (document.hidden) {
        ShaelynChat.playSound(groupId);
    }

    if(!$('#chat-'+groupId).hasClass('active')) {
      $('#chat-'+groupId).find('.card-indicator-number').text(data.val().notseen);
      $('#chat-'+groupId).find('.chat-number-indicator').addClass('show');

      //Hear the chat sound
      ShaelynChat.playSound(groupId);
    }else {
      ShaelynChat.removeUnSeenMessages(groupId);
    }
  }.bind(this);

  chatAttendeesRef.on('child_added', setChatGroup);
  chatAttendeesRef.on('child_changed', setChatGroupChanged);
};

ShaelynChat.prototype.getChatOptionsTitle = function(chatTitle, image) {
  //$('#js-chat-title').text(chatTitle);
  $('#js-chat-title:before').css('background-image',image);
};  

ShaelynChat.prototype.createChat = function(oldGroupId, newGroupId) {
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
};


// What this does is setting the timestamp or an active string
// When the user leaves a group it is setting a timestamp else the active string
// This TRIGGERING CHILD_CHANGED for CHATATTENDEES loacated in LOADGROUPS function
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

ShaelynChat.prototype.loadChatAttendees = function(groupId, count, totalNum) {
  //Create HTML for the friends list
  var chatfriends_list_wrapper = HTMLcreateFriendsList('chat', groupId, count, totalNum);

  var parent = document.getElementById('firebase-chat-attendees');
  //Put the HTML in the container
  $.fn.updateOrPrependHTML("chatfriends-"+groupId, chatfriends_list_wrapper, parent);
};

// Loads chat messages history and listens for upcoming ones.
ShaelynChat.prototype.loadMessages = function(groupId, groupsnap) {
  // Loads the last 12 messages and listen for new ones.
  this.messagesRef = this.database.ref('ChatMessages').child(groupId);
  var setMessage = function(data) {
    var val = data.val();
    var sender = "";
    var message = "";
    var idObject = document.getElementById('chat-window-'+groupId);
    var parent = document.getElementById(idObject.childNodes[0].id+'_container'); 
 
    if(val.from != "shaelyn") {
      sender = val.from;

      this.database.ref('Users').child(sender).once('value', usersnap => {
        //Put the HTML in the container
        message = HTMLcreateChatMessage(groupId, data.key, sender, data, usersnap);
      }).catch(function(error) {
        console.error('Error getting the user information', error);
      }); 
    }else {
      sender = "Shaelyn Bot";
      message = HTMLcreateChatMessage(groupId, data.key, sender, data, "");
    }


    if (parent == null) {
      parent = this.chat_list_wrapper;
    }

    //Put the HTML in the container
    $.fn.updateOrPrependHTML("chat-message-"+data.key, message, parent);

    setTimeout(function(){
      $("#chat-window-"+groupId).mCustomScrollbar("update");
      $("#chat-window-"+groupId).mCustomScrollbar("scrollTo", "bottom");
    }, 500);

  }.bind(this);

  this.messagesRef.orderByChild('order').limitToFirst(12).on('child_added', setMessage);
  this.messagesRef.orderByChild('order').limitToFirst(12).on('child_changed', setMessage);
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

  this.chatsRef.once('value', snap => {
    $('#firebase-chatgroups').empty();
    //Needed for iteration and setting of the active class
    var count = 1;
    //if($('#firebase-chat-conversations').find('.chat-window.active').length == 0) {
      snap.forEach(function(childSnapshot) {
        //Get the user chatgroup
        let chatGroupRef = chat.child(childSnapshot.key);

        chatGroupRef.once('value', groupsnap => {
          //Create the Chat windows per Group for the messages
          ShaelynChat.loadChatAttendees(groupsnap.key, count, snap.numChildren());

          //Create the GROUPS
          ShaelynChat.loadGroups(groupsnap.key, groupsnap, count, snap.numChildren(), activeGroupId);

          //Create the Chat windows per Group for the messages
          ShaelynChat.loadChatWindows(groupsnap.key, groupsnap, count, snap.numChildren());

          //Create the messages and put them in the corresponding group
          ShaelynChat.loadMessages(groupsnap.key, groupsnap);
        }).then(snaper => {
          //Add one to the counter after all other things are done
          if (snap.numChildren() == count) {
             setTimeout(function(){
              $('#firebase-chat-conversations').addClass('loaded');
            }, 500);
          }

          count++;
        }); 
      });

      this.updateChatGroupOrder();
    //}  
  });
};







ShaelynChat.prototype.updateChatGroupOrder = function(){
  const userId = firebase.auth().currentUser.uid;

  // Reference to the /UserChat/ database path.
  this.chatsRef = this.database.ref('UsersChat').child(userId);

  var setOrder = function(data) {
    var date = new Date(data.val().time);

    $('#chat-'+data.key).attr('data-order', date.getTime()/1000|0);
    document.getElementById('chat-'+data.key).style.order = -date.getTime()/1000|0;
  }.bind(this);

  //this.chatsRef.orderByChild('time').on('child_added', setMessage);
  this.chatsRef.orderByChild('time').on('child_changed', setOrder);
};







ShaelynChat.prototype.seenCheck = function(active_groupId, messageId) {
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chatAttendeesRef = ref.child('ChatAttendees').child(active_groupId);

  // Check if the user is current active in the group if not put the message in the ChatNotSeenMessages
  chatAttendeesRef.once('value', snap => {
    snap.forEach(function(childSnapshot) {
      //Check if the user is not active in the group
      if(childSnapshot.val().time != 'active') {
        const ref = firebase.database().ref();
        const ChatNotSeenMessagesRef = ref.child('ChatNotSeenMessages').child(childSnapshot.key).child(active_groupId);
        const promise = ChatNotSeenMessagesRef.child(messageId).set(true);

        //Add the not viewed item with one for the user in childSnapshot.key
        promise.then(function(ChatNotSeenMessagesRef, postRef) {
          ref.child('ChatNotSeenMessages').child(childSnapshot.key).child(active_groupId).once('value', usersnap => {
            ref.child('ChatAttendees').child(active_groupId).child(childSnapshot.key).update({ 
              notseen: usersnap.numChildren()
            })
          });
        }.bind(this)).catch(function(error) {
          console.error('Error writing new message to Firebase Database', error);
        });
      }
    });
  });
};

// What this does is REMOVING all the MESSAGE ID'S under the USERID in the ChatNotSeenMessage Table and updating the notseen
// property in the CHATATTENDEES table to 0

// This TRIGGERING CHILD_CHANGED for CHATATTENDEES loacated in LOADGROUPS function
ShaelynChat.prototype.removeUnSeenMessages = function(active_groupId) {
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chatNotSeenRef = ref.child('ChatNotSeenMessages');

  const promise = chatNotSeenRef.child(userId).child(active_groupId).remove();

  promise.then(function() {
    //Reset counter in the group of ChatAttendees
    const postRef = firebase.database().ref().child('ChatAttendees').child(active_groupId).child(userId)
    postRef.update({ 
      notseen: 0
    })

    $("#chat-"+active_groupId).find('.chat-number-indicator').removeClass('show');
  }.bind(this)).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
};

//Remove the user from the current chat
ShaelynChat.prototype.removeChat = function(groupId) {
  const userId = firebase.auth().currentUser.uid;
  
  const ref = firebase.database().ref();
  const chatAttendeesRef = ref.child('ChatAttendees').child(groupId).child(userId);
  const chatNotSeenRef = ref.child('ChatNotSeenMessages').child(userId).child(groupId);
  const usersChatRef = ref.child('UsersChat').child(userId).child(groupId);
  const listsRef = ref.child('lists').child(groupId);

  listsRef.once('value').then(function(snapshot) {
    listsRef.update({ 
      chat: true
    })
  }).then(snap => {
    chatAttendeesRef.remove();
    chatNotSeenRef.remove();
    usersChatRef.remove();
  });
};

//Saves a new message on the Firebase DB.
ShaelynChat.prototype.saveMessage = function(e) {
  if(typeof e != "undefined") {
    e.preventDefault();
  }

  let message = "";
  let name = "";
  let sender = "";

  // Check that the user entered a message and is signed in.
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const userRef = ref.child('Users').child(userId);
  const chatAttendeesRef = ref.child('ChatAttendees');

  userRef.once('value', usersnap => {
    if(this.messageInput.value && $.trim(this.messageInput.value) != ''){
      message = this.messageInput.value;
      name = usersnap.val().name;
      sender = usersnap.key;
    }else {
      message = this.botFirstChatMessage;
      name = "Shaelyn Bot";
      sender = "shaelyn";      
    }
  }).then(snap => {
    if (message != '') {
      var active_groupId = $('#firebase-chat-conversations .active').attr('id').replace('chat-window-', '');
      this.messagesRef = this.database.ref('ChatMessages').child(active_groupId);

      let timestamp = firebase.database.ServerValue.TIMESTAMP;
      const promise = this.messagesRef.push({
        from: sender,
        message: message,
        name: name,
        order: timestamp,
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
        this.botFirstChatMessage = "";
      }.bind(this)).catch(function(error) {
        console.error('Error writing new message to Firebase Database', error);
      });
    }  
  });
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

// Sets the URL of the given img element with the URL of the image stored in Firebase Storage.
ShaelynChat.prototype.setImageUrl = function(snap, imageUri, imgElement) {
  // If the image is a Firebase Storage URI we fetch the URL.
  if (imageUri.startsWith('gs://')) {
    imgElement.src = ShaelynChat.LOADING_IMAGE_URL; // Display a loading image first.
    this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
      imgElement.src = metadata.downloadURLs[0];

      if ( $('#chat-message-'+snap.key).length ) {
        $('#chat-message-'+snap.key).find('.chat-image').attr('src',metadata.downloadURLs[0]);
      }  
    });
  } else {
    imgElement.src = imageUri;
  }
};

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
      var filePath = userId + '/' + active_groupId + '/' + data.key + '/' + file.name;
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
         ShaelynChat.playSound(groupId);
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

//TODO: Set device token in the ChatAttendees

// Saves the messaging device token to the datastore.
ShaelynChat.prototype.saveMessagingDeviceToken = function() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      const userId = firebase.auth().currentUser.uid;
      const ref = firebase.database().ref();
      const chatAttendeesRef = ref.child('ChatAttendees');
      const usersChatsRef = ref.child('UsersChat').child(userId);

      usersChatsRef.once('value', userChats => {
        userChats.forEach(function(chats) {
          firebase.database().ref('ChatAttendees').child(chats.key).child(userId).update({
            token: currentToken
          });
        });
      });
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

//Create a new chat based on a list or from scratch
ShaelynChat.prototype.createNewChat = function(listId) {
    const ref = firebase.database().ref();
    const listChatsRef = ref.child('BetaChat');
    const listAttendeesRef = ref.child('listAttendees').child(listId);
    const usersChatRef = ref.child('UsersChat');
    const chatAttendeesRef = ref.child('ChatAttendees');
    const listsRef = ref.child('lists').child(listId);
    const userId = firebase.auth().currentUser.uid;
    let listData = '';
    let inList = false;

  //Check the origion
  if(listId != '') {
    chatAttendeesRef.child(listId).child(userId).once('value', function(snapshot) {
      if (snapshot.exists()) {
        inList = true;
      }
    }).then( checkList => {
      //Get the additional list info
      listsRef.once('value', snap => {
        if(inList != true){
          const postRef = listsRef;
          postRef.update({ 
            chat: true
          })

          // Create the new chat
          let timestamp = firebase.database.ServerValue.TIMESTAMP;
          const promiseChat = listChatsRef.child(listId).update({
            chatOwner: firebase.auth().currentUser.uid,
            groupImage: "",
            name: snap.val().name,
            order: timestamp,
            time: firebase.database.ServerValue.TIMESTAMP,
            type: 'list',
            userCount: snap.val().userCount
          })
          const chatKey = listId

          promiseChat.then(function() {
            const postRef = listChatsRef.child(chatKey)
            postRef.once('value').then(function(snapshot) {
              timestamp = snapshot.val().order * -1
              postRef.update({ 
                order: timestamp
              })

              //REMOVE the active class on the child elements becouse we need the new item to be active  
              $("#firebase-chatgroups").find('.active').removeClass('active');
              $("#firebase-chat-meta").find('.active').removeClass('active');
              $('#firebase-chat-conversations').find('.chat-window').removeClass("active");
              $('#firebase-chat-attendees').find('.detail-members').removeClass("active");

              usersChatRef.child(userId).once('value', usersChatSnapRef => {
              }).then(UserChatRef => {
                //Create the Chat windows per Group for the messages
                ShaelynChat.loadChatAttendees(chatKey, snap.numChildren(), snap.numChildren());

                //SET THE HTML OF THE GROUP ITEM HERE
                var group = HTMLcreateGroup(chatKey, snapshot.val(), snap.numChildren(), snap.numChildren()-1, chatKey, 0);
                $.fn.updateOrPrependHTML("chat-"+chatKey, group, ShaelynChat.chat_list_wrapper);

                //CREATE THE CHAT TITLE AND WINDOW
                ShaelynChat.loadChatWindows(chatKey, snapshot,  snap.numChildren(), snap.numChildren());
              }).then(listDataSnap => {
                //CREATE USER CHATS
                listAttendeesRef.once('value', snap => {
                  // ShaelynChat.loadGroups(chatKey, snapshot, count+1, count+1, chatKey);

                  //Loop through all the list attendees
                  snap.forEach(function(childSnapshot) {

                    //Set the LIST ATTENDEE ID (userid) in the CHATATTENDEES table
                    chatAttendeesRef.child(chatKey).child(childSnapshot.key).set({
                      token: '',
                      notification: true,
                      notseen: 0,
                      time: firebase.database.ServerValue.TIMESTAMP
                    });

                    //Put the LIST ATTENDEE data also in the USERSCHAT table
                    //THIS TRIGGERING A EVENT (updateChatGroupOrder)!
                    const postRef = usersChatRef.child(childSnapshot.key).child(chatKey);
                    postRef.set({
                      seen: false,
                      time: firebase.database.ServerValue.TIMESTAMP
                    });

                    ref.child('Users').child(childSnapshot.key).once('value', usersnap => {
                      var friend = HTMLcreateListFriend("chat", chatKey, usersnap);
                      var friends_list = document.getElementById('chatfriends-'+chatKey);
                      $.fn.updateOrPrependHTML(chatKey+"chatfriend-"+childSnapshot.key, friend, friends_list);   
                    });
                  });  
                }).then(firsChatSnap =>{
                  //Create the messages and put them in the corresponding group
                  ShaelynChat.loadMessages(chatKey, "");
                  //Save the message
                  ShaelynChat.saveMessage();
                });
              });
            }); 
          }); 
        }else {
          //REMOVE the active class on the child elements becouse we need the new item to be active  
          $("#firebase-chatgroups").find('.active').removeClass('active');
          $("#firebase-chat-meta").find('.active').removeClass('active');
          $('#firebase-chat-conversations').find('.chat-window').removeClass("active");
          $('#firebase-chat-attendees').find('.detail-members').removeClass("active");

          $('#chat-'+listId).addClass('active');
          $('#chat-meta-'+listId).addClass('active');
          $('#chatfriends-'+listId).addClass('active');
          $('#chat-window-'+listId).addClass('active');

          setTimeout(function(){
            $("#chat-window-"+listId).mCustomScrollbar("update");
            $("#chat-window-"+listId).mCustomScrollbar("scrollTo", "bottom");
          }, 500);
        }
      });
    });
  }; 
}; 

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

ShaelynChat.prototype.openChatOptionsDialog = function(type, groupId) {
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chatAttendeesRef = ref.child('ChatAttendees').child(groupId);
  const dialog_wrapper = document.getElementById('dialog-chat-wrapper');

  chatAttendeesRef.child(userId).once('value', snap => {
    var chat_dialog_content = HTMLcreateChatDialog(type, snap);
    $.fn.updateOrPrependHTML("chat-settings-"+snap.key, chat_dialog_content, dialog_wrapper);
  });

  chatAttendeesRef.child(userId).on('value', snap => {
    if(document.getElementById('firebase-setting-notifications-chat')) {
      document.getElementById('firebase-setting-notifications-chat').checked = snap.val().notification;
    }
  });
};

ShaelynChat.prototype.updateChatSetting = function(type, value) {
  var groupId = $('#firebase-chatgroups').find('.active').attr('id').replace('chat-', '');
  
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chatAttendeesRef = ref.child('ChatAttendees').child(groupId).child(userId);
  
  chatAttendeesRef.once('value').then(function(snapshot) {
    if(type = 'notification') {
      chatAttendeesRef.update({ 
        notification: value
      });
    }
  });
};

window.addEventListener('load' , function() {
  window.ShaelynChat = new ShaelynChat();
});