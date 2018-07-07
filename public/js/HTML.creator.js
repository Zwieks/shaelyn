function HTMLcreateUserProfile(snap) {
	var HTML_user_image_wrapper = document.createElement("figure");
		HTML_user_image_wrapper.setAttribute("id", "firebase-image-wrapper");

	if(snap.val().image != 'default') {
		var HTML_user_image = document.createElement("img");
			HTML_user_image.className = "avatar";
			HTML_user_image.setAttribute("src", snap.val().thumb_image);
			HTML_user_image.setAttribute("title", snap.val().name);
			HTML_user_image.setAttribute("alt", "member");
			HTML_user_image.setAttribute("id", "firebase-image");
	}else if(snap.val().name == ''){
		var HTML_user_image = document.createElement("img");
			HTML_user_image.className = "avatar";
			HTML_user_image.setAttribute("src", "/img/sad.svg");
			HTML_user_image.setAttribute("title", snap.val().name);
			HTML_user_image.setAttribute("alt", "member");
			HTML_user_image.setAttribute("id", "firebase-image");		
	}else{
		var HTML_user_image = document.createElement("div");
			HTML_user_image.className = "avatar";
			HTML_user_image.setAttribute("title", snap.val().name);
			HTML_user_image.setAttribute("init", getInitials(snap.val().name));
			HTML_user_image.setAttribute("id", "firebase-image");
			HTML_user_image.style.background = snap.val().color;
			HTML_user_image.style.color = invertColor(snap.val().color);
	}

	HTML_user_image_wrapper.appendChild(HTML_user_image);
	return HTML_user_image_wrapper;
}

function HTMLcreateChatMeta(snap, count, totalNum) {
	var HTML_chat_title_wrapper = document.createElement("div");
		HTML_chat_title_wrapper.setAttribute("id", "chat-meta-"+snap.key);
		
		if(count != totalNum) {
			HTML_chat_title_wrapper.className = "title-wrapper";
		}else {
			HTML_chat_title_wrapper.className = "title-wrapper active";
		}

	var HTML_chat_title = document.createElement("h3");
		HTML_chat_title.className = "item-title";
		HTML_chat_title.appendChild(document.createTextNode(snap.val().name));

		HTML_chat_title_wrapper.appendChild(HTML_chat_title);

		return HTML_chat_title_wrapper;
}

function HTMLcreateChatWindow(snap, count, totalNum) {
	var HTML_chat_window = document.createElement("div");
		HTML_chat_window.setAttribute("id", "chat-window-"+snap.key);
		if(count != totalNum) {
			HTML_chat_window.className = "chat-window";
		}else {
			HTML_chat_window.className = "chat-window active";
		}

	return HTML_chat_window;
}

function HTMLcreateChatMessage(groupId, listId, userid, snap, userData) {
	var HTML_chat_message_wrapper = document.createElement("div");
		HTML_chat_message_wrapper.setAttribute("id", "chat-message-"+snap.key);
		HTML_chat_message_wrapper.setAttribute("data-group", listId);

		if(userid != firebase.auth().currentUser.uid) {
			HTML_chat_message_wrapper.className = "chat-message";

			if(snap.val().type == 'image') {
				HTML_chat_message_wrapper.className = "chat-message image";
			}
		}else {
			HTML_chat_message_wrapper.className = "chat-message user";

			if(snap.val().type == 'image') {
				HTML_chat_message_wrapper.className = "chat-message user image";
			}
		}

	var HTML_chat_message_userinfo = document.createElement("span");
		HTML_chat_message_userinfo.className = "chat-message-userinfo";
		HTML_chat_message_userinfo.style.color = userData.val().color;
		HTML_chat_message_userinfo.appendChild(document.createTextNode(userData.val().name));

	var HTML_chat_window = document.createElement("div");
		HTML_chat_window.className = "message-wrapper";	

	var HTML_chat_meta = document.createElement("div");
		HTML_chat_meta.className = "message-meta";

	if(snap.val().type != 'image') {
		var HTML_chat_text = document.createElement("p");
			HTML_chat_text.className = "message-text";
			HTML_chat_text.appendChild(document.createTextNode(snap.val().message));

		HTML_chat_window.appendChild(HTML_chat_message_userinfo);
		HTML_chat_window.appendChild(HTML_chat_text);

	}else {
		var HTML_chat_image_wrapper = document.createElement("figure");
			HTML_chat_image_wrapper.className = "message-image";

	    var HTML_chat_image = document.createElement('img');
		    HTML_chat_image.addEventListener('load', function() {
			    $("#chat-window-"+groupId).mCustomScrollbar("update");
			    $("#chat-window-"+groupId).mCustomScrollbar("scrollTo", "bottom");
		    }.bind(this));
			HTML_chat_image.className = "chat-image";
			HTML_chat_image.setAttribute("title", "");
			HTML_chat_image.setAttribute("alt", "");

	    ShaelynChat.setImageUrl(snap, snap.val().imageLocation, HTML_chat_image);
		HTML_chat_image_wrapper.appendChild(HTML_chat_image);
		HTML_chat_window.appendChild(HTML_chat_message_userinfo);	
		HTML_chat_window.appendChild(HTML_chat_image_wrapper);
	}

	HTML_chat_window.appendChild(HTML_chat_meta);

	HTML_chat_message_wrapper.appendChild(HTML_chat_window);

	return HTML_chat_message_wrapper;
}

