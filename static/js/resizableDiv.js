// document.addEventListener('DOMContentLoaded', function() {

//   var objectiveDiv = document.getElementById('objective-div');
//   var vizDiv = document.getElementById('viz-div');
//   var startX = 0;
//   var startObjectiveWidth = 0;
//   var startVizWidth = 0;

  
//   // event listener for mousedown on objectiveDiv
//   objectiveDiv.addEventListener('mousedown', function(event) {

//     startX = event.clientX;
//     startObjectiveWidth = parseInt(document.defaultView.getComputedStyle(objectiveDiv).width, 10);
//     startVizWidth = parseInt(document.defaultView.getComputedStyle(vizDiv).width, 10);
//     document.documentElement.addEventListener('mousemove', resizeDiv);
//     document.documentElement.addEventListener('mouseup', stopResizeDiv);
//     objectiveDiv.classList.add('draggable');

//   });


//   // event listener for mousedown on vizDiv
//   vizDiv.addEventListener('mousedown', function(event) {
      
//     startX = event.clientX;
//     startObjectiveWidth = parseInt(document.defaultView.getComputedStyle(objectiveDiv).width, 10);
//     startVizWidth = parseInt(document.defaultView.getComputedStyle(vizDiv).width, 10);
//     document.documentElement.addEventListener('mousemove', resizeDivReverse);
//     document.documentElement.addEventListener('mouseup', stopResizeDiv);

//   });

//   // resize objectiveDiv and vizDiv
//   function resizeDiv(event) {

//     var widthDiff = event.clientX - startX;
//     var newObjectiveWidth = (startObjectiveWidth + widthDiff) + 'px';
//     var newVizWidth = (startVizWidth - widthDiff) + 'px';
//     objectiveDiv.style.width = newObjectiveWidth;
//     vizDiv.style.width = newVizWidth;
//     vizDiv.style.left = newObjectiveWidth;

//   }


//   // resize objectiveDiv and vizDiv in reverse direction
//   function resizeDivReverse(event) {

//     var widthDiff = startX - event.clientX;
//     var newObjectiveWidth = (startObjectiveWidth - widthDiff) + 'px';
//     var newVizWidth = (startVizWidth + widthDiff) + 'px';
//     objectiveDiv.style.width = newObjectiveWidth;
//     vizDiv.style.width = newVizWidth;
//     vizDiv.style.left = newObjectiveWidth;

//   }


//   // stop resizing
//   function stopResizeDiv() {

//     document.documentElement.removeEventListener('mousemove', resizeDiv);
//     document.documentElement.removeEventListener('mousemove', resizeDivReverse);
//     document.documentElement.removeEventListener('mouseup', stopResizeDiv);
//     objectiveDiv.classList.remove('draggable');
//   }

// });
document.addEventListener('DOMContentLoaded', function() {
  var objectiveDiv = document.getElementById('objective-div');
  var vizDiv = document.getElementById('viz-div');
  var startX = 0;
  var startObjectiveWidth = 0;
  var startVizWidth = 0;
  var isDragging = false;

  // event listener for mousedown on objectiveDiv
  objectiveDiv.addEventListener('mousedown', function(event) {
    startX = event.clientX;
    startObjectiveWidth = parseInt(document.defaultView.getComputedStyle(objectiveDiv).width, 10);
    startVizWidth = parseInt(document.defaultView.getComputedStyle(vizDiv).width, 10);
    document.documentElement.addEventListener('mousemove', resizeDiv);
    document.documentElement.addEventListener('mouseup', stopResizeDiv);
    objectiveDiv.classList.add('draggable');
    event.stopPropagation();
  });

  // event listener for mousedown on vizDiv
  vizDiv.addEventListener('mousedown', function(event) {
    if (!event.target.classList.contains('draggable-element')) {
      startX = event.clientX;
      startObjectiveWidth = parseInt(document.defaultView.getComputedStyle(objectiveDiv).width, 10);
      startVizWidth = parseInt(document.defaultView.getComputedStyle(vizDiv).width, 10);
      document.documentElement.addEventListener('mousemove', resizeDivReverse);
      document.documentElement.addEventListener('mouseup', stopResizeDiv);
      isDragging = true;
      event.stopPropagation();
    }
  });

  // resize objectiveDiv and vizDiv
  function resizeDiv(event) {
    var widthDiff = event.clientX - startX;
    var newObjectiveWidth = (startObjectiveWidth + widthDiff) + 'px';
    var newVizWidth = (startVizWidth - widthDiff) + 'px';
    objectiveDiv.style.width = newObjectiveWidth;
    vizDiv.style.width = newVizWidth;
    vizDiv.style.left = newObjectiveWidth;
    event.stopPropagation();
  }

  // resize objectiveDiv and vizDiv in reverse direction
  function resizeDivReverse(event) {
    var widthDiff = startX - event.clientX;
    var newObjectiveWidth = (startObjectiveWidth - widthDiff) + 'px';
    var newVizWidth = (startVizWidth + widthDiff) + 'px';
    objectiveDiv.style.width = newObjectiveWidth;
    vizDiv.style.width = newVizWidth;
    vizDiv.style.left = newObjectiveWidth;
    event.stopPropagation();
  }

  // stop resizing
  function stopResizeDiv() {
    document.documentElement.removeEventListener('mousemove', resizeDiv);
    document.documentElement.removeEventListener('mousemove', resizeDivReverse);
    document.documentElement.removeEventListener('mouseup', stopResizeDiv);
    objectiveDiv.classList.remove('draggable');
    isDragging = false;
  }

  // event listener for mousemove on vizDiv
  vizDiv.addEventListener('mousemove', function(event) {
    if (isDragging) {
      event.stopPropagation();
    }
  });
});
