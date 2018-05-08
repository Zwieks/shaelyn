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
    @include('scripts.modal.modal-show-search-user-init', ['modalid' => 'modal-search-friend'])
@stop

{{-- Include Modal --}}
@section('modal')
	@include('modals.layout', ['content' => "modals.search.friends", 'modaltype' => 'transparent', 'modalid' => 'modal-search-friend'])
@stop

{{-- Include Scripts --}}
@section('headeranimation')
	<script type="text/javascript" src="{{ URL::asset('js/network-animation.js') }}"></script>
	<script type="text/javascript" src="{{ URL::asset('js/network-animation-init.js') }}"></script>
	<script type="text/javascript" src="{{ URL::asset('js/firebase/firebase-loggedin.js') }}"></script>
@stop