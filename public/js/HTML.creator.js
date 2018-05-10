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

function HTMLcreateFriend(snap) {
	var HTML_friends_overview_wrapper = document.createElement("div");
		HTML_friends_overview_wrapper.className = "card-wrapper";
		HTML_friends_overview_wrapper.setAttribute("id", "userfriend-"+snap.key);

	var HTML_friends_overview_inner  = document.createElement("div");

		if(snap.val().online != 'online') {
			HTML_friends_overview_inner.className = "card";
		}else {
			HTML_friends_overview_inner.className = "card "+snap.val().online;
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

function HTMLcreateListOverviewItem(snap) {
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

	var HTML_list_overview_indicator_wrapper = document.createElement("div");
		HTML_list_overview_indicator_wrapper.className = "card-indicator";

	var HTML_list_overview_indicator_owner = document.createElement("div");
		HTML_list_overview_indicator_owner.className = "owner-indicator";

	if(snap.val().ownerImage != 'default') {
		var HTML_list_overview_indicator_owner_image = document.createElement("img");
			HTML_list_overview_indicator_owner_image.className = "avatar";
			HTML_list_overview_indicator_owner_image.setAttribute("src", snap.val().ownerImage);
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
	HTML_list_overview_items_wrapper.appendChild(HTML_list_overview_description);
	HTML_list_overview_item.appendChild(HTML_list_overview_items_wrapper);
	HTML_list_overview_item.appendChild(HTML_list_overview_indicator_wrapper);

	return HTML_list_overview_item;
}

function HTMLcreateListMainTitle(snap, focus, show) {
	var HTML_main_title_list_wrapper = document.createElement("div");
		HTML_main_title_list_wrapper.setAttribute("id", "list-title-"+snap.key);

	var HTML_main_title_list = document.createElement("h3");

		if(snap.val().name) {
			HTML_main_title_list.appendChild(document.createTextNode(snap.val().name));
		}else {
			HTML_main_title_list.setAttribute("placeholder", i18n.firebase.placeholder.notitledetail);
		}

		HTML_main_title_list.setAttribute("contentEditable", true);

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
	
	var HTML_add_friend = document.createElement("li");
		HTML_add_friend.className = "add-member icon add-user";
		HTML_add_friend.setAttribute("data-toggle", "modal");
		HTML_add_friend.setAttribute("data-target", "#modal-search-friends");

	var HTML_add_friend_image = document.createElement("img");
		HTML_add_friend_image.className = "js-";
		HTML_add_friend_image.setAttribute("src", "/img/add-user.svg");
		HTML_add_friend_image.setAttribute("alt", "member");

	HTML_add_friend.appendChild(HTML_add_friend_image);
	HTML_friendslist.appendChild(HTML_add_friend);
		
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
	var HTML_list_items_wrapper = document.createElement("ul");
		HTML_list_items_wrapper.className = 'card-main';

	return HTML_list_items_wrapper;	
}

function HTMLcreateList(listId) {
	var HTML_list_item_template = document.createElement("div");
		HTML_list_item_template.className = 'detail-item detail-'+listId;
		HTML_list_item_template.setAttribute('ref', listId);

		return HTML_list_item_template;
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
	 	var HTML_list_item_title = document.createElement("div");
			HTML_list_item_title.className = 'list-item-title firebase-set';
			HTML_list_item_title.setAttribute("contentEditable", true);
			
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
		var HTML_list_item_detail = document.createElement("div");
			HTML_list_item_detail.className = 'list-item-detail firebase-set';
			HTML_list_item_detail.setAttribute("contentEditable", true);

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