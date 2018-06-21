<script type="text/javascript">
    $(document).ready(function(){
        if($(window).width()>768){
            //Create the autocomplete list
            if($('#firebase-lists').length) {
                $("#firebase-lists").mCustomScrollbar({
                    theme:"light-3",
                    autoHideScrollbar: true
                });
            }

            if($('#firebase-friends').length) {
                $("#firebase-friends").mCustomScrollbar({
                    theme:"light-3",
                    autoHideScrollbar: true
                });
            }  

            if($('#firebase-chat-friends').length) {
                $("#firebase-chat-friends").mCustomScrollbar({
                    theme:"light-3",
                    autoHideScrollbar: true
                });
            }
        }               
    });
</script>