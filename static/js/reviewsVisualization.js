function reviewsViz(data) {
  
  console.log('Successfully received data from database : ', data, typeof data)
  
  $('#reviews-input').val('');
  $('.viz-notice-text').remove();

/*****************************************  UPDATING VIZ  ******************************************/  
  
  var previousData = null; 

  // update the viz
  if (previousData !== data) {
    d3.select('#reviews-viz').selectAll('svg').remove();
    console.log('new data received!');
  }

  // Update previousData with the current value of data
  previousData = data; 


/*****************************************  UPDATING VIZ ******************************************/  

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  VARIABLE SETTING  ******************************************/  

  // set the dimensions and margins of the graph
  var margin = {top: 40, right: 20, bottom: 50, left: 60},
  width = 680 - margin.left - margin.right,
  height = 470 - margin.top - margin.bottom;
  
  // color of groups
  var colors = d3.scaleOrdinal().range(['#CD6839', '#8FBC8F', '#FFB90F', '#5CACEE', '#8B7E66', '#DDA0DD', '#FFEC8B', '#79CDCD', '#F4A460', '#CDC8B1'])

  // tooltip for each point in scatter scatter plot
  const tooltip = d3.select('#reviews-viz')
  .append('div')
  .style('position', 'absolute')
  .style('opacity', 0)
  .attr('class', 'tooltip-scatter')
  .style('visibility', 'hidden')
  .style('background-color', 'white')
  .style('border', 'solid')
  .style('border-color', '#8B8989')
  .style('color', 'black')
  .style('border-width', '4px')
  .style('border-radius', '5px')
  .style('padding', '12px')


  // append the svg object
  var svg = d3.select('#reviews-viz')
  .append('svg')
  .attr('viewBox', '0 0 ' + (width + margin.left + margin.right) + ' ' + (height + margin.top + margin.bottom + 300))
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .style('max-width', '100%')
  .style('height', 'auto')
  .call(d3.zoom().scaleExtent([0.5, 10]).on('zoom', zoomed))
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  var svgGroup = svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  // date format
  data.forEach(function (d) {
    let parseDate = d3.timeParse('%Y-%m-%d');
    d.date = parseDate(d.date);
  });


  // nest data to display the dynamic legend
  var nestData = d3.group(data, d => d.name)
  console.log('nest data :', nestData)

/*****************************************  VARIABLE SETTING  ******************************************/ 

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  X AXIS & Y AXIS  ******************************************/  

  // X axis
  var x = d3.scaleTime()
            .domain(d3.extent(data, function(d) {return d.date;}))
            .range([0, width]);  

  var xAxis = d3.axisBottom(x);
      
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  
  svg.append('text')
    .attr('text-anchor', 'end')
    .attr('x', width)
    .attr('y', height + 45)
    .text('Year')
    .style('font-size', '23px')
    .style('font-weight', 'bold')

  // Y axis
  var y = d3.scaleLinear()
          .domain([-1, 1])
          .range([height, 0]);
          
  var yAxis = d3.axisLeft(y);
  
  svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);

  svg.append('text')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 20)
    .attr('x', -margin.top - 55)
    .text('Sentiment Score')
    .style('font-size', '23px')
    .style('font-weight', 'bold')


/*****************************************  X AXIS & Y AXIS  ******************************************/ 

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  TRUNCATE TEXT AND ADD ELLIPSIS  ******************************************/ 

// Function to truncate text and add ellipsis
function truncatedText(text, maxLength) {
  if (!text || text.length === 0) {
    return '';
  }
  if (text.length <= maxLength) {
    return text;
  }
  return text.substr(0, maxLength) + ' ' + `<button class="expand-tooltip" style="font-size: 18px; color: blue; 
  border: none; background-color: transparent; text-decoration: underline;">.....</button>`;
}

/*****************************************  TRUNCATE TEXT AND ADD ELLIPSIS  ******************************************/ 

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  QUESTION TOOLTIP  ******************************************/ 

