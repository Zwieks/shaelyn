<!-- {{$debugpath}} -->
<div class="js-importlist item-wrapper {{$size}} mylists">
	<div class="item">
		<div class="icon back js-list-back">
			<img src="{{ asset('img/back.svg') }}" alt="Back" />
		</div>

		<div class="title-wrapper">
			<h3 class="item-title">My Lists</h3>
			<div id="firebase-list-title"></div>
		</div>
		<div id="firebase-lists" class="content">

		</div>

		<div id="firebase-list-details" class="detail"></div>
	</div>

	<div id="paste-wrapper" class="js-item-dialog">
		<div class="close-paste js-close-item-dialog"></div>

		{{ Form::open(['method' => 'get', 'id' => 'paste-form']) }}
			{{ Form::textarea('paste', null, ['class' => 'list-paste']) }}
		{{ Form::close() }}

		<div class="content-wrapper">
			<div class="inner">
				<figure>
					<img src="{{ asset('img/bot.svg') }}">
				</figure>

				<div class="description">
					<span class='text'>{{ Lang::get('itemdialog.paste-description') }}</span>
				</div>

				<div class="indication">
					<span class='text'>{!! Lang::get('itemdialog.paste-options') !!}</span>
				</div>
			</div>
		</div>
	</div>	
</div>