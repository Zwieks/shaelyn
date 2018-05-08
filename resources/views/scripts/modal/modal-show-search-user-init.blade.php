<script type="text/javascript">
    $(document).ready(function(e) {

        //Remove the input errors and empty all the input fields when the modal has been closed
        $('#{{$modalid}}').on('hidden.bs.modal', function () {
        	hideLoader();
        });

        //Click on the agenda item
        $( "#{{$modalid}}" ).on('shown.bs.modal', function(e){
			$('#email_field').focus();
        });
    });
</script>