function positionTooltip(d, element) {

  const tooltipWidth = tooltip.node().offsetWidth;
  const tooltipHeight = tooltip.node().offsetHeight;

  const tooltipLeft = 10; // Adjust this value to set the left position
  let tooltipTop = parseInt(d3.select(element).attr('cy')) - tooltipHeight / 2;

  if (tooltipTop < 0) {
    tooltipTop = 10; // Adjust this value to set the top position
  } else if (tooltipTop + tooltipHeight > window.innerHeight) {
    tooltipTop = window.innerHeight - tooltipHeight - 10; // Adjust this value to set the bottom position
  }

  tooltip.style('left', tooltipLeft + 'px');
  tooltip.style('top', tooltipTop + 'px');

}

/*****************************************  QUESTION TOOLTIP  ******************************************/ 

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  DRAWING VIZ  ******************************************/

  let tooltipVisible = false;
  let lastClickedPoint = null;
  let date;

  // drawing scatter plot
  scatterPlot = svg.append('g')
  .selectAll('dot')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', function(d) { return x(d.date); })
  .attr('cy', function(d) { return y(d.sentiment_polarity); })
  .attr('r', 5)
  .style('opacity', 0.6)
  .style('fill', function(d) { return colors(d.name); })
  .on('mouseover', function(event, d) {
    if (!tooltipVisible) {
      // only trigger the tooltip and size increase if no tooltip is currently visible
      tooltip
        .style('opacity', 1)
        .style('left', d3.select(this).attr('cx') + 'px')
        .style('top', d3.select(this).attr('cy') + 'px')
        .style('visibility', 'visible');

      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 10)
        .style('fill', function(d) { return colors(d.name); })
        .style('opacity', 1);
    }
  })
  .on('mousemove', function(event, d) {
    positionTooltip(d, this);
  
    if (!tooltipVisible) {
      var parse = new Date(d.date);
      date = parse.toLocaleDateString('en-US');
  
      tooltip
        .html(`Rating: ${d.stars}<br> -------------------- <br>${truncatedText(d.text, 100)} (Date: ${date})`)
        .style('visibility', 'visible');
    }
  })
  
  .on('mouseleave', function(event, d) {
    if (!tooltipVisible) {
      tooltip.style('visibility', 'hidden');

      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 5)
        .style('fill', function(d) { return colors(d.name); })
        .style('opacity', 0.6);
    }
  })
  .on('click', function(event, d) {
    event.stopPropagation();
  
    if (lastClickedPoint === this) {
      // clicked the same point again, hide the tooltip and return to original size
      tooltipVisible = false;
      tooltip.style('visibility', 'hidden');
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 5)
        .style('fill', function(d) { return colors(d.name); })
        .style('opacity', 0.6);
  
      lastClickedPoint = null;
    } else {
      // show the tooltip for the clicked point
      tooltipVisible = true;
      var parse = new Date(d.date);
      date = parse.toLocaleDateString('en-US');
  
      tooltip
        .html(`Rating: ${d.stars}<br> -------------------- <br>${truncatedText(d.text, 100)} (Date: ${date})`)
        .style('visibility', 'visible')
        .style('overflow', 'auto')
        .style('max-height', '300px')
        .style('left', '10px')
        .style('top', '10px');
  
      // handle the click event on the ellipsis button
      tooltip
        .selectAll('.expand-tooltip')
        .on('click', function(event) {
          tooltip.html(`Rating: ${d.stars}<br> -------------------- <br>${d.text} (Date: ${date})`);
          event.stopPropagation();
        });
  
      if (lastClickedPoint !== null) {
        // return the previously clicked point to its original size and opacity
        d3.select(lastClickedPoint)
          .transition()
          .duration(200)
          .attr('r', 5)
          .style('fill', function(d) { return colors(d.name); })
          .style('opacity', 0.6);
      }
      // increase the size and opacity of the clicked point
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 10)
        .style('fill', function(d) { return colors(d.name); })
        .style('opacity', 1);
  
      lastClickedPoint = this;
    }
  });

    // close the tooltip and return the last clicked point to its original size when clicking anywhere on the screen
    d3.select(document).on('click', function() {
      if (tooltipVisible) {
        // Hide the tooltip
        tooltipVisible = false;
        tooltip.style('visibility', 'hidden');
        if (lastClickedPoint !== null) {
          // Return the last clicked point to its original size and opacity
          d3.select(lastClickedPoint)
            .transition()
            .duration(200)
            .attr('r', 5)
            .style('fill', function(d) { return colors(d.name); })
            .style('opacity', 0.6);

          lastClickedPoint = null;
        }
      }
    });

  createLegend(nestData);



  // create legend
  function createLegend (nestData) {

    var legend = svg.selectAll('.legend')
        .data(nestData)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('font-family', 'sans-serif')
        .attr("font-size", 12)
        .attr("text-anchor", "start")
        .attr("transform", function(d, i) {              
          return "translate(0," + i * 20 + ")";
        });

    legend.append('rect')
      .attr('x', width - 655)
      .attr('y', height + 70)
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', function(d) {
      return colors(d[0]);
      });

    legend.append('text')
      .attr('x', width - 635)
      .attr('y', height + 75)
      .attr('dy', '.35em')
      .attr('font-weight', 'bold')
      .attr('font-size', '15px')
      .text(function(d) { return d[0] + ' ( number of reviews : ' + Object.keys(d[1]).length + '' + ' )'; });

  }

