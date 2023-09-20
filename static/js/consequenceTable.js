var previousOptions = [];

function updateConsequenceTable(options) {
  console.log('Current list of options:', options.length, options);

  // check if the options have changed
  var table = document.getElementById('table');
  var header = table.rows[0];
  var colors = ['#CD6839', '#8FBC8F', '#FFB90F', '#5CACEE', '#8B7E66', '#DDA0DD', '#FFEC8B', '#79CDCD', '#F4A460', '#CDC8B1'];

  // clear existing table headers
  if (header.cells.length != 0) {
    $('#table th').remove();
  }

  // add default headers (+, objective)
  var th_index0 = document.createElement('th');
  var plusIcon = document.createElement('i');
  plusIcon.className = 'fas fa-plus-circle';
  plusIcon.onclick = function() {
    addRow(options);
  };
  th_index0.appendChild(plusIcon);
  header.appendChild(th_index0);

  var th_index1 = document.createElement('th');
  th_index1.innerHTML = 'Objective';
  header.appendChild(th_index1);

  for (var i = 0; i < options.length; ++i) {
    var th = document.createElement('th');
    th.innerHTML = `<i class="fas fa-square fa-sm" style="color:${colors[i]}"></i>` + '   ' + options[i];
    th.style.padding = '3px 15px';
    header.appendChild(th);
  }
  

  // compare previous options with current options
  compareOptions(previousOptions, options);

  // update the previous options array
  previousOptions = options.slice();
}

/*****************************************  ADD ROW FUNCTION  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  COMPAREING  ******************************************/

function compareOptions(previousOptions, options) {
  console.log('Previous list of options:', previousOptions.length, previousOptions);
  console.log('Current list of options:', options.length, options);

  // check if the table has any 'td' elements
  var table = document.getElementById('table');
  var hasTD = table.getElementsByTagName('td').length > 0;

  // move existing 'td' elements and their corresponding rating containers
  previousOptions.forEach((prevOption, prevIndex) => {

    if (options.includes(prevOption)) {
      // find the new index of the option in the current options array
      var newIndex = options.indexOf(prevOption);
      if (newIndex !== prevIndex) {
        // move the 'td' element and its rating container to the new position
        moveRatingContainer(prevOption, prevIndex, newIndex);
      }

    } else {
      // delete 'td' element and its rating container
      deleteRatingContainer(prevOption);
    }

  });

  // add new rating containers and 'td' elements
  options.forEach((option, index) => {

    if (!previousOptions.includes(option)) {

      if (hasTD) {
        addRatingContainer(option, index + 2);
      }
    }
  });
}
/*****************************************  COMPAREING  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  DELETE RATING CONTAINER  ******************************************/

function deleteRatingContainer(option) {
  var table = document.getElementById('table');
  var rows = table.rows;

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var tdIndexToDelete = [];

    for (var j = 2; j < row.cells.length; j++) {
      var td = row.cells[j];
      var ratingContainer = td.querySelector(`div[id="${option}"]`);

      if (ratingContainer) {
        tdIndexToDelete.push(j);
      }
    }

    // delete the 'td' elements in reverse order to avoid index issues
    for (var k = tdIndexToDelete.length - 1; k >= 0; k--) {
      var index = tdIndexToDelete[k];
      row.deleteCell(index);
    }

    console.log(`Deleted rating containers and corresponding 'td' elements with ID: ${option}`);
  }
}

/*****************************************  DELETE RATING CONTAINER  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  MOVE RATING CONTAINER  ******************************************/


function moveRatingContainer(option, prevIndex, newIndex) {
  var table = document.getElementById('table');
  var rows = table.rows;
  var ratingContainers = document.getElementsByClassName('rating-container');

  for (var i = 2; i < rows.length; i++) {

    var row = rows[i];
    var prevTD = row.cells[prevIndex + 2];
    var newTD = row.cells[newIndex + 12];

    if (prevTD && newTD) {
      var ratingContainer = prevTD.querySelector(`div[id="${option}"]`) || prevTD.querySelector(`div[class="${option}"]`);

      if (ratingContainer) {
        // move the rating container to the new 'td' under 'th'
        newTD.appendChild(ratingContainer);
        console.log(`Moved rating container with ID ${option} from column ${prevIndex} to column ${newIndex}`);
        break;
      }
    }
  }
}

/*****************************************  MOVE RATING CONTAINER  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  ADD RATING CONTAINER  ******************************************/

function addRatingContainer(option, columnIndex) {
  var table = document.getElementById('table');
  var rows = table.rows;

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var td = row.insertCell(columnIndex);

    td.innerHTML = `<div class="rating-container" id="${option}" 
    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
      <i class="fas fa-star fa-xs"></i>
      <i class="fas fa-star fa-xs"></i>
      <i class="fas fa-star fa-xs"></i>
      <i class="fas fa-star fa-xs"></i>
      <i class="fas fa-star fa-xs"></i>
    </div>`;

    console.log(`Added rating container with ID: ${option}`);
  }

  rating();
}


