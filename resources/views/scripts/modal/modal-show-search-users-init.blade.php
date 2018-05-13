<script type="text/javascript">
    $(document).ready(function(e) {

        //Remove the input errors and empty all the input fields when the modal has been closed
        $('#modal-search-users').on('hidden.bs.modal', function () {
        	$('#firebase-search-users-results .invite').removeClass('invite');
            $('#search_field_users').val("");
            $('#js-invite-user-search').show();
            $('#js-user-invite-confirmation').hide();
            $('#firebase-search-users-results').empty();
        });

        //Click on the agenda item
        $( "#modal-search-users" ).on('shown.bs.modal', function(e){
			$('#search_field_users').focus();
            $('#js-user-invite-confirmation').hide();
            $('#js-invite-users').show();
        });
    });
</script>