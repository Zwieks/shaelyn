<!-- {{$debugpath}} -->
<div class="particles-animation-wrapper">
	<div class="particles-content-wrapper">

		<figure id="firebase-image-wrapper">

		</figure>

<!-- 		<fieldset class="editable-firebase-wrapper"> -->
<!-- 			<div class="feedback">{{ Lang::get('forms.editable') }}</div> -->
			<textarea class="firebase-set" value="{{$user['name']}}" name="" rows=1 field="Users" item="name" id="firebase-username" placeholder="{{ Lang::get('firebase.placeholder.noname') }}">{{$user['name']}}</textarea>
<!-- 		</fieldset> -->

<!-- 		<button type="button" class="btn btn-primary" id="js-logout">{{ Lang::get('buttons.login') }}</button> -->
	</div>
	<div id="particles-js" class="particles-animation"></div>
</div>