<!-- {{$debugpath}} -->
@extends('layouts.master-loggedin')

{{-- Page Title --}}
@section('title', Lang::get('global.head-title'))

{{-- Name of body class --}}
@section('type','home ')

{{-- Metadata content --}}
@section('description', 'Homepage')

{{-- Include Content --}}
@section('content')
    @include('pages.homepage.loggedin')
@stop

{{-- Include Scripts --}}
@section('page-scripts')
	@if (!Agent::isMobile() )
		@include('scripts.emoticons.emoticons-init')
	@endif	
	@include('scripts.owlslider.owlslider-init')
	@include('scripts.customscrollbar.customscrollbar-init')
	@include('scripts.textarea.textarea-init')
    @include('scripts.modal.modal-show-search-users-init', ['modalid' => 'modal-search-friends'])
    @include('scripts.modal.modal-show-search-friends-init', ['modalid' => 'modal-search-users'])
    @include('scripts.modal.modal-show-chat-image-init', ['modalid' => 'modal-chat-image'])
    @include('scripts.modal.modal-show-chat-new-init', ['modalid' => 'modal-chat-new'])
    @include('scripts.modal.modal-show-chat-addusers-init', ['modalid' => 'modal-chat-add-users'])
@stop

{{-- Include Modal --}}
@section('modal')
	@include('modals.layout', ['content' => "modals.search.friends", 'modalsize' => 'large', 'modaltype' => 'transparent', 'modalid' => 'modal-search-friends'])
	@include('modals.layout', ['content' => "modals.search.users", 'modalsize' => 'large', 'modaltype' => 'transparent', 'modalid' => 'modal-search-users'])
	@include('modals.layout', ['content' => "modals.chat.image", 'modalsize' => 'large', 'modaltype' => 'transparent', 'modalid' => 'modal-chat-image'])
	@include('modals.layout', ['content' => "modals.chat.addusers", 'modalsize' => 'large', 'modaltype' => 'transparent', 'modalid' => 'modal-chat-add-users'])
	@include('modals.layout', ['content' => "modals.chat.new", 'modalsize' => 'large', 'modaltype' => 'transparent', 'modalid' => 'modal-chat-new'])
@stop

@section('pageloader')
	@include('modals.loaders.page')
@stop

{{-- Include Scripts --}}
@section('headeranimation')
	<script type="text/javascript" src="{{ URL::asset('js/network-animation.js') }}"></script>
	<script type="text/javascript" src="{{ URL::asset('js/network-animation-init.js') }}"></script>
@stop

@if (!Agent::isMobile() )
	@section('emojipicker')
		<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet">
		<link href="{{ URL::asset('css/emoticons/emoji.css') }}" rel="stylesheet">

		<script src="{{ URL::asset('js/emoticons/config.js') }}"></script>
	  	<script src="{{ URL::asset('js/emoticons/util.js') }}"></script>
	  	<script src="{{ URL::asset('js/emoticons/jquery.emojiarea.js') }}"></script>
	  	<script src="{{ URL::asset('js/emoticons/emoji-picker.js') }}"></script>
	@stop
@endif


@section('firebase')
	<script type="text/javascript" src="{{ URL::asset('js/firebase/firebase-lists.js') }}"></script>
	<script type="text/javascript" src="{{ URL::asset('js/firebase/firebase-chats.js') }}"></script>
	<script type="text/javascript" src="{{ URL::asset('js/firebase/firebase-loggedin.js') }}"></script>
@stop