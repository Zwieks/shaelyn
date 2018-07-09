<!-- {{$debugpath}} -->
<div class="item-wrapper {{$size}} chats">
	<div class="item">
		<div class="icon back js-chat-back">
			<img src="{{ asset('img/back.svg') }}" alt="Back" />
		</div>
		<div class="chat-wrapper">
			<div class="chat-controls">
				<div class="chat-friends content" id="firebase-chat-friends">
					<div id="firebase-chatgroups" class="user-chats-wrapper"></div>
				</div>

				<ul class="btn-group-list">
					<li class="icon add" id="js-add-chat">
						<img class="js-" src="/img/plus.svg" alt="Add chat">
					</li>
				</ul>

				<div id="firebase-chat-options" class="chat-options-wrapper">
					<div class="title-wrapper">
						<h3 class="item-title" id="js-chat-title">Options</h3>
					</div>

					<div class="icon back js-chat-options-back">
						<img src="{{ asset('img/back.svg') }}" alt="Back" />
					</div>
				</div>	
			</div>	
			<div class="chat-conversation">
				<div id="firebase-chat-attendees" class="chat-attendees"></div>
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