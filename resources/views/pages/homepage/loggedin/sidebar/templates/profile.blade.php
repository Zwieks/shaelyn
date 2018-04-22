<!-- {{$debugpath}} -->
<div class="particles-animation-wrapper">
	<div class="particles-content-wrapper">

		<figure>
			<img  id="firebase-image" src="{{$user['thumb_image']}}" />
		</figure>

		<fieldset class="editable-firebase-wrapper">
			<div class="feedback">{{ Lang::get('forms.editable') }}</div>
			<input class="ghost-input firebase-set" value="{{$user['name']}}" type="text" name="" field="Users" item="name" id="firebase-username">
		</fieldset>

<!-- 		<button type="button" class="btn btn-primary" id="js-logout">{{ Lang::get('buttons.login') }}</button> -->
	</div>
	<div id="particles-js" class="particles-animation"></div>
</div>