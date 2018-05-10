<!-- {{$debugpath}} -->
{!! Form::open(['method' => 'post', 'class' => 'changed', 'id' => 'search-form']) !!}
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <fieldset>
        <ul class="velden">
            <li class="form-input-textfield">
                @include('forms.inputerror')
                {!! Form::text('email', '', array_merge(['id' => 'search_field_friends', 'autocomplete'=> 'off', 'class' => 'firebase-search-friends', 'placeholder' => Lang::get('forms.placeholder.friend-search')])) !!}
            </li>
        </ul>
    </fieldset>
{!! Form::close() !!}