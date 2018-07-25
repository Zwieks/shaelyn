<!-- {{$debugpath}} -->
{!! Form::open(['method' => 'post', 'class' => 'changed', 'id' => 'login-form']) !!}
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <fieldset>
        <ul class="velden">
            <li class="form-input-textfield">
                @include('forms.inputerror')
                {!! Form::text('text', '', array_merge(['id' => 'new_chatname', 'class' => 'ghost-input-small', 'placeholder' => Lang::get('forms.placeholder.newchat')])) !!}
            </li>
        </ul>
    </fieldset>
{!! Form::close() !!}