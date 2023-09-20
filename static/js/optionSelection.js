function optionList() {
    
    var options = $('#option-selection').val();

    $.ajax({
        url: '/',
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'business': options}),
        success: function(response){
            updateConsequenceTable(options);
            reviewsViz(response['reviews_response']);
            mapViz(response['business_info_response']);
            photoViz(response['photos_response']);
        },
        error: function( jqXhr, textStatus, errorThrown ){
            console.log(errorThrown);
        }
    })

}

