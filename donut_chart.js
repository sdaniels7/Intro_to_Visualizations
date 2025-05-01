<script>
// Assuming you have your pie layout and arc generator defined
const pie = d3.pie().value(d => d.value).sort(null);
const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

// Bind data and create paths
const paths = svg.selectAll('path')
  .data(pie(data));

// Enter new arcs
paths.enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', d => color(d.data.label))
  .each(function(d) { this._current = d; }) // store the initial angles
  .transition()
  .duration(1000)
  .attrTween('d', function(d) {
    const interpolate = d3.interpolate(this._current, d);
    this._current = interpolate(1);
    return function(t) {
      return arc(interpolate(t));
    };
  });

// Update existing arcs
paths.transition()
  .duration(1000)
  .attrTween('d', function(d) {
    const interpolate = d3.interpolate(this._current, d);
    this._current = interpolate(1);
    return function(t) {
      return arc(interpolate(t));
    };
  });

// Remove old arcs
paths.exit().remove();

</script>
