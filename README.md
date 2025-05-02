# Intro_to_Visualizations
## Final Project

### Summary
This project outlines a service named Healthy Browsing that takes keywords and metadata from your web browser history and restructures it to provide visualizations that show how what you read compares to clinical assessments in anxiety, depression, substance abuse, and social determinants of health. For the purpose of this project, a student's web browsing history was used.

There are four charts:

(1) Linegraph of the average keyword counts by Anxiety, Depression, Social Factors, and Substance Abuse per month requires the following data:
 -SDoH keyword count
 -Anxiety keyword count
 -Depression keyword count
 -CAGEAID keyword count
 -Date website is accessed

 (2) Bubble chart of keywords with number of hits representing their size by month, requiring the following: 
 -SDoH keyword count
 -Anxiety keyword count
 -Depression keyword count
 -CAGEAID keyword count
 -Date website is accessed

 (3) Top websites over time
 -Webpage
 -Time spent on page
 -Date accessed

 (4) Web browsing by time of day
  -SDoH keyword count
 -Anxiety keyword count
 -Depression keyword count
 -CAGEAID keyword count
 -Hour accessed

### Installation and setup instructions
 You can see the GitHub page final dashboard using this link:
 
### List of lessons learned
 This project was harder than I anticipated, and it started creating the Python script. I did not  anticipate so many issues with using BeautifulSoup for webcrawling, specific the limitations on how many times I could run the scripts before the webpages may deny new requests. 

 I found that organization was my best friend throughout this project. With unorganized code, I frequently found that I had declared a variable then written over it, creating chaos in the visualizations. I was unfamiliar with the github platform ad I found previewing my webpage to be especially time consuming.



 Completed code: 

 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Healthy Browsing</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/6.7.0/d3.min.js"></script>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background: #fafafa;
      margin: 40px;
    }
    .grid-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 20px;
    }
    .chart-container {
      background-color: #fff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      padding: 10px;
    }
    .chart-container svg {
      width: 100%;
      height: 400px;
    }
    .tooltip {
      position: absolute;
      background-color: rgba(0, 0, 0, 0.75);
      color: #fff;
      padding: 6px 10px;
      border-radius: 4px;
      pointer-events: none;
      font-size: 12px;
    }
    select {
      font-size: 14px;
      padding: 6px;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <h1>Healthy Browsing</h1>
  <p>Your browser history can tell stories about your mental health. Explore the graphs below to see insights about your browsing history.</p>

  <div class="grid-container">
    <div class="chart-container">
      <h3>Most Commonly Viewed Websites</h3>
      <svg id="barChart" width="600" height="400"></svg>
    </div>
    <div class="chart-container">
      <h3>Keywords by Clinical Assessments over Time</h3>
      <svg id="ridgeChart" width="600" height="400"></svg>
      <div class="tooltip" style="opacity: 0;"></div>
    </div>
    <div class="chart-container">
      <h3>Website Visits Over Time</h3>
      <svg id="lineChart" width="600" height="400"></svg>
    </div>
    <div class="chart-container">
      <h3>Bubble Chart</h3>
      <svg id="bubbleChart" width="600" height="400"></svg>
    </div>
  </div>

  <div class="tooltip" style="opacity: 0;"></div>

  <script>
    const tooltip = d3.select(".tooltip");

    // ------------------- BAR CHART -------------------
    d3.csv("chart1.csv", d3.autoType).then(data => {
      const svg = d3.select("#barChart"),
            margin = {top: 40, right: 20, bottom: 60, left: 80},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

      const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

      const counts = d3.rollup(data, v => v.length, d => d.domain);
      const sorted = Array.from(counts, ([domain, count]) => ({ domain, count }))
        .sort((a, b) => d3.descending(a.count, b.count))
        .slice(0, 10);

      const x = d3.scaleLinear().domain([0, d3.max(sorted, d => d.count)]).range([0, width]);
      const y = d3.scaleBand().domain(sorted.map(d => d.domain)).range([0, height]).padding(0.1);

      chart.append("g").call(d3.axisLeft(y));
      chart.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

      chart.selectAll("rect")
        .data(sorted)
        .enter()
        .append("rect")
        .attr("y", d => y(d.domain))
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("width", 0)
        .attr("fill", "#69b3a2")
        .transition()
        .duration(1000)
        .attr("width", d => x(d.count));

      // Tooltip and labels
      chart.selectAll("rect")
        .on("mouseover", (event, d) => {
          tooltip.transition().style("opacity", 1);
          tooltip.html(`${d.domain}: ${d.count}`)
                 .style("left", (event.pageX + 10) + "px")
                 .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => tooltip.transition().style("opacity", 0));

      chart.selectAll(".label")
        .data(sorted)
        .enter()
        .append("text")
        .attr("x", d => x(d.count) + 5)
        .attr("y", d => y(d.domain) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.count);
    });

//------------------------Multi-line Chart with Tooltips-------------------------//
  
d3.csv("chart2.csv", d3.autoType).then(data => {
  const svg = d3.select("#ridgeChart"),
        margin = {top: 40, right: 100, bottom: 40, left: 60},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // Parse date
  const parseDate = d3.timeParse("%m/%d/%Y");
  data.forEach(d => {
    d.date = parseDate(d.date);
  });

  // Metrics to plot
  const keys = ["PHQ-9", "GAD-7", "SDoH", "CAGE-AID"];

  const x = d3.scaleTime()
              .domain(d3.extent(data, d => d.date))
              .range([0, width]);

  const y = d3.scaleLinear()
              .domain([0, d3.max(data, d => d3.max(keys, key => +d[key]))])
              .nice()
              .range([height, 0]);

  const color = d3.scaleOrdinal()
                  .domain(keys)
                  .range(d3.schemeTableau10);

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  g.append("g").call(d3.axisLeft(y));

  // Tooltip container
  const tooltip = d3.select(".tooltip");

  // Draw lines and points
  keys.forEach(key => {
    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d[key]));

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color(key))
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add data points
    g.selectAll(".dot-" + key)
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-" + key)
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d[key]))
      .attr("r", 4)
      .attr("fill", color(key))
      .on("mouseover", function(event, d) {
        tooltip.transition().style("opacity", 1);
        tooltip.html(`<strong>${key}</strong><br>${d3.timeFormat("%B %d, %Y")(d.date)}<br>Score: ${d[key]}`)
               .style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition().style("opacity", 0);
      });
  });

  // Legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width + margin.left + 10}, ${margin.top})`);

  keys.forEach((key, i) => {
    const row = legend.append("g")
      .attr("transform", `translate(0, ${i * 20})`);
    row.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", color(key));
    row.append("text")
      .attr("x", 15)
      .attr("y", 10)
      .text(key)
      .style("font-size", "12px");
  });
});


    // ------------------- LINE CHART -------------------
    d3.csv("chart3.csv", d3.autoType).then(data => {
      const svg = d3.select("#lineChart"),
            margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

      const parseDate = d3.timeParse("%m/%d/%Y");
      const counts = d3.rollup(data, v => v.length, d => parseDate(d.date));
      const lineData = Array.from(counts, ([date, value]) => ({ date, value })).sort((a, b) => a.date - b.date);

      const x = d3.scaleTime().domain(d3.extent(lineData, d => d.date)).range([0, width]);
      const y = d3.scaleLinear().domain([0, d3.max(lineData, d => d.value)]).range([height, 0]);

      const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
      g.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
      g.append("g").call(d3.axisLeft(y));

      g.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", d3.line().x(d => x(d.date)).y(d => y(d.value)));
    });

    // ------------------- BUBBLE CHART -------------------
    d3.csv("chart4.csv", d3.autoType).then(data => {
      const svg = d3.select("#bubbleChart"),
            margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;

      const x = d3.scaleLinear().domain([0, d3.max(data, d => d.Frequency)]).range([0, width]);
      const y = d3.scaleLinear().domain([0, d3.max(data, d => d.Frequency)]).range([height, 0]);
      const r = d3.scaleSqrt().domain([0, d3.max(data, d => d.Frequency)]).range([2, 40]);

      const chart = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
      chart.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));
      chart.append("g").call(d3.axisLeft(y));

      chart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.Frequency))
        .attr("cy", d => y(d.Frequency))
        .attr("r", d => r(d.Frequency))
        .style("fill", "#69b3a2")
        .style("opacity", 0.7)
        .attr("stroke", "black");
    });
  </script>
</body>
</html>

