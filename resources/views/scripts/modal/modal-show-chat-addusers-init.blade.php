<script type="text/javascript">
    $(document).ready(function(e) {

        //Remove the input errors and empty all the input fields when the modal has been closed
        $('#modal-chat-add-users').on('hidden.bs.modal', function () {
            $('#modal-chat-add-users .firebase-search-chatfriends-results .invite').removeClass('invite');
            $('#search_field_chatfriends').val("");
            $('#search_field_addchatfriends').val("");
            $('.js-invite-wrapper').show();
            $('#js-add-chat-confirmation').hide();
            $('#modal-chat-add-users .firebase-search-chatfriends-results').empty();
            $('#modal-chat-add-users .detail-members').empty();
        });

        $(document).on('shown.bs.modal', '#modal-chat-add-users', function (event) {
            //Get the listId of the active list
            var chatid = $("#firebase-chatgroups").find(".active").attr("id").replace("chat-","");

            //Get the listId of the active list
            $('#js-add-chat-confirmation').hide();
            $('#search_field_addchatfriends').focus();
            $('.js-invite-chatfriends').show();
            $('#modal-chat-add-users').find('.firebase-search-friends').attr('data-chatid', chatid);
            $('#modal-chat-add-users').find('.firebase-search-friends').attr('data-type', 'addchatfriends');
            $('#modal-chat-add-users').find('.firebase-search-friends').attr('id', 'search_field_addchatfriends');
            $('.js-modal-cancel').show();
        });
    });
</script>