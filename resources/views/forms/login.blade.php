<!-- {{$debugpath}} -->
{!! Form::open(['method' => 'post', 'class' => 'changed']) !!}
    <fieldset>
        <ul class="velden">
            <li class="form-input-textfield">
                @include('forms.inputerror')
                {!! Form::text('email','test@test.com') !!}
            </li>

            <li class="form-input-textfield">
                @include('forms.inputerror')
                {!! Form::password('password', ['class' => 'awesome']) !!}
            </li>
        </ul>
    </fieldset>
{!! Form::close() !!}