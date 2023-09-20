const tooltips = document.querySelectorAll('.tooltip');
const questionCircles = document.querySelectorAll('.fa-question-circle');

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('fa-question-circle')) {
    const tooltip = event.target.closest('.tooltip');
    tooltip.classList.toggle('active');
    questionCircles.forEach((questionCircle) => {
      if (questionCircle === event.target) {
        const currentColor = questionCircle.style.color;
        const newColor = currentColor === 'rgb(54, 54, 54)' ? '#696969' : '#363636';
        questionCircle.style.color = newColor;
      } else {
        questionCircle.style.color = '#696969';
      }
    });
  } else {
    tooltips.forEach((tooltip) => {
      tooltip.classList.remove('active');
    });
    questionCircles.forEach((questionCircle) => {
      questionCircle.style.color = '#696969';
    });
  }
});