function HTMLcreateGroup(key, snap, count, totalNum, activeGroupId, NotSeen) {
	var HTML_chat_group_overview_wrapper = document.createElement("div");
		if(activeGroupId == false) {
			if(count != totalNum) {
				HTML_chat_group_overview_wrapper.className = "card-wrapper chat js-switch-chat";
			}else {
				HTML_chat_group_overview_wrapper.className = "card-wrapper chat js-switch-chat active";
			}
		}else {
			if(activeGroupId == key) {
				HTML_chat_group_overview_wrapper.className = "card-wrapper chat js-switch-chat active";
			}else {
				HTML_chat_group_overview_wrapper.className = "card-wrapper chat js-switch-chat";
			}	
		}
		
		HTML_chat_group_overview_wrapper.setAttribute("id", "chat-"+key);

	var HTML_chat_group_overview_inner  = document.createElement("div");
		HTML_chat_group_overview_inner.className = "card";
	

	var HTML_chat_group_image_wrapper = document.createElement("figure");
		HTML_chat_group_image_wrapper.className = "card-image-wrapper";

	var HTML_chat_group_image = document.createElement("img");
		HTML_chat_group_image.className = "avatar";
		HTML_chat_group_image.setAttribute("title", snap.name);
		HTML_chat_group_image.setAttribute("alt", "chat group");

		if(snap.groupImage != '') {
			HTML_chat_group_image.setAttribute("src", snap.groupImage);
		}else{
			HTML_chat_group_image.setAttribute("src", "/img/chat.svg");
		}

	var HTML_chat_group_overview_content_wrapper = document.createElement("div");
		HTML_chat_group_overview_content_wrapper.className = "card-content-wrapper";	

	var HTML_chat_group_overview_title = document.createElement("span");
		HTML_chat_group_overview_title.className = "card-title";
		HTML_chat_group_overview_title.appendChild(document.createTextNode(snap.name));	

	var HTML_chat_group_overview_description = document.createElement("span");
		HTML_chat_group_overview_description.className = "card-description";
		HTML_chat_group_overview_description.appendChild(document.createTextNode(snap.description));	

	var HTML_chat_group_overview_indicator = document.createElement("div");
		HTML_chat_group_overview_indicator.className = "card-indicator";

	var HTML_chat_group_overview_indicator_number = document.createElement("span");
		HTML_chat_group_overview_indicator_number.className = "card-indicator-number";

		if(NotSeen > 0) {
			HTML_chat_group_overview_indicator.className = "card-indicator show";
			HTML_chat_group_overview_indicator_number.appendChild(document.createTextNode(NotSeen));
		}	

	HTML_chat_group_image_wrapper.appendChild(HTML_chat_group_image);

	HTML_chat_group_overview_indicator.appendChild(HTML_chat_group_overview_indicator_number);

	HTML_chat_group_overview_content_wrapper.appendChild(HTML_chat_group_overview_title);
	HTML_chat_group_overview_content_wrapper.appendChild(HTML_chat_group_overview_description);

	HTML_chat_group_overview_inner.appendChild(HTML_chat_group_image_wrapper);
	HTML_chat_group_overview_inner.appendChild(HTML_chat_group_overview_content_wrapper);
	HTML_chat_group_overview_inner.appendChild(HTML_chat_group_overview_indicator);

	HTML_chat_group_overview_wrapper.appendChild(HTML_chat_group_overview_inner);

	return HTML_chat_group_overview_wrapper;
}

