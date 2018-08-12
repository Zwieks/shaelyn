<!-- {{$debugpath}} -->
{{--Modal HEADER--}}
<div class="modal-header">
	<h2 class="modal-title" id="favoritesModalLabel">{{ Lang::get('modal.chat.new.title') }}</h2>
	<button type="button" class="modal-close" data-dismiss="modal" aria-label="Close" data-icon="n">
		<span aria-hidden="true"></span>
	</button>
</div>

{{--Modal BODY--}}
<div class="modal-body">
	<ul class="detail-members" id="firebase-selected-friends"></ul>

	<div class="js-invite-wrapper" id="js-invite-chatfriend-search">

		@include('forms.chatname')

		<p class="modal-intro">{{ Lang::get('modal.chat.new.addfriends') }}</p>
		@include('forms.search-friends')

		<div id="firebase-search-chatfriends-results" class="firebase-search-chatfriends-results component-search"></div>
	</div>

	<div class="js-confirmation-wrapper modal-notification" id="js-creat-chat-confirmation">
		<div class="image-wrapper">
			<figure>
				<img src="{{ asset('img/rocket.svg') }}">
			</figure>
		</div>
		<h3>{{ Lang::get('modal.confirmation.newchat') }}</h3>
	</div>
</div>

{{--Modal FOOTER--}}
<div class="modal-footer">
	<button type="button" class="btn btn-default js-modal-cancel" data-dismiss="modal">{{ Lang::get('buttons.cancel') }}</button>
	<button type="button" class="btn btn-primary js-invite-chatfriends" id="js-invite-chatfriends">{{ Lang::get('buttons.invite') }}</button>
</div>