/*****************************************  DRAWING VIZ  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  FILTER REVIEWS BY KEYWORD  ******************************************/

  var scatterPlot;
  var matchFilterData;
  var keywordInput = document.getElementById('reviews-input');

  // Event listener for 'Enter' key press
  keywordInput.addEventListener('keypress', function(event) {
    
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission

      // Get the input value
      var input = keywordInput.value;
      console.log('Current input:', input);

      // Filter the data based on the input
      matchFilterData = data.filter(function(d) {
        return d.text.includes(input);
      });
      console.log('Data with filter:', matchFilterData);

      // Update the scatter plot with the filtered data
      scatterPlot.data(matchFilterData, function(d) {
          return d.index;
        })
        .style('fill', function(d) {
          return colors(d.name);
        })
        .style('opacity', 0.6)
        .style('visibility', 'visible')
        .on('mouseover', function(d) {
          tooltip
            .style('opacity', 1)
            .style('visibility', 'visible');
          d3.select(this)
            .attr('r', 10)
            .style('fill', function(d) {
              return colors(d.name);
            })
            .style('opacity', 1);
        })
        .on('mousemove', function(event, d) {
          var parse  = new Date(d.date);
          date = parse.toLocaleDateString("en-US")
    
            tooltip
            .html(`Rating: ${d.stars}<br>${truncatedText(d.text, 20)} (Date: ${date})`)
            .style('left', d3.select(this).attr('cx') + 'px')
            .style('top', d3.select(this).attr('cy') + 'px');
    
          // Handle click on ellipsis button in tooltip
          tooltip.select('.expand-tooltip').on('click', function() {
            tooltip.html(`Rating: ${d.stars}<br>${d.text} (Date: ${date})`);
            d3.event.stopPropagation();
          });
        })  
        .on('mouseleave', function(d) {
          tooltip.style('opacity', 0);
          d3.select(this)
            .attr('r', 5)
            .style('fill', function(d) {
              return colors(d.name);
            })
            .style('opacity', 0.6);
        });
    }
  });