function HTMLcreateFriend(snap) {
	var HTML_friends_overview_wrapper = document.createElement("div");
		HTML_friends_overview_wrapper.className = "card-wrapper";
		HTML_friends_overview_wrapper.setAttribute("id", "userfriend-"+snap.key);

	var HTML_friends_overview_inner  = document.createElement("div");

		if(snap.val().online != true) {
			HTML_friends_overview_inner.className = "card";
		}else {
			HTML_friends_overview_inner.className = "card online";
		}

	var HTML_friends_image_wrapper = document.createElement("figure");
		HTML_friends_image_wrapper.className = "card-image-wrapper";

		if(snap.val().image != 'default') {
			var HTML_friends_image = document.createElement("img");
				HTML_friends_image.className = "avatar";
				HTML_friends_image.setAttribute("src", snap.val().thumb_image);
				HTML_friends_image.setAttribute("title", snap.val().name);
				HTML_friends_image.setAttribute("alt", "member");
		}else{
			var HTML_friends_image = document.createElement("div");
				HTML_friends_image.className = "avatar";
				HTML_friends_image.setAttribute("title", snap.val().name);
				HTML_friends_image.setAttribute("init", getInitials(snap.val().name));
				HTML_friends_image.style.background = snap.val().color;
				HTML_friends_image.style.color = invertColor(snap.val().color);
		}

	var HTML_friends_arc = document.createElement("div");
		HTML_friends_arc.className = "arc";	

	var HTML_friends_overview_content_wrapper = document.createElement("div");
		HTML_friends_overview_content_wrapper.className = "card-content-wrapper";	

	var HTML_friends_overview_title = document.createElement("span");
		HTML_friends_overview_title.className = "card-title";
		HTML_friends_overview_title.appendChild(document.createTextNode(snap.val().name));	

	var HTML_friends_overview_description = document.createElement("span");
		HTML_friends_overview_description.className = "card-description";
		HTML_friends_overview_description.appendChild(document.createTextNode(snap.val().description));	

	var HTML_friends_overview_indicator = document.createElement("div");
		HTML_friends_overview_indicator.className = "card-indicator";	

	var HTML_friends_overview_indicator_online = document.createElement("div");
		HTML_friends_overview_indicator_online.className = "online-indicator";	

	HTML_friends_image_wrapper.appendChild(HTML_friends_image);
	HTML_friends_image_wrapper.appendChild(HTML_friends_arc);	

	HTML_friends_overview_content_wrapper.appendChild(HTML_friends_overview_title);
	HTML_friends_overview_content_wrapper.appendChild(HTML_friends_overview_description);

	HTML_friends_overview_indicator.appendChild(HTML_friends_overview_indicator_online);

	HTML_friends_overview_inner.appendChild(HTML_friends_image_wrapper);
	HTML_friends_overview_inner.appendChild(HTML_friends_overview_content_wrapper);
	HTML_friends_overview_inner.appendChild(HTML_friends_overview_indicator);

	HTML_friends_overview_wrapper.appendChild(HTML_friends_overview_inner);

	return HTML_friends_overview_wrapper;
}

