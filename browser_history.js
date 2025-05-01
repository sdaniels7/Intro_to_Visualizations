<javascript>
  <script>
    d3.csv("FinalAggregatedDataset.csv")
      .then(function (data) {
        console.log(data); // See the loaded data
      .catch(function (error) {
        console.error("Error loading the CSV file:", error);
      });

</javascript>

<script>
  d3.csv("FinalAggregatedDataset.csv"), d3.autoType)
    .then(function (data) {
      console.log("✅ CSV loaded:", data); // Should log an array of objects
    })
    .catch(function (error) {
      console.error("❌ Error loading CSV:", error);
    });
</script>
