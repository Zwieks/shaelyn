<script type="text/javascript">
    $(document).ready(function(e) {

        //Remove the input errors and empty all the input fields when the modal has been closed
        $('#modal-search-friends').on('hidden.bs.modal', function () {
        	$('#firebase-search-friends-results .invite').removeClass('invite');
            $('#search_field_friends').val("");
            $('#js-invite-friend-search').show();
            $('#js-friend-invite-confirmation').hide();
            $('#firebase-search-friends-results').empty();
            $('#js-invite-friends').attr('data-list', "");
        });

        //Click on the agenda item
        $( "#modal-search-friends" ).on('shown.bs.modal', function(e){

            //Get the listId of the active list
            var listId = $("#firebase-list-details").find(".show").attr("ref");

            $('#js-invite-friends').attr('data-list',listId);
			$('#search_field_friends').focus();
            $('#js-friend-invite-confirmation').hide();
            $('#js-invite-friends').show();
            $('.js-modal-cancel').show();
            $('#modal-search-friends').find('.firebase-search-friends').attr('data-type', 'friends');
        });
    });
</script>