function HTMLcreateListOverviewControls() {
	var HTML_list_button_wrapper = document.createElement("ul");
		HTML_list_button_wrapper.className = "btn-group-list";

	var HTML_list_button_item_delete_list = document.createElement("li");
		HTML_list_button_item_delete_list.className = "icon remove";
		HTML_list_button_item_delete_list.setAttribute("id", "js-remove-list");

	var HTML_list_button_item_delete_list_image = document.createElement("img");
		HTML_list_button_item_delete_list_image.className = "js-";
		HTML_list_button_item_delete_list_image.setAttribute("src", "/img/delete.svg");
		HTML_list_button_item_delete_list_image.setAttribute("alt", "Delete list");

	var HTML_list_button_item_add_list = document.createElement("li");
		HTML_list_button_item_add_list.className = "icon add";
		HTML_list_button_item_add_list.setAttribute("id", "js-add-list");

	var HTML_list_button_item_add_list_image = document.createElement("img");
		HTML_list_button_item_add_list_image.className = "js-";
		HTML_list_button_item_add_list_image.setAttribute("src", "/img/plus.svg");
		HTML_list_button_item_add_list_image.setAttribute("alt", "Add list");

	var HTML_list_button_item_paste_list = document.createElement("li");
		HTML_list_button_item_paste_list.className = "icon paste";
		HTML_list_button_item_paste_list.setAttribute("id", "js-paste-list");

	var HTML_list_button_item_paste_list_image = document.createElement("img");
		HTML_list_button_item_paste_list_image.className = "js-";
		HTML_list_button_item_paste_list_image.setAttribute("src", "/img/clipboard.svg");
		HTML_list_button_item_paste_list_image.setAttribute("alt", "Paste list");

		//Create buttons
		HTML_list_button_item_delete_list.appendChild(HTML_list_button_item_delete_list_image);
		HTML_list_button_item_add_list.appendChild(HTML_list_button_item_add_list_image);
		HTML_list_button_item_paste_list.appendChild(HTML_list_button_item_paste_list_image);
		//HTML_list_button_item_add_item.appendChild(HTML_list_button_item_add_item_image);

		HTML_list_button_wrapper.appendChild(HTML_list_button_item_delete_list);
		HTML_list_button_wrapper.appendChild(HTML_list_button_item_add_list);
		HTML_list_button_wrapper.appendChild(HTML_list_button_item_paste_list);
		// HTML_list_button_wrapper.appendChild(HTML_list_button_item_add_user);

	return HTML_list_button_wrapper;
}

function HTMLcreateListOverviewItem(snap, ownerImage) {
	var HTML_overview_remove_list = document.createElement("div");
		HTML_overview_remove_list.className = "firebase-remove-list remove-list";

	var HTML_list_overview_item = document.createElement("div");
		HTML_list_overview_item.className = "card list js-list";
		HTML_list_overview_item.setAttribute("sub", snap.key);
		HTML_list_overview_item.setAttribute("id", "list-"+snap.key);

	var HTML_list_overview_items_wrapper = document.createElement("div");
		HTML_list_overview_items_wrapper.className = "card-content-wrapper";

	var HTML_list_overview_title = document.createElement("span");
		HTML_list_overview_title.className = "card-title";	

		if(snap.val().name) {
			HTML_list_overview_title.appendChild(document.createTextNode(snap.val().name));
		}else {
			HTML_list_overview_title.setAttribute("placeholder", i18n.firebase.placeholder.notitle);
		}

	var HTML_list_overview_description = document.createElement("div");
		HTML_list_overview_description.className = "card-description";	

	var HTML_list_overview_meta_friends = document.createElement("span");
		HTML_list_overview_meta_friends.className = "card-meta friends";
		HTML_list_overview_meta_friends.appendChild(document.createTextNode(snap.val().userCount));	

	var HTML_list_overview_meta_items = document.createElement("span");
		HTML_list_overview_meta_items.className = "card-meta items";
		HTML_list_overview_meta_items.appendChild(document.createTextNode(snap.val().itemCount));	

	var HTML_list_overview_meta_checked = document.createElement("span");
		HTML_list_overview_meta_checked.className = "card-meta checked";
		HTML_list_overview_meta_checked.appendChild(document.createTextNode(snap.val().tickedCount));	

	var HTML_list_overview_indicator_wrapper = document.createElement("div");
		HTML_list_overview_indicator_wrapper.className = "card-indicator";

	var HTML_list_overview_indicator_owner = document.createElement("div");
		HTML_list_overview_indicator_owner.className = "owner-indicator";

	//Get the user image
	var image = '';

	firebase.database().ref("Users/"+firebase.auth().currentUser.uid).once('value', snap => {
	   image = snap.val().thumb_image;

	   return image;
	});

	if(ownerImage != '') {
		var HTML_list_overview_indicator_owner_image = document.createElement("img");
			HTML_list_overview_indicator_owner_image.className = "avatar";
			HTML_list_overview_indicator_owner_image.setAttribute("src", ownerImage);
			HTML_list_overview_indicator_owner_image.setAttribute("alt", "owner image");
	}else {
		var HTML_list_overview_indicator_owner_image = document.createElement("div");
			HTML_list_overview_indicator_owner_image.className = "avatar";		
	}

	//Create the indicator
	HTML_list_overview_item.appendChild(HTML_overview_remove_list);
	HTML_list_overview_indicator_owner.appendChild(HTML_list_overview_indicator_owner_image);	
	HTML_list_overview_indicator_wrapper.appendChild(HTML_list_overview_indicator_owner);

	HTML_list_overview_items_wrapper.appendChild(HTML_list_overview_title);
	HTML_list_overview_description.appendChild(HTML_list_overview_meta_friends);
	HTML_list_overview_description.appendChild(HTML_list_overview_meta_items);
    HTML_list_overview_description.appendChild(HTML_list_overview_meta_checked);
	HTML_list_overview_items_wrapper.appendChild(HTML_list_overview_description);
	HTML_list_overview_item.appendChild(HTML_list_overview_items_wrapper);
	HTML_list_overview_item.appendChild(HTML_list_overview_indicator_wrapper);

	return HTML_list_overview_item;
}

