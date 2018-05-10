<!-- {{$debugpath}} -->
{!! Form::open(['method' => 'post', 'class' => 'changed', 'id' => 'search-form']) !!}
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <fieldset>
        <ul class="velden">
            <li class="form-input-textfield">
                @include('forms.inputerror')
                {!! Form::text('email', '', array_merge(['id' => 'search_field_users', 'autocomplete'=> 'off', 'class' => 'firebase-search-users', 'placeholder' => Lang::get('forms.placeholder.user-search')])) !!}
            </li>
        </ul>
    </fieldset>
{!! Form::close() !!}