/*****************************************  FILTER REVIEWS BY KEYWORD  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  FILTER REVIEWS BY SELECTION  ******************************************/

  var colorValues = ['#CD6839', '#8FBC8F', '#FFB90F', '#5CACEE', '#8B7E66', '#DDA0DD', '#FFEC8B', '#79CDCD', '#F4A460', '#CDC8B1'];

  var filterList = document.getElementById('filter');
  var defaultValues = $('#option-selection').val();

  $('#filter').empty();
  // Initialize Chosen plugin
  $('#filter').chosen({
    placeholder_text_multiple: 'select options...'
  });

  // Create a Set to store the unique names
  var uniqueNames = new Set();

  // Loop through the data and add the names to the Set
  for (var i = 0; i < data.length; i++) {
    var names = data[i].name;

    // If names is an array, loop through each name and add it to the Set
    if (Array.isArray(names)) {
      for (var j = 0; j < names.length; j++) {
        uniqueNames.add(names[j]);
      }
    }
    // If names is a single value, add it to the Set
    else {
      uniqueNames.add(names);
    }
  }

  // Convert the Set to an array
  var namesArray = Array.from(uniqueNames);

  // Populate the options in the #filter element
  for (var k = 0; k < namesArray.length; k++) {
    var option = document.createElement('option');
    option.value = namesArray[k];

    // Create a span element with the color square icon
    var colorSquare = document.createElement('i');
    colorSquare.className = 'fas fa-square fa-sm';
    colorSquare.style.marginRight = '5px'
    colorSquare.style.color = colorValues[k % colorValues.length];

    // Create a span element to hold the option value and color square
    var optionContent = document.createElement('span');
    optionContent.appendChild(colorSquare);
    optionContent.appendChild(document.createTextNode(namesArray[k]));

    // Append the option content to the option element
    option.appendChild(optionContent);

    filterList.appendChild(option);
  }

  $('#filter').val(defaultValues);
  $('#filter').trigger('chosen:updated');

/*****************************************  FILTER REVIEWS BY SELECTION  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  FILTER REVIEWS BY SELECTION AND KEYWORD ******************************************/

  // Event listener for changes in the #filter selection
  $('#filter').on('change', function() {
    var selectedOptions = $(this).val();
    var keywordInputValue = $('#reviews-input').val();
    // disable zoom behavior
    svg.on('.zoom', null);
    updateScatterPlot(selectedOptions, keywordInputValue);
    // reapply the zoom behavior
    svg.call(zoom);
  });

  // Event listener for input event on the keyword input
  $('#reviews-input').on('input', function() {
    var selectedOptions = $('#filter').val();
    var keywordInputValue = $(this).val();
    // disable zoom behavior
    svg.on('.zoom', null);
    updateScatterPlot(selectedOptions, keywordInputValue);
    // reapply the zoom behavior
    svg.call(zoom);
  });


  // updating scatter plot 