function HTMLcreateListMainTitle(snap, focus, show) {
	var HTML_main_title_list_wrapper = document.createElement("div");
		HTML_main_title_list_wrapper.setAttribute("id", "list-title-"+snap.key);

	var HTML_main_title_list = document.createElement("input");

		if(snap.val().name) {
			HTML_main_title_list.setAttribute("value", snap.val().name);
		}else {
			HTML_main_title_list.setAttribute("placeholder", i18n.firebase.placeholder.notitledetail);
		}

		if(focus == "title-"+snap.key) {
			HTML_main_title_list.setAttribute("focus", true);
		}else{
			HTML_main_title_list.setAttribute("focus", false);
		}

		if(show != true) {
			HTML_main_title_list.className = "firebase-set list-item-title title-"+snap.key;
		}else{
			HTML_main_title_list.className = "show firebase-set list-item-title title-"+snap.key;
		}

		HTML_main_title_list.setAttribute("id", "title-"+snap.key);
		HTML_main_title_list.setAttribute("uni", "title-"+snap.key);
		HTML_main_title_list.setAttribute("field", "lists");
		HTML_main_title_list.setAttribute("item", "name");
		HTML_main_title_list.setAttribute("sub", snap.key);

		HTML_main_title_list_wrapper.appendChild(HTML_main_title_list);

		return HTML_main_title_list_wrapper;
}

function HTMLcreateFriendsList(listId) {
	var HTML_friendslist = document.createElement("ul");
		HTML_friendslist.className = 'detail-members';
		HTML_friendslist.setAttribute("id", 'friends-'+listId);
		
	return HTML_friendslist;
}

function HTMLcreateListFriend(listId, snap) {
	var HTML_friend_wrapper = document.createElement("li");
		HTML_friend_wrapper.className = "member";
		HTML_friend_wrapper.setAttribute("id", listId+"friend-"+snap.key);

	if(snap.val().image != 'default') {
		var HTML_friend_image = document.createElement("img");
			HTML_friend_image.className = "avatar";
			HTML_friend_image.setAttribute("src", snap.val().thumb_image);
			HTML_friend_image.setAttribute("title", snap.val().name);
			HTML_friend_image.setAttribute("alt", "member");
	}else if(snap.val().name == ''){
		var HTML_friend_image = document.createElement("img");
			HTML_friend_image.className = "avatar";
			HTML_friend_image.setAttribute("src", "/img/sad.svg");
			HTML_friend_image.setAttribute("title", snap.val().name);
			HTML_friend_image.setAttribute("alt", "member");
			HTML_friend_image.setAttribute("id", "firebase-image");		
	}else{
		var HTML_friend_image = document.createElement("div");
			HTML_friend_image.className = "avatar";
			HTML_friend_image.setAttribute("title", snap.val().name);
			HTML_friend_image.setAttribute("init", getInitials(snap.val().name));
			HTML_friend_image.style.background = snap.val().color;
			HTML_friend_image.style.color = invertColor(snap.val().color);
	}

	HTML_friend_wrapper.appendChild(HTML_friend_image);

	return HTML_friend_wrapper;	
}

function HTMLcreateListItemsWrapper(listId) {
	var HTML_list_items_wrapper = document.createElement("div");
		HTML_list_items_wrapper.className = 'card-main';

	var HTML_list_items_wrapper_unchecked = document.createElement("ul");
		HTML_list_items_wrapper_unchecked.className = "list-unchecked";
		HTML_list_items_wrapper_unchecked.setAttribute("id", listId+"-items-unchecked");

	var HTML_list_items_wrapper_checked = document.createElement("ul");
		HTML_list_items_wrapper_checked.className = "list-checked";
		HTML_list_items_wrapper_checked.setAttribute("id", listId+"-items-checked");

	HTML_list_items_wrapper.appendChild(HTML_list_items_wrapper_unchecked);
	HTML_list_items_wrapper.appendChild(HTML_list_items_wrapper_checked);

	return HTML_list_items_wrapper;	
}

