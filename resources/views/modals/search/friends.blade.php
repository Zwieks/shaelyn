<!-- {{$debugpath}} -->
{{--Modal HEADER--}}
<div class="modal-header">
	<h2 class="modal-title" id="favoritesModalLabel">{{ Lang::get('modal.search.friends.title') }}</h2>
	<button type="button" class="modal-close" data-dismiss="modal" aria-label="Close" data-icon="n">
		<span aria-hidden="true"></span>
	</button>
</div>

{{--Modal BODY--}}
<div class="modal-body">
	<div class="image-wrapper">
		<figure>
			<img src="{{ asset('img/add-user.svg') }}">
		</figure>
	</div>
	@include('forms.search-friends')

	<div id="firebase-search-friends-results" class="component-search"></div>
</div>

{{--Modal FOOTER--}}
<div class="modal-footer">
	<button type="button" class="btn btn-default" data-dismiss="modal">{{ Lang::get('buttons.cancel') }}</button>
	<button type="button" class="btn btn-primary" id="js-invite-friend">{{ Lang::get('buttons.invite') }}</button>
</div>