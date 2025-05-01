<javascript>
  <script>
    d3.csv("FinalAggregatedDataset.csv")
      .then(function (data) {
        console.log(data); // See the loaded data

        // Chart dimensions
        const width = 600;
        const height = 400;
        const marginTop = 20;
        const marginRight = 20;
        const marginBottom = 30;
        const marginLeft = 40;

        // Scales
        const x = d3
          .scaleUtc()
          .domain(d3.extent(data, (d) => d.date))
          .range([marginLeft, width - marginRight]);

        const y = d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => d.score)])
          .nice()
          .range([height - marginBottom, marginTop]);

        const svg = d3.select("#first_chart");

        // Axes
        svg
          .append("g")
          .attr("transform", `translate(0,${height - marginBottom})`)
          .call(d3.axisBottom(x));

        svg
          .append("g")
          .attr("transform", `translate(${marginLeft},0)`)
          .call(d3.axisLeft(y));

        // Line generator (smooth curve)
        const line = d3
          .line()
          .x((d) => x(d.date))
          .y((d) => y(d.score))
          .curve(d3.curveMonotoneX); // <-- This makes it smooth!

        // Add the line
        svg
          .append("path")
          .datum(data)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 2)
          .attr("d", line);

        // Add dots
        svg
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", (d) => x(d.date))
          .attr("cy", (d) => y(d.score))
          .attr("r", 4)
          .attr("fill", "red")
          .on("mouseover", function (event, d) {
            tooltip
              .style("opacity", 1)
              .html(
                `Date: ${d3.timeFormat("%Y-%m-%d")(d.date)}<br>Score: ${
                  d.score
                }`
              )
              .style("left", event.pageX + 10 + "px")
              .style("top", event.pageY - 28 + "px");
          })
          .on("mouseout", function () {
            tooltip.style("opacity", 0);
          });

        // Tooltip div
        const tooltip = d3
          .select("body")
          .append("div")
          .style("position", "absolute")
          .style("background", "#f9f9f9")
          .style("padding", "8px")
          .style("border", "1px solid #ccc")
          .style("border-radius", "4px")
          .style("pointer-events", "none")
          .style("opacity", 0);
      })
      .catch(function (error) {
        console.error("Error loading the CSV file:", error);
      });

</javascript>