function HTMLcreateList(listId) {
	var HTML_list_item_template = document.createElement("div");
		HTML_list_item_template.className = 'detail-item detail-'+listId;
		HTML_list_item_template.setAttribute('ref', listId);

		return HTML_list_item_template;
}

function HTMLcreateListItemControls() {
	var HTML_list_button_wrapper = document.createElement("ul");
		HTML_list_button_wrapper.className = "btn-group-list";

	var HTML_list_button_item_delete_item = document.createElement("li");
		HTML_list_button_item_delete_item.className = "icon remove";
		HTML_list_button_item_delete_item.setAttribute("id", "js-remove-list-items");

	var HTML_list_button_item_delete_item_image = document.createElement("img");
		HTML_list_button_item_delete_item_image.className = "js-";
		HTML_list_button_item_delete_item_image.setAttribute("src", "/img/delete.svg");
		HTML_list_button_item_delete_item_image.setAttribute("alt", "Delete item");

	var HTML_list_button_item_add_user = document.createElement("li");
		HTML_list_button_item_add_user.className = "add-member icon add-user";
		HTML_list_button_item_add_user.setAttribute("data-toggle", "modal");
		HTML_list_button_item_add_user.setAttribute("data-target", "#modal-search-friends");

	var HTML_list_button_item_add_user_image = document.createElement("img");
		HTML_list_button_item_add_user_image.className = "js-";
		HTML_list_button_item_add_user_image.setAttribute("src", "/img/add-user.svg");
		HTML_list_button_item_add_user_image.setAttribute("alt", "member");

	var HTML_list_button_item_add_item = document.createElement("li");
		HTML_list_button_item_add_item.className = "icon add";
		HTML_list_button_item_add_item.setAttribute("id", "js-add-list-items");

	var HTML_list_button_item_add_item_image = document.createElement("img");
		HTML_list_button_item_add_item_image.className = "js-";
		HTML_list_button_item_add_item_image.setAttribute("src", "/img/plus.svg");
		HTML_list_button_item_add_item_image.setAttribute("alt", "Add item");

	var HTML_list_button_item_paste_items = document.createElement("li");
		HTML_list_button_item_paste_items.className = "icon paste";
		HTML_list_button_item_paste_items.setAttribute("id", "js-paste-list-items");

	var HTML_list_button_item_paste_item_image = document.createElement("img");
		HTML_list_button_item_paste_item_image.className = "js-";
		HTML_list_button_item_paste_item_image.setAttribute("src", "/img/clipboard.svg");
		HTML_list_button_item_paste_item_image.setAttribute("alt", "Paste list");

	//Create buttons
	HTML_list_button_item_delete_item.appendChild(HTML_list_button_item_delete_item_image);
	HTML_list_button_item_add_user.appendChild(HTML_list_button_item_add_user_image);
	HTML_list_button_item_add_item.appendChild(HTML_list_button_item_add_item_image);
	HTML_list_button_item_paste_items.appendChild(HTML_list_button_item_paste_item_image);

	HTML_list_button_wrapper.appendChild(HTML_list_button_item_delete_item);
	HTML_list_button_wrapper.appendChild(HTML_list_button_item_add_item);
	HTML_list_button_wrapper.appendChild(HTML_list_button_item_add_user);
	HTML_list_button_wrapper.appendChild(HTML_list_button_item_paste_items);

	return	HTML_list_button_wrapper;
}

