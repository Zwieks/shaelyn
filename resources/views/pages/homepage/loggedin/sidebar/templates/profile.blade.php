<!-- {{$debugpath}} -->
<div class="particles-animation-wrapper">
	<div class="particles-content-wrapper">

		<figure id="firebase-image-wrapper"></figure>

		<fieldset class="editable-firebase-wrapper">
			<div class="feedback">{{ Lang::get('forms.editable') }}</div>
			<input class="ghost-input firebase-set" value="{{$user['name']}}" type="text" name="" field="Users" item="name" id="firebase-username">
		</fieldset>
	</div>
	<div id="particles-js" class="particles-animation"></div>
</div>