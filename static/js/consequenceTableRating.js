function rating() {

  $('.fa-star').click(function() {

    // reset all stars' color to lightgrey
    $(this).siblings().addBack().css('color', 'lightgrey');

    // set the color of clicked star and its preceding stars to gold
    $(this).prevAll().addBack().css('color', '#F4AE6C');

    // set the data-rating attribute of the parent container to the selected star's index + 1
    $(this).parent().attr('data-rating', $(this).prevAll().length + 1);

  });
  
}

   
