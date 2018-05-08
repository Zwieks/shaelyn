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

<!-- 		<div class="login-spinnerwrapper" id ="js-loader">
			<figure class="spinner">
				<img class="outer js-load" src="{{ asset('img/load-outer.svg') }}">
				<img class="center js-load" src="{{ asset('img/load-second.svg') }}">
				<img class="inner js-load" src="{{ asset('img/load-inner.svg') }}">
				<img class="finish js-load-finish" src="{{ asset('img/load-finish.svg') }}">
			</figure>
		</div> -->
	</div>

</div>

{{--Modal FOOTER--}}
<div class="modal-footer">
	<button type="button" class="btn btn-default" data-dismiss="modal">{{ Lang::get('buttons.cancel') }}</button>
<!-- 	<button type="button" class="btn btn-primary" id="js-login">{{ Lang::get('buttons.login') }}</button> -->
</div>