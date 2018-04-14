<!-- {{$debugpath}} -->
{!! Form::open(['method' => 'post', 'class' => 'changed']) !!}
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <fieldset>
        <ul class="velden">
            <li class="form-input-textfield">
                @include('forms.inputerror')
                {!! Form::text('email', '', array_merge(['id' => 'email_field', 'class' => 'awesome', 'placeholder' => Lang::get('forms.placeholder.email')])) !!}
            </li>

            <li class="form-input-textfield">
                @include('forms.inputerror')
                {!! Form::password('password', array_merge(['id' => 'password_field', 'class' => 'awesome', 'placeholder' => Lang::get('forms.placeholder.password')])) !!}
            </li>
        </ul>
    </fieldset>
{!! Form::close() !!}