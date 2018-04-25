<!-- {{$debugpath}} -->
<div class="dashboard-wrapper">
	{{--Render Loggedin Friends --}}
	@include('pages.homepage.loggedin.dashboard.blocks.friends', ['size' => 'small'])

	{{--Render Loggedin Lists --}}
	@include('pages.homepage.loggedin.dashboard.blocks.lists', ['size' => 'small'])

	{{--Render Loggedin Chats --}}
	@include('pages.homepage.loggedin.dashboard.blocks.chats', ['size' => 'large'])
</div>