<script type="text/javascript">
    $(document).ready(function(e) {

        //Remove the input errors and empty all the input fields when the modal has been closed
        $('#modal-search-friends').on('hidden.bs.modal', function () {
        	$('#firebase-search-friends-results .invite').removeClass('invite');
            $('#search_field_friends').val("");
            $('#firebase-search-friends-results').empty();
        });

        //Click on the agenda item
        $( "#modal-search-friends" ).on('shown.bs.modal', function(e){
			$('#search_field_friends').focus();
        });
    });
</script>