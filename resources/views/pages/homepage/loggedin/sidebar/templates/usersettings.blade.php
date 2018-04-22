<!-- {{$debugpath}} -->
<div class="settings-wrapper">
	<h2 class="settings-title">{{ Lang::get('forms.settings.title') }}</h2>
	<!-- MAIL -->
	<div class="setting-item">
		<span class="slide-label">{{ Lang::get('forms.settings.label-mail') }}</span>
		<img class="settings-icon" src="{{ asset('img/email.svg') }}" alt="mail icon">
		<label class="slide-wrapper js-slide-control" for="firebase-setting-mail">
			{{Form::checkbox('name', '', '', array_merge(['field' => 'UserSettings','item' => 'sendmail','class' => 'firebase-set-checkbox','id' => 'firebase-setting-mail']))}}
			<div class="slide">
				<div class="slide-bg"></div>
				<div class="slide-control"></div>
			</div>
		</label>
	</div>

	<!-- NOTIFICATIONS -->
	<div class="setting-item">
		<span class="slide-label">{{ Lang::get('forms.settings.label-notifications') }}</span>
		<img class="settings-icon" src="{{ asset('img/ring.svg') }}" alt="notfication icon">
		<label class="slide-wrapper js-slide-control" for="firebase-setting-notifications">
			{{Form::checkbox('name', '', '', array_merge(['field' => 'UserSettings','item' => 'notifications','class' => 'firebase-set-checkbox','id' => 'firebase-setting-notifications']))}}
			<div class="slide">
				<div class="slide-bg"></div>
				<div class="slide-control"></div>
			</div>
		</label>
	</div>	
</div>