function updateScatterPlot(selectedOptions, keywordInputValue) {

  let tooltipVisible = false;
  let lastClickedPoint = null;
  let date;

  // filter the data based on the selected options and keyword input
  var filteredData = data.filter(function(item) {
    return (
      selectedOptions.includes(item.name) &&
      item.text.toLowerCase().includes(keywordInputValue.toLowerCase())
    );
  });

  nestfilteredData = d3.group(filteredData, d => d.name);

  svg.selectAll('circle').remove();
  svg.selectAll('.legend').remove();

  // drawing scatter plot
  scatterPlot = svg.append('g')
  .selectAll('dot')
  .data(filteredData)
  .enter()
  .append('circle')
  .attr('cx', function(d) { return x(d.date); })
  .attr('cy', function(d) { return y(d.sentiment_polarity); })
  .attr('r', 5)
  .style('opacity', 0.6)
  .style('fill', function(d) { return colors(d.name); })
  .on('mouseover', function(event, d) {
    if (!tooltipVisible) {
      // only trigger the tooltip and size increase if no tooltip is currently visible
      tooltip
        .style('opacity', 1)
        .style('left', d3.select(this).attr('cx') + 'px')
        .style('top', d3.select(this).attr('cy') + 'px')
        .style('visibility', 'visible');

      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 10)
        .style('fill', function(d) { return colors(d.name); })
        .style('opacity', 1);
    }
  })
  .on('mousemove', function(event, d) {
    positionTooltip(d, this);
  
    if (!tooltipVisible) {
      var parse = new Date(d.date);
      date = parse.toLocaleDateString('en-US');
  
      tooltip
        .html(`Rating: ${d.stars}<br> -------------------- <br>${truncatedText(d.text, 100)} (Date: ${date})`)
        .style('visibility', 'visible');
    }
  })
  
  .on('mouseleave', function(event, d) {
    if (!tooltipVisible) {
      tooltip.style('visibility', 'hidden');

      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 5)
        .style('fill', function(d) { return colors(d.name); })
        .style('opacity', 0.6);
    }
  })
  .on('click', function(event, d) {
    event.stopPropagation();
  
    if (lastClickedPoint === this) {
      // clicked the same point again, hide the tooltip and return to original size
      tooltipVisible = false;
      tooltip.style('visibility', 'hidden');
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 5)
        .style('fill', function(d) { return colors(d.name); })
        .style('opacity', 0.6);
  
      lastClickedPoint = null;
    } else {
      // show the tooltip for the clicked point
      tooltipVisible = true;
      var parse = new Date(d.date);
      date = parse.toLocaleDateString('en-US');
  
      tooltip
        .html(`Rating: ${d.stars}<br> -------------------- <br>${truncatedText(d.text, 100)} (Date: ${date})`)
        .style('visibility', 'visible')
        .style('overflow', 'auto')
        .style('max-height', '300px')
        .style('left', '10px')
        .style('top', '10px');
  
      // handle the click event on the ellipsis button
      tooltip
        .selectAll('.expand-tooltip')
        .on('click', function(event) {
          tooltip.html(`Rating: ${d.stars}<br> -------------------- <br>${d.text} (Date: ${date})`);
          event.stopPropagation();
        });
  
      if (lastClickedPoint !== null) {
        // return the previously clicked point to its original size and opacity
        d3.select(lastClickedPoint)
          .transition()
          .duration(200)
          .attr('r', 5)
          .style('fill', function(d) { return colors(d.name); })
          .style('opacity', 0.6);
      }
      // increase the size and opacity of the clicked point
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 10)
        .style('fill', function(d) { return colors(d.name); })
        .style('opacity', 1);
  
      lastClickedPoint = this;
    }
  });

    // close the tooltip and return the last clicked point to its original size when clicking anywhere on the screen
    d3.select(document).on('click', function() {
      if (tooltipVisible) {
        // Hide the tooltip
        tooltipVisible = false;
        tooltip.style('visibility', 'hidden');
        if (lastClickedPoint !== null) {
          // Return the last clicked point to its original size and opacity
          d3.select(lastClickedPoint)
            .transition()
            .duration(200)
            .attr('r', 5)
            .style('fill', function(d) { return colors(d.name); })
            .style('opacity', 0.6);

          lastClickedPoint = null;
        }
      }
    });


    // close the tooltip and return the last clicked point to its original size when clicking anywhere on the screen
    d3.select(document).on('click', function() {
      if (tooltipVisible) {
        // Hide the tooltip
        tooltipVisible = false;
        tooltip.style('visibility', 'hidden');
        if (lastClickedPoint !== null) {
          // Return the last clicked point to its original size and opacity
          d3.select(lastClickedPoint)
            .transition()
            .duration(200)
            .attr('r', 5)
            .style('fill', function(d) { return colors(d.name); })
            .style('opacity', 0.6);

          lastClickedPoint = null;
        }
      }
    });

  createLegend(nestfilteredData);
  createPercentage(filteredData)
} 

