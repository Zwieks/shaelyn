<!-- {{$debugpath}} -->
<div class="item-wrapper {{$size}} chats">
	<div class="item">

<!-- 		<div class="comingsoon">
			<figure>
				<img src="{{ URL::asset('img/ComingSoon.png') }}">
			</figure>
		</div> -->

		<div class="chat-wrapper">
			<div class="chat-friends content" id="firebase-chat-friends">
				<div id="firebase-chatgroups" class="user-chats-wrapper"></div>
			</div>
			<div class="chat-conversation">
				<div id="firebase-chat-meta" class="chat-meta"></div>
				<div id="firebase-chat-conversations"></div>	
				<div class="chat-message-wrapper">
					<form id="chat-form" action="#">
						<input type="text" id="firebase-message-input" class="chat-message-input" autocomplete="off"/>

						<fieldset class="chat-fieldset hide" id="js-chat-text-input">
							<button class="chat-input-btn chat-send-btn" id="firebase-send-chat-message">
								<img src="/img/send-button.svg" alt="Send text">
							</button>
						</fieldset>

						<fieldset class="chat-fieldset" id="js-chat-image-input">
							<input id="firebase-mediaCapture" type="file" accept="image/*,capture=camera">
			            	<button class="chat-input-btn" id="firebase-submitImage" title="Add an image">
			            		<img src="/img/image.svg" alt="Send image">
			            	</button>
						</fieldset>
					</form>
				</div>
			</div>
		</div>		
	</div>
</div>