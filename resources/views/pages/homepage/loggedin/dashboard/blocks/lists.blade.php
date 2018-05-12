<!-- {{$debugpath}} -->
<div class="item-wrapper {{$size}} mylists">
	<div class="item">
		<div class="icon back js-list-back">
			<img src="{{ asset('img/back.svg') }}" alt="Back" />
		</div>

		<div class="title-wrapper">
			<h3 class="item-title">My Lists</h3>
			<div id="firebase-list-title"></div>
		</div>	
		<div id="firebase-lists" class="content mCustomScrollbar">

		</div>

		<div id="firebase-list-details" class="detail"></div>
	</div>
</div>