// call percentage function
createPercentage(data)
/*****************************************  FILTER REVIEWS BY SELECTION AND KEYWORD ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  ZOOM IN/OUT & DRAG of SCATTER PLOT  ******************************************/

  var zoom = d3.zoom()
  .scaleExtent([0.5, 10])
  .on('zoom', zoomed);

  function zoomed(event) {

    var transform = event.transform;
    var newXScale = transform.rescaleX(x);
    var newYScale = transform.rescaleY(y);
    svgGroup.attr('transform', event.transform);
  
    // update the x-axis and restrict the visible range
    svg.select('.x-axis')
    .call(xAxis.scale(newXScale));

    // update the y-axis and restrict the visible range
    svg.select('.y-axis')
    .call(yAxis.scale(newYScale));

    // Update the scatter plot points
    scatterPlot.attr('cx', function(d) {
      
      var xVal = newXScale(d.date);
      return xVal < 0 || xVal > width ? -9999 : xVal; // hide points outside the visible range

    }).attr('cy', function(d) {

      var yVal = newYScale(d.sentiment_polarity);
      return yVal < 0 || yVal > height ? -9999 : yVal; // hide points outside the visible range

    });

    console.log('Zoom event triggered');
  }
  
  
  svg.call(zoom);

/*****************************************  ZOOM IN/OUT of SCATTER PLOT  ******************************************/

/*------------------------------------------------------------------------------------------------------------------*/

/*****************************************  BAR CHART FOR SENTIMENT SCORE  ******************************************/

