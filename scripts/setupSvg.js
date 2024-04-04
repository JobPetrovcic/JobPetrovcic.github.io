// append the svg object to the body of the page
// appends a 'group' element to 'svg'
var svg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', [-width / 2, -height / 2, width, height]) // set the viewbox so that the origin is in the middle
  .call(
    d3.zoom().on('zoom', function (d) {
      svg.attr('transform', d.transform)
    })
  )
  .append('g')

//var optionsMenu = d3.select("body").append("div").attr('class', 'optionsMenu')
//var inputShowOnlyNecessary = optionsMenu
//  .append('label')
//      .attr('for',function(d,i){ return 'a'+i; })
//      .text('Show only necessary links (recommended when viewing a large number of nodes):')
//  .append("input")
//      .attr("type", "checkbox")
//      .attr("id", function(d,i) { return 'a'+i; })
//      .attr("onClick", "change(this)");