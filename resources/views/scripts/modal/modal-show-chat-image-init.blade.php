<script type="text/javascript">
    $(document).ready(function(e) {

        //Remove the input errors and empty all the input fields when the modal has been closed
        $('#modal-chat-image').on('hidden.bs.modal', function () {
            $(this).find("img").attr("src", "");
        });

        $(document).on('shown.bs.modal', '#modal-chat-image', function (event) {
            //Get the clicked image
            var image = $(event.relatedTarget).find('img').attr("src");
            
            //Set the image
            $(this).find("img").attr("src", image);
        });

        // //Click on the agenda item
        // $( "#modal-chat-image" ).on('shown.bs.modal', function(e){

        //     //Get the listId of the active list
        //     var image = $(this).find("img").attr("src");
        //     console.log(image);
        // });
    });
</script>