function createPercentage(data) {

  // remove the existing bars and labels
  d3.selectAll('.chart-container').remove();

  // initialize the barData array
  var barData = [];

  // Iterate through the data
  data.forEach(function(d) {
    // calculate the quantity and percentage for positive and negative sentiment
    var positiveQuantity = 0;
    var negativeQuantity = 0;

    if (d.sentiment_polarity > 0) {
      positiveQuantity++;
    } else if (d.sentiment_polarity < 0) {
      negativeQuantity++;
    }

    var totalQuantity = positiveQuantity + negativeQuantity;

    var positivePercentage = (positiveQuantity / totalQuantity) * 100;
    var negativePercentage = (negativeQuantity / totalQuantity) * 100;

    // check if the barData array already contains an entry for the current d.name
    var existingDataIndex = barData.findIndex(function(item) {
      return item.name === d.name;
    });

    if (existingDataIndex > -1) {
      // update existing data with new positive and negative quantities and percentages
      barData[existingDataIndex].quantity.positive += positiveQuantity;
      barData[existingDataIndex].quantity.negative += negativeQuantity;
      barData[existingDataIndex].percentage.positive = (barData[existingDataIndex].quantity.positive / totalQuantity) * 100;
      barData[existingDataIndex].percentage.negative = (barData[existingDataIndex].quantity.negative / totalQuantity) * 100;
    } else {
      // add new data for the d.name
      barData.push({
        name: d.name,
        quantity: {
          positive: positiveQuantity,
          negative: negativeQuantity
        },
        percentage: {
          positive: positivePercentage,
          negative: negativePercentage
        }
      });
    }
  });

  // calculate the total percentage (100%)
  var totalPercentage = barData.reduce(function(acc, d) {
    return acc + d.percentage.positive + d.percentage.negative;
  }, 0);

  var maxQuantity = d3.max(barData, function(d) { return Math.abs(d.quantity.positive) + Math.abs(d.quantity.negative); });
  var maxBarWidth = Math.abs(width - 640);
  var barHeight = 20;  // adjust the height of each bar

  var barWidthScale = d3.scaleLinear()
  .domain([-maxQuantity, maxQuantity])
  .range([0, maxBarWidth]);

  var legendOffsetX = width - 540;
  var legendOffsetY = height + 75;

  var barOffsetX = legendOffsetX + 430;
  var barOffsetY = legendOffsetY - 10;

  // create a container for each chart
  var chartContainer = svg.selectAll('.chart-container')
    .data(barData)
    .enter()
    .append('g')
    .attr('class', 'chart-container')
    .attr('transform', function(d, i) {
      var x = 0;
      var y = i * (barHeight + 1); // Adjust the vertical spacing between charts as needed
      return 'translate(' + x + ',' + y + ')';
    });


  // Calculate maxBarWidth and totalPercentage for each chart
  chartContainer.each(function(d) {
    var chartMaxQuantity = Math.max(Math.abs(d.quantity.positive), Math.abs(d.quantity.negative));
    d.maxBarWidth = Math.abs(barWidthScale(chartMaxQuantity));
    d.totalPercentage = d.percentage.positive + d.percentage.negative;
  });


  
/* diverging bar chart */
  // add text labels for the bars
  var labels = chartContainer.selectAll('.label')
  .data(function(d) {
    return [d];
  })
  .enter()
  .append('g')
  .attr('class', 'label')
  .attr('transform', function(d, i) {
    var x = barOffsetX - d.maxBarWidth - 5;
    var y = barOffsetY + (i * (barHeight + 5)); // Adjust the vertical spacing between labels and bars as needed
    return 'translate(' + x + ',' + y + ')';
  });

  labels.each(function(d) {
  var negativeBarWidth = (d.percentage.negative / d.totalPercentage) * d.maxBarWidth;
  var positiveBarWidth = (d.percentage.positive / d.totalPercentage) * d.maxBarWidth;

  d3.select(this)
    .append('text')
    .attr('class', 'quantity')
    .attr('text-anchor', 'end')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .attr('fill', '#000')
    .attr('dy', '1.2em')
    .attr('dx', function() {
      var labelOffset = -24; 
      return -(negativeBarWidth + labelOffset);
    })
    .text(function() {
      var negativePercentage = (Math.abs(d.quantity.negative) / (Math.abs(d.quantity.negative) + Math.abs(d.quantity.positive))) * 100;
      return negativePercentage.toFixed(1) !== "0.0" ? '(' + negativePercentage.toFixed(1) + '%) Negative ' : '';
    });

  d3.select(this)
    .append('text')
    .attr('class', 'quantity')
    .attr('text-anchor', 'start')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 12)
    .attr('fill', '#000')
    .attr('dy', '1.2em')
    .attr('dx', function() {
      var labelOffset = 46; 
      return positiveBarWidth + labelOffset;
    })
    .text(function() {
      var positivePercentage = (Math.abs(d.quantity.positive) / (Math.abs(d.quantity.negative) + Math.abs(d.quantity.positive))) * 100;
      return positivePercentage.toFixed(1) !== "0.0" ? ' Positive (' + positivePercentage.toFixed(1) + '%)' : '';
    });
  });

  
  // create the negative bar chart
  var negativeBar = chartContainer.selectAll('.negative-bar')
  .data(function(d) {
    return [d];
  })
  .enter()
  .append('rect')
  .attr('class', 'negative-bar')
  .attr('x', function(d) { return barOffsetX - (d.percentage.negative / d.totalPercentage) * d.maxBarWidth; })
  .attr('y', function(d, i) { return barOffsetY + (i * barHeight); })
  .attr('width', function(d) { return (d.percentage.negative / d.totalPercentage) * d.maxBarWidth; })
  .attr('height', barHeight - 4)
  .style('fill', '#F5B9B2')
  .style('display', function(d) { return d.percentage.negative > 0 ? null : 'none'; });

  // create the positive bar chart
  var positiveBar = chartContainer.selectAll('.positive-bar')
  .data(function(d) {
    return [d];
  })
  .enter()
  .append('rect')
  .attr('class', 'positive-bar')
  .attr('x', barOffsetX)
  .attr('y', function(d, i) { return barOffsetY + (i * barHeight); })
  .attr('width', function(d) { return (d.percentage.positive / d.totalPercentage) * d.maxBarWidth; })
  .attr('height', barHeight - 4)
  .style('fill', '#C5ECC6')
  .style('display', function(d) { return d.percentage.positive > 0 ? null : 'none'; });
  }

}

