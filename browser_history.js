<script>
  d3.csv("FlatFile.csv", d3.autoType)
    .then(function (data) {
      console.log("✅ CSV loaded:", data); // Should log an array of objects
    })
    .catch(function (error) {
      console.error("❌ Error loading CSV:", error);
    });
</script>
