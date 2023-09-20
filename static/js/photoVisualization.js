function photoViz(photos) {

  $('#label').val('all');

  const photoDiv = document.getElementById('photo-viz');
  const labelSelect = document.getElementById('label');
  // clear the div's content
  photoDiv.innerHTML = '';

  
  // group the photos by their corresponding name using an object
  const photosByNames = {};
  
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const photoId = photo.photo_id;
    const name = photo.name;
    const caption = photo.caption;
    const label = photo.label;

    if (!photosByNames[name]) {
      photosByNames[name] = [];
    }

    photosByNames[name].push({
      photoId,
      caption,
      label
    });

  }

  // calculate the width of each column based on the number of unique names
  const numColumns = Object.keys(photosByNames).length;
  const columnWidth = 100 / numColumns;

  // create a container div for the columns
  const containerDiv = document.createElement('div');
  containerDiv.style.display = 'flex';
  containerDiv.style.marginLeft = '30px';

  // define an array of colors to use for the squares
  const colors = ['#CD6839', '#8FBC8F', '#FFB90F', '#5CACEE', '#8B7E66', '#DDA0DD', '#FFEC8B', '#79CDCD', '#F4A460', '#CDC8B1'];

  // keep track of the current color index
  let colorIndex = 0;


/*****************************************  PHOTO  ******************************************/ 

  // loop through the object keys to create a column for each name
  for (const name in photosByNames) {
    // create a div for the column
    const columnDiv = document.createElement('div');
    columnDiv.classList.add('photo-column');
    columnDiv.style.width = `${columnWidth}%`;

    // create a div for the name and the colored square
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('name-div');

    // create a text node with a space character
    const space = document.createTextNode(' ');
    const linebreak = document.createElement('br');

    // create a colored square for the name
    const squareElement = document.createElement('i');
    squareElement.classList.add('fas', 'fa-square', 'fa-sm');
    squareElement.style.color = colors[colorIndex];

    // append the square and the name to the name div
    nameDiv.appendChild(squareElement);
    nameDiv.appendChild(space);
    nameDiv.appendChild(document.createTextNode(name));
    nameDiv.appendChild(linebreak);


    // increment the color index
    colorIndex = (colorIndex + 1) % colors.length;

    // append the name div to the column div
    columnDiv.appendChild(nameDiv);

    // ljsuoop through the photos in this column
    const photosInColumn = photosByNames[name];

    for (let i = 0; i < photosInColumn.length; i++) {
      const photo = photosInColumn[i];
      const photoId = photo.photoId;
      const caption = photo.caption;

      // Create a div for the photo
      const photoDiv = document.createElement('div');
      photoDiv.classList.add('card');

      // Create an img tag with the source set to the image file path
      const imgElement = document.createElement('img');
      imgElement.src = `static/photos/${photoId}.jpg`;

      // Create a div to hold the caption
      const captionElement = document.createElement('div');
      captionElement.classList.add('caption');
      captionElement.textContent = caption;

      // Append the img and caption divs to the photo div
      photoDiv.appendChild(imgElement);
      photoDiv.appendChild(captionElement);

      // Append the photo div to the column div
      columnDiv.appendChild(photoDiv);
    }

    // Append the column div to the container div
    containerDiv.appendChild(columnDiv);
  }

  // Append the container div to the photo_viz div
  photoDiv.appendChild(containerDiv);


/*****************************************  PHOTO  ******************************************/ 

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  FILTER REVIEWS BY LABEL  ******************************************/ 

  labelSelect.addEventListener('change', () => {

    const selectedValue = labelSelect.value;
  
    for (const name in photosByNames) {
      const photosInColumn = photosByNames[name];
  
      for (let i = 0; i < photosInColumn.length; i++) {
        const photo = photosInColumn[i];
  
        // img element for the current photo
        const imgElement = document.querySelector(`[src="static/photos/${photo.photoId}.jpg"]`);
  
        // the card element for the current photo
        const cardElement = imgElement.parentNode;
  
        // the caption element for the current photo
        const captionElement = cardElement.querySelector('.caption');
  
        // check if the photo should be shown
        if (selectedValue === 'all' || photo.label === selectedValue) {
          // show the photo, card, and caption
          imgElement.style.display = 'block';
          cardElement.style.display = 'block';
          captionElement.style.display = 'block';

        } else {
          // hide the photo, card, and caption
          imgElement.style.display = 'none';
          cardElement.style.display = 'none';
          captionElement.style.display = 'none';
        }
      }
    }
  });
  
/*****************************************  FILTER REVIEWS BY LABEL  ******************************************/ 

}
