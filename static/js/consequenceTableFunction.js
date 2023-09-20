/*****************************************  ADD ROW FUNCTION  ******************************************/

function addRow(options) {

    var table = document.getElementById('table');
    var headerLength = table.rows[0].cells.length;
    
    // insert a row at the end of the table
    var insertRow = table.insertRow(-1);
  
    for (var i = 0; i < headerLength; ++i) {
      var td = insertRow.insertCell(i);
      
      if (i === 0) {
        td.innerHTML = '<i class="fas fa-minus-circle" onclick="removeRow(this)"></i>';
        td.style.color = '#CDC0B0';
        td.style.fontSize = '25px';
        td.style.padding = '3px 10px';
        td.style.transition = '0.3s ease-in-out';

      } else if (i === 1) {

        td.innerHTML = '<input type="text" class="form-control" placeholder="Set your criteria" style="width: 160px; height: 35px; font-size: 13pt;"/>';
        td.style.textAlign = 'left';
        td.style.padding = '3px 16px';

      } else {
          
        var ratingContainer = `<div class="rating-container" id="${options[i - 2]}" 
        style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          <i class="fas fa-star fa-xs"></i>
          <i class="fas fa-star fa-xs"></i>
          <i class="fas fa-star fa-xs"></i>
          <i class="fas fa-star fa-xs"></i>
          <i class="fas fa-star fa-xs"></i>
        </div>`;
        
        td.innerHTML = ratingContainer;
        td.style.padding = '3px 15px';
        
        console.log(ratingContainer);
      }
    }
  
    rating();
  }
  
/*****************************************  ADD ROW FUNCTION  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  REMOVE ROW FUNCTION  ******************************************/


let removeRow = (removeButton) => {
    var row = removeButton.parentNode.parentNode; // get the parent row of the remove button
    var table = row.parentNode; // get the parent table

    // delete the row
    table.deleteRow(row.rowIndex);
}



/*****************************************  REMOVE ROW FUNCTION  ******************************************/
