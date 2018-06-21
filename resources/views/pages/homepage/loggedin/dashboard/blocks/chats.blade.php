<!-- {{$debugpath}} -->
<div class="item-wrapper {{$size}} chats">
	<div class="item">

		<div class="comingsoon">
			<figure>
				<img src="{{ URL::asset('img/ComingSoon.png') }}">
			</figure>
		</div>

		<div class="chat-wrapper">
			<div class="chat-friends content" id="firebase-chat-friends">
				<div id="firebase-chats" class="user-wrapper"></div>
				<div id="firebase-online-users-chat" class="user-wrapper online-users"></div>
				<div id="firebase-offline-users-chat" class="user-wrapper offline-users"></div>
			</div>
			<div class="chat-conversation">
				<div id="firebase-chat-meta" class="chat-meta"></div>
				<div id="firebase-chat-conversations">
<!-- 					<div id="firebase-chat-meta" class="chat-meta"></div>
					<div class="chat-window" id="firebase-chat-window">
						<div class="chat-message user">
							<div class="message-wrapper">
								<div class="message-meta">
									<span class="chat-indication"></span>
									<span class="chat-username">Ronald</span>
									<span class="chat-time">10.20 AM, Today</span>
								</div>
								<p class="message-text">Amazing game wasn't it!</p>
							</div>	
						</div>
						<div class="chat-message">
							<div class="message-wrapper">
								<div class="message-meta">
									<span class="chat-indication"></span>
									<span class="chat-username">Dennis</span>
									<span class="chat-time">10.20 AM, Today</span>
								</div>
								<p class="message-text">Have you seen the football match?</p>
							</div>	
						</div>
						<div class="chat-message user">
							<div class="message-wrapper">
								<div class="message-meta">
									<span class="chat-indication"></span>
									<span class="chat-username">Ronald</span>
									<span class="chat-time">10.20 AM, Today</span>
								</div>
								<p class="message-text">I'm fine and you?</p>
							</div>	
						</div>
						<div class="chat-message">
							<div class="message-wrapper">
								<div class="message-meta">
									<span class="chat-indication"></span>
									<span class="chat-username">Dennis</span>
									<span class="chat-time">10.20 AM, Today</span>
								</div>
								<p class="message-text">Hello how are you?</p>
							</div>	
						</div>				
					</div> -->
				</div>	
				<div class="chat-message-wrapper">
					<textarea class="chat-message-input"></textarea>
					<div class="chat-message-options">
						<!-- <img class="icon" src="/img/send.svg" alt="Send message"> -->
						<span class="send-btn" id="firebase-send-chat-message">Send</span>
					</div>
				</div>
			</div>
		</div>		
	</div>
</div>