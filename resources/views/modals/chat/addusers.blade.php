<!-- {{$debugpath}} -->
{{--Modal HEADER--}}
<div class="modal-header">
	<h2 class="modal-title" id="favoritesModalLabel">{{ Lang::get('modal.chat.add.friends') }}</h2>
	<button type="button" class="modal-close" data-dismiss="modal" aria-label="Close" data-icon="n">
		<span aria-hidden="true"></span>
	</button>
</div>

{{--Modal BODY--}}
<div class="modal-body">
	<ul class="detail-members" id="firebase-selected-addfriends"></ul>

	<div class="js-invite-wrapper" id="js-invite-add-chatfriend-search">
		<div class="image-wrapper">
			<figure>
				<img src="{{ asset('img/friends.svg') }}">
			</figure>
		</div>
		@include('forms.search-add-chatfriends')

		<div id="firebase-search-add-chat-users-results" class="firebase-search-chatfriends-results component-search"></div>
	</div>

	<div class="js-confirmation-wrapper modal-notification" id="js-add-chat-confirmation">
		<div class="image-wrapper">
			<figure>
				<img src="{{ asset('img/rocket.svg') }}">
			</figure>
		</div>
		<h3>{{ Lang::get('modal.confirmation.userinvite') }}</h3>
	</div>	
</div>

{{--Modal FOOTER--}}
<div class="modal-footer">
	<button type="button" class="btn btn-default js-modal-cancel" data-dismiss="modal">{{ Lang::get('buttons.cancel') }}</button>
	<button type="button" class="btn btn-primary js-invite-chatfriends" id="js-invite-addfriends">{{ Lang::get('buttons.invite') }}</button>
</div>