function HTMLcreateListItem(listId, snap, focus, changer, active_remove) {
 		//Create the LI element for the list item
 		var HTML_list_item = document.createElement("li");
 			HTML_list_item.setAttribute("id", snap.key);

 		var HTML_list_item_remove = document.createElement('div');

			if(active_remove == true) {
				HTML_list_item_remove.className = 'firebase-remove-item remove-item show';
			}else {
				HTML_list_item_remove.className = 'firebase-remove-item remove-item';
			}

 		//Create the List Wrapper
 		var HTML_list_item_wrapper = document.createElement("div");
 			HTML_list_item_wrapper.className = 'list-wrapper';

	 	//Create the list item title elementW
	 	var HTML_list_item_title = document.createElement("textarea");
	 		HTML_list_item_title.type = "text";
			HTML_list_item_title.className = 'list-item-title firebase-set js-auto-size';
			HTML_list_item_title.setAttribute("value", snap.val().title);
			HTML_list_item_title.setAttribute("rows", 1);
			
			if(focus == "title-"+snap.key) {
				HTML_list_item_title.setAttribute("focus", true);
			}else{
				HTML_list_item_title.setAttribute("focus", false);
			}

			HTML_list_item_title.setAttribute("uni", "title-"+snap.key);
			HTML_list_item_title.setAttribute("field", "listItems");
			HTML_list_item_title.setAttribute("item", "title");
			HTML_list_item_title.setAttribute("itd", snap.key);
			HTML_list_item_title.setAttribute("sub", listId);
			HTML_list_item_title.setAttribute("placeholder", i18n.firebase.placeholder.title);
			HTML_list_item_title.appendChild(document.createTextNode(snap.val().title));

		//Create the list item details element
		var HTML_list_item_detail = document.createElement("textarea");
			HTML_list_item_detail.type = "text";
			HTML_list_item_detail.className = 'list-item-detail firebase-set js-auto-size';
			HTML_list_item_detail.setAttribute("value", snap.val().detail);
			HTML_list_item_detail.setAttribute("rows", 1);

			if(focus == "detail-"+snap.key) {
				HTML_list_item_detail.setAttribute("focus", true);
			}else{
				HTML_list_item_detail.setAttribute("focus", false);
			}
				
			HTML_list_item_detail.setAttribute("uni", "detail-"+snap.key);
			HTML_list_item_detail.setAttribute("field", "listItems");
			HTML_list_item_detail.setAttribute("item", "detail");
			HTML_list_item_detail.setAttribute("itd", snap.key);
			HTML_list_item_detail.setAttribute("sub", listId);
			HTML_list_item_detail.setAttribute("placeholder", i18n.firebase.placeholder.detail);
			HTML_list_item_detail.appendChild(document.createTextNode(snap.val().detail));

		//Create the form with the checkbox
		var HTML_list_item_form = document.createElement("form");

		var HTML_list_item_form_fieldset = document.createElement("fieldset");

		var HTML_list_item_form_ul = document.createElement("ul");
			HTML_list_item_form_ul.className = 'velden';

		var HTML_list_item_form_li = document.createElement("li");
			HTML_list_item_form_li.className = 'form-input-checkbox';

		var HTML_list_item_form_input = document.createElement("input");
			HTML_list_item_form_input.type = "checkbox";
			HTML_list_item_form_input.className = 'checkbox firebase-set-checkbox';
			HTML_list_item_form_input.setAttribute("field", "listItems");
			HTML_list_item_form_input.setAttribute("itd", snap.key);
			HTML_list_item_form_input.setAttribute("sub", listId);
			HTML_list_item_form_input.setAttribute("item", "ticked");
			HTML_list_item_form_input.setAttribute("id", "filter-"+snap.key);
			HTML_list_item_form_input.checked = snap.val().ticked;

			if(snap.val().ticked == true) {
				HTML_list_item_form_input.setAttribute('checked', 'checked');
			}

		var HTML_list_item_form_input_label = document.createElement("label");
			HTML_list_item_form_input_label.className = 'option-label';		
			HTML_list_item_form_input_label.setAttribute("for", "filter-"+snap.key);	

		if(changer != '') {
			HTML_list_item_form_input_label.setAttribute("init", getInitials(changer.name));
			HTML_list_item_form_input_label.style.background = changer.color;
			HTML_list_item_form_input_label.style.color = invertColor(changer.color);				
		}

		HTML_list_item_form_li.appendChild(HTML_list_item_form_input);
		HTML_list_item_form_li.appendChild(HTML_list_item_form_input_label);

		HTML_list_item_form_ul.appendChild(HTML_list_item_form_li);

		HTML_list_item_form_fieldset.appendChild(HTML_list_item_form_ul);

		HTML_list_item_form.appendChild(HTML_list_item_form_fieldset);

		//Put the list details and the form inside the list wrapper
		HTML_list_item_wrapper.appendChild(HTML_list_item_title);
		HTML_list_item_wrapper.appendChild(HTML_list_item_detail);
		
		HTML_list_item.appendChild(HTML_list_item_remove);
		HTML_list_item.appendChild(HTML_list_item_wrapper);		
		HTML_list_item.appendChild(HTML_list_item_form);

		return HTML_list_item;
};