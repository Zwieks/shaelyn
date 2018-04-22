<!-- {{$debugpath}} -->
<div class="settings-wrapper">
	<div class="setting-item">
		<span class="slide-label">Mail receiving</span>
		<label class="slide-wrapper js-slide-control" for="firebase-setting-mail">
			{{Form::checkbox('name', '', '', array_merge(['field' => 'UserSettings','item' => 'sendmail','class' => 'firebase-set-checkbox','id' => 'firebase-setting-mail']))}}
			<div class="slide">
				<div class="slide-bg"></div>
				<div class="slide-control"></div>
			</div>
		</label>
	</div>	
</div>