'use strict';

// Initializes FriendlyChat.
function ShaelynChat() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.chat_list_wrapper = document.getElementById('firebase-chatgroups');
  this.chat_window_wrapper = document.getElementById('firebase-chat-conversations');
  this.messageForm = document.getElementById('chat-form');
  this.messageInput = document.getElementById('firebase-message-input');
  this.messageInputEmoticions = document.getElementById('firebase-message-input-emoticons');
  this.botFirstChatMessage = i18n.firebase.chat.firstmessage.bottext;
  this.submitButton = document.getElementById('firebase-send-chat-message');
  this.submitImageButton = document.getElementById('firebase-submitImage');
  this.imageForm = document.getElementById('chat-form');
  this.mediaCapture = document.getElementById('firebase-mediaCapture');
  this.userPic = document.getElementById('user-pic');
  this.firstmessage = false;

  this.chatKey = '';

  // Saves message on form submit.
  this.messageForm.addEventListener('submit', this.saveMessage.bind(this));

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
ShaelynChat.prototype.loadChatWindows = function(groupId, groupsnap, count, totalNum, activeGroupId) {
  const chat_meta = document.getElementById('firebase-chat-meta');
  
  var parent = this.chat_window_wrapper;
  var meta = HTMLcreateChatMeta(groupsnap.key, groupsnap, count, totalNum, activeGroupId);
  var initCheck = true;
  $.fn.updateOrPrependHTML("chat-meta-"+groupId, meta, chat_meta);

  if(document.getElementById("chat-window-"+groupId) != null) {
    parent = document.getElementById("chat-window-"+groupId).childNodes[0].id+'_container';

    initCheck = false;
  }else {
    //Put the list items in the list
    //Create the CHAT WINDOWS per GROUP
    var chat_window = HTMLcreateChatWindow(groupsnap.key, groupsnap, count, totalNum, activeGroupId);
    $.fn.updateOrPrependHTML("chat-window-"+groupId, chat_window, parent);
  }

  //Check the window width
  if ($(window).width()>768 && initCheck == true) {
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

//Creates the chat overview with all the user groups or individual chats
ShaelynChat.prototype.loadGroups = function(groupId, groupsnap, count, totalNum, activeGroupId) {
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chatAttendeesRef = ref.child('ChatAttendees').child(groupId);
  const userChatActive = ref.child('ChatActive').child(groupId);
  const ChatNotSeenMessages =  ref.child('ChatNotSeenMessages').child(userId).child(groupId);

  //If the Group is the only one there is, remove the ChatNotSeen and this group always active
  if(totalNum == 1) {
    ShaelynChat.chatActive(groupId, groupId);
    ChatNotSeenMessages.remove();
  }

  if(count === totalNum && $("#firebase-chatgroups").find(".active").length <= 0) {
    ShaelynChat.chatActive(groupId, groupId);
    ChatNotSeenMessages.remove();
  }

  //const chatAttendeeRef = chatAttendeesRef.child(userId);
  var setChatGroup = function(data) {
    userChatActive.child(userId).once('value', userActiveSnap => {
    }).then(snaper => {
      chatAttendeesRef.child(data.key).once('value', snapchat => {

      }).then(counter => {
      var notseen = "";

        //Put the HTML in the container
        ChatNotSeenMessages.once('value', ChatNotSeenMessageSnap => { 
          if(ChatNotSeenMessageSnap.val() != null) {
            notseen = ChatNotSeenMessageSnap.numChildren();
          }else {
            notseen = 0;
          }

          var group = HTMLcreateGroup(groupsnap.key, groupsnap.val(), count, totalNum, activeGroupId, notseen, groupId);
          $.fn.updateOrPrependHTML("chat-"+groupId, group, this.chat_list_wrapper);
        });

      });
    });
  }.bind(this);

  //TRIGGERD WHEN CHATATTENDEES --> GROUPID IS TRIGGERED
  var setChatGroupChanged = function(data) {
    var date = new Date($.now());
    if($('#chat-'+groupId).length) {
      document.getElementById('chat-'+groupId).removeAttribute("style");

      document.getElementById('chat-'+groupId).style.order = -date.getTime()/1000|0;
      document.getElementById('chat-'+groupId).setAttribute('data-order', date.getTime()/1000|0);

      if (!$('#chat-'+groupId).hasClass('active') || document.hidden) {
          ShaelynChat.playSound(groupId);
      }
      if(!$('#chat-'+groupId).hasClass('active')) {
        $('#chat-'+groupId).find('.card-indicator-number').text(data.val().notseen);
        $('#chat-'+groupId).find('.chat-number-indicator').addClass('show');
      }
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

ShaelynChat.prototype.loadChatAttendees = function(groupId, count, totalNum, activeGroupId) {
  const ref = firebase.database().ref();
  const chatAttendeesRef = ref.child('ChatAttendees').child(groupId);

  var chatfriends_list_wrapper = HTMLcreateFriendsList('chat', groupId, count, totalNum, activeGroupId);
  var parent = document.getElementById('firebase-chat-attendees');
  //Put the HTML in the container
  $.fn.updateOrPrependHTML("chatfriends-"+groupId, chatfriends_list_wrapper, parent);
  
  chatAttendeesRef.once('value', snap => {
    snap.forEach(function(chatattendee) {
      ref.child('Users').child(chatattendee.key).on('value', usersnap => {
        var friend = HTMLcreateListFriend("chat", groupId, usersnap);
        var friends_list = document.getElementById('chatfriends-'+groupId);
        $.fn.updateOrPrependHTML(groupId+"chatfriend-"+usersnap.key, friend, friends_list);
      });
    });
  });
};

//Add chat user to temporary selected friendslist
ShaelynChat.prototype.addSelectedFriend = function(friendId) {
  const ref = firebase.database().ref();

  ref.child('Users').child(friendId).once('value', usersnap => {
    var friend = HTMLcreateListFriend("selectedchat", "", usersnap);
    var parent = document.getElementById('firebase-selected-friends');

    $.fn.updateOrPrependHTML("selectedchatfriend-"+usersnap.key, friend, parent);   
  });
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
    var parent = null;

    if(typeof idObject.childNodes[0] != 'undefined'){
      parent = document.getElementById(idObject.childNodes[0].id+'_container'); 
    }

    if(val.from != "shaelyn") {
      sender = val.from;

      this.database.ref('Users').child(sender).on('value', usersnap => {
        //Put the HTML in the container
        message = HTMLcreateChatMessage(groupId, data.key, sender, data, usersnap);
      }); 
    }else {
      sender = "Shaelyn Bot";
      message = HTMLcreateChatMessage(groupId, data.key, sender, data, "");
    }


    if (parent == null) {
      parent = document.getElementById('chat-window-'+groupId);
    }

    //Put the HTML in the container
    $.fn.updateOrPrependHTML("chat-message-"+data.key, message, parent);

    setTimeout(function(){
      //$("#chat-window-"+groupId).mCustomScrollbar("update");
      $("#chat-window-"+groupId).mCustomScrollbar("scrollTo", "bottom",{scrollInertia:0});
    }, 0);

  }.bind(this);

  this.messagesRef.orderByChild('order').limitToFirst(12).on('child_added', setMessage);
  this.messagesRef.orderByChild('order').limitToFirst(12).on('child_changed', setMessage);
};

ShaelynChat.prototype.NoChatHandler = function() {
    const chat_meta = document.getElementById('firebase-chat-meta');
    const chat_text = document.getElementById("firebase-chat-conversations");
    
    ShaelynChat.chatKey = "";
    
    $("#firebase-chat-meta .title-wrapper").remove();
    $("#firebase-chat-conversations .chat-window").remove();
    $("#firebase-chat-attendees .detail-members").remove();
    $("#firebase-chatgroups .chat").remove();

    var noChat = HTMLcreateNoChat();
    $.fn.updateOrPrependHTML("chat-nochat", noChat, chat_text);
    
    var meta = HTMLcreateChatMetaEmpty();
    $.fn.updateOrPrependHTML("chat-meta-empty", meta, chat_meta);

    $(".chat-message-wrapper").hide();
    $(".chat-controls").hide();
};

ShaelynChat.prototype.init = function() {
  //Get the current user ID
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chat = ref.child('BetaChat');
  const chatAttendeesRef = ref.child('ChatAttendees');
  const userChatActive = ref.child('ChatActive');

  let activeGroupId = "";

  // Reference to the /UserChat/ database path.
  this.chatsRef = this.database.ref('UsersChat').child(userId).orderByChild('time');
  // Make sure we remove all previous listeners.
  this.chatsRef.off();

  //REMOVE the active class on the child elements becouse we need the new item to be active  
  $("#firebase-chatgroups").find('.active').removeClass('active');
  $('#firebase-chat-conversations').find('.chat-window').removeClass("active");
  $('#firebase-chat-attendees').find('.detail-members').removeClass("active");

  //GET ALL THE USERCHATS (UsersChat)
  this.chatsRef.on('value', snap => {
    if (!snap.exists()) {
      ShaelynChat.NoChatHandler();
    }else {
      if($("#chat-nochat").length) {
        $("#chat-nochat").remove();
        $("#chat-meta-empty").remove();
        $(".chat-message-wrapper").show();
        $(".chat-controls").show();
      }

      //Needed for iteration and setting of the active class
      var count = 1;
      //LOOP THROUGH ALL THE CHATS OF THE USER
      snap.forEach(function(childSnapshot) {

        //Get the user chatgroup (BETACHAT)
        let chatGroupRef = chat.child(childSnapshot.key);

        userChatActive.child(childSnapshot.key).child(userId).once('value', userActiveSnap => {
            if(userActiveSnap && userActiveSnap.val() != null) {
              activeGroupId = childSnapshot.key;
            }

        }).then( snapPromise => {
          chatGroupRef.once('value', groupsnap => {
            const ChatNotSeenMessages =  ref.child('ChatNotSeenMessages').child(userId).child(groupsnap.key);

            if(count === snap.numChildren() && $("#firebase-chatgroups").find(".active").length <= 0) {
              activeGroupId = groupsnap.key;
            }

            if(activeGroupId && activeGroupId != "") {
              ShaelynChat.chatActive(activeGroupId, activeGroupId);
              ref.child('ChatNotSeenMessages').child(userId).child(activeGroupId).remove();
            }

            //Create the GROUPS
            ShaelynChat.loadGroups(groupsnap.key, groupsnap, count, snap.numChildren(), activeGroupId);
           
            //Create the Chat windows per Group for the messages
            ShaelynChat.loadChatAttendees(groupsnap.key, count, snap.numChildren(), activeGroupId);

            //Create the Chat windows per Group for the messages
            ShaelynChat.loadChatWindows(groupsnap.key, groupsnap, count, snap.numChildren(), activeGroupId);

            //Create the messages and put them in the corresponding group
            ShaelynChat.loadMessages(groupsnap.key, groupsnap, count, snap.numChildren(), activeGroupId);
          }).then(snaper => {
            //Add one to the counter after all other things are done
            if (snap.numChildren() == count) {
               setTimeout(function(){
                $('#firebase-chat-conversations').addClass('loaded');
              }, 500);
            }
            count++;
          }); 
        })
      });
      this.updateChatGroupOrder(); 
    }
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
  };
};

ShaelynChat.prototype.updateUsersChatTime = function(groupId) {
    const userId = firebase.auth().currentUser.uid;
    const postRef = firebase.database().ref().child('ChatAttendees').child(groupId).child(userId)
    postRef.update({ 
      time: firebase.database.ServerValue.TIMESTAMP
    })
};  

ShaelynChat.prototype.seenCheck = function(active_groupId, messageId) {
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const chatAttendeesRef = ref.child('ChatAttendees').child(active_groupId);
  const userChatRef = ref.child('UsersChat').child(userId);
  const userChatActive = ref.child('ChatActive').child(active_groupId);
  const listChatsRef = ref.child('BetaChat');

  chatAttendeesRef.once('value', snap => {
    snap.forEach(function(userInGroupSnap) {
      userChatActive.child(userInGroupSnap.key).once('value', userActiveSnap => {
        if(userActiveSnap.val() != null) {
          ref.child('ChatNotSeenMessages').child(userInGroupSnap.key).child(active_groupId).remove();
        }else {
          ref.child('ChatNotSeenMessages').child(userInGroupSnap.key).child(active_groupId).child(messageId).set(true);
        }
      }).then(snapPromise => {
        ref.child('ChatNotSeenMessages').child(userInGroupSnap.key).child(active_groupId).once('value', ChatNotSeenMessagesSnap => {
            ref.child('ChatAttendees').child(active_groupId).child(userInGroupSnap.key).update({
              notseen: ChatNotSeenMessagesSnap.numChildren(),
              time: firebase.database.ServerValue.TIMESTAMP
            });
        });
      });
    });
  });
};

ShaelynChat.prototype.chatActive = function(oldGroup, newGroup) {
  const userId = firebase.auth().currentUser.uid;
  const ref = firebase.database().ref();
  const userChatActiveOld = ref.child('ChatActive').child(oldGroup);
  const userChatActiveNew = ref.child('ChatActive').child(newGroup);

  if(oldGroup != newGroup) {
    userChatActiveOld.child(userId).remove();
    userChatActiveNew.child(userId).set(true);
  }
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
  $.fn.emoticonsvisible = false;
  $(".emoji-menu").hide();
  
  if(typeof e != "undefined") {
    e.preventDefault();
  }else {
    $(this.messageInputEmoticions).blur();
    $(this.messageInputEmoticions).focus();
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
    if($(this.messageInputEmoticions).html() != '' && this.messageInput.value && $.trim(this.messageInput.value) != ''){
      var text = this.messageInput.value.replace(/<\/?[^>]+(>|$)/g, "");

      message = text;
      name = usersnap.val().name;
      sender = usersnap.key;
    }else if(ShaelynChat.firstmessage == true) {
      message = this.botFirstChatMessage;
      name = "Shaelyn Bot";
      sender = "shaelyn";      
    }else {
      return false;
    }
  }).then(snap => {
    if (message != '') {
      if(ShaelynChat.chatKey != "") {
        var active_groupId = ShaelynChat.chatKey;
      }else {
        var active_groupId = $('#firebase-chat-conversations .active').attr('id').replace('chat-window-', '');
      }
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

        // Clear message text field and SEND button state.
        ShaelynChat.resetMaterialTextfield(this.messageInput);
        this.toggleButton();
        ShaelynChat.chatKey = "";
        ShaelynChat.firstmessage = false;
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
      imageUrl: "/img/loading.gif",
      imageLocation: "",
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
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  });
};

// // Triggers when the auth state change for instance when the user signs-in or signs-out.
ShaelynChat.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    var profilePicUrl = user.photoURL;
    var userName = user.displayName;

    // We load currently existing chat messages.
    this.init();

    // We save the Firebase Messaging Device token and enable notifications.
    this.saveMessagingDeviceToken();
  }
};

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
  $("#firebase-message-input-emoticons").empty();
  element.focus();

  $('.chat-fieldset').removeClass('hide');
  $('#js-chat-text-input').addClass('hide');
};

// A loading image URL.
ShaelynChat.prototype.LOADING_IMAGE_URL = '/img/loading.gif';

//Create a new chat based on a list or from scratch
ShaelynChat.prototype.createNewChat = function(listId, users, name) {
    const ref = firebase.database().ref();
    const listChatsRef = ref.child('BetaChat');
    const usersChatRef = ref.child('UsersChat');
    const usersRef = ref.child('Users');
    const chatAttendeesRef = ref.child('ChatAttendees');
    const userId = firebase.auth().currentUser.uid;
    let listData = '';
    let inList = false;

  //Check the origion
  if(listId && listId != '') {
    const listAttendeesRef = ref.child('listAttendees').child(listId);
    const listsRef = ref.child('lists').child(listId);


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
              listAttendeesRef.once('value', snap => {
                //Loop through all the list attendees
                snap.forEach(function(user) {

                  //Set the LIST ATTENDEE ID (userid) in the CHATATTENDEES table
                  chatAttendeesRef.child(chatKey).child(user.key).update({
                    token: '',
                    notification: true,
                    notseen: 0,
                    time: firebase.database.ServerValue.TIMESTAMP
                  });

                  usersRef.child(user.key).once('value', userRef => {
                    chatAttendeesRef.child(chatKey).child(user.key).update({
                      token: userRef.val().device_token
                    });
                  }).then(listDataSnap => {
                    usersChatRef.child(user.key).child(chatKey).update({
                      seen: false,
                      time: firebase.database.ServerValue.TIMESTAMP
                    });
                  });
                }); 

                //Save the message
                ShaelynChat.firstmessage = true;
                ShaelynChat.chatKey = chatKey;
                ShaelynChat.saveMessage();
              });
            }); 
          }); 
        }else {
          //TRIGGER a click on the list
          $("#chat-"+listId+".js-switch-chat").trigger( "click" );

          setTimeout(function(){
            $("#chat-window-"+listId).mCustomScrollbar("scrollTo", "bottom",{scrollInertia:0});
          }, 0);
        }
      });
    });
  }else {

    //Add the user own id to the users array
    users.push(userId);

    //Get the number of Users that are invited
    var userNum = users.length;

    // Set the type of the chat
    var type = "single";
    if(userNum > 1) {
      type = "group";
    }
    //Create a new DB item
    let timestamp = firebase.database.ServerValue.TIMESTAMP;
    const promise = listChatsRef.push({
      chatOwner: userId,
      groupImage: "",
      name: name,
      order: timestamp,
      time: firebase.database.ServerValue.TIMESTAMP,
      type: type,
      userCount: userNum //Including yourself
    })
    const chatKey = promise.key

    promise.then(function() {
      const postRef = listChatsRef.child(chatKey)
      postRef.once('value').then(function(snapshot) {
        timestamp = snapshot.val().order * -1
        postRef.update({ 
          order: timestamp
        });

        users.forEach(function(user) {
          chatAttendeesRef.child(chatKey).child(user).update({
            token: '',
            notification: true,
            notseen: 0,
            time: firebase.database.ServerValue.TIMESTAMP
          });

          usersRef.child(user).once('value', userRef => {
            chatAttendeesRef.child(chatKey).child(user).update({
              token: userRef.val().device_token
            });
          }).then(listDataSnap => {
            usersChatRef.child(user).child(chatKey).update({
              seen: false,
              time: firebase.database.ServerValue.TIMESTAMP
            });
          });
        });

        //Save the message
        ShaelynChat.firstmessage = true;
        ShaelynChat.chatKey = chatKey;
        ShaelynChat.saveMessage();
      });  
    }.bind(this)).catch(function(error) {
      console.error('Error writing new message to Firebase Database', error);
    });
  }
};

// Enables or disables the submit button depending on the values of the input
// fields.
ShaelynChat.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitButton.removeAttribute('disabled');
  } else {
    //this.submitButton.setAttribute('disabled', 'true');
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