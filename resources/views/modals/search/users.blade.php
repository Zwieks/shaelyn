<!-- {{$debugpath}} -->
{{--Modal HEADER--}}
<div class="modal-header">
	<h2 class="modal-title" id="favoritesModalLabel">{{ Lang::get('modal.search.users.title') }}</h2>
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
	@include('forms.search-users')

	<div id="firebase-search-users-results" class="component-search"></div>
</div>

{{--Modal FOOTER--}}
<div class="modal-footer">
	<button type="button" class="btn btn-default" data-dismiss="modal">{{ Lang::get('buttons.cancel') }}</button>
	<button type="button" class="btn btn-primary" id="js-invite-users">{{ Lang::get('buttons.invite') }}</button>
</div>