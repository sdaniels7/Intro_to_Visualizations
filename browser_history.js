<javascript>
  <script>
    d3.csv("FinalAggregatedDataset.csv")
      .then(function (data) {
        console.log(data); // See the loaded data
      .catch(function (error) {
        console.error("Error loading the CSV file:", error);
      });

</javascript>
