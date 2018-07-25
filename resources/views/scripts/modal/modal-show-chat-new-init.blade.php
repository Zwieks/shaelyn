<script type="text/javascript">
    $(document).ready(function(e) {

        //Remove the input errors and empty all the input fields when the modal has been closed
        $('#modal-chat-new').on('hidden.bs.modal', function () {
            $('#firebase-search-chatfriends-results .invite').removeClass('invite');
            $('#search_field_chatfriends').val("");
            $('#new_chatname').val("");
            $('#js-invite-chatfriend-search').show();
            $('#js-creat-chat-confirmation').hide();
            $('#firebase-search-chatfriends-results').empty();
            $('#firebase-selected-friends').empty();
        });

        $(document).on('shown.bs.modal', '#modal-chat-new', function (event) {

            //Get the listId of the active list
            var listId = $("#firebase-list-details").find(".show").attr("ref");
            $('#js-creat-chat-confirmation').hide();
            $('#new_chatname').focus();
            $('#js-invite-chatfriends').attr('data-list',listId);
            $('#js-invite-chatfriends').show();
            $('#modal-chat-new').find('.firebase-search-friends').attr('data-type', 'chatfriends');
            $('#modal-chat-new').find('.firebase-search-friends').attr('id', 'search_field_chatfriends');
            $('.js-modal-cancel').show();
        });
    });
</script>