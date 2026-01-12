// Read CSV file
document.getElementById("csvFile").addEventListener("change", function () {
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("csvInput").value = reader.result;
  };
  reader.readAsText(this.files[0]);
});

// Read JSON file
document.getElementById("jsonFile").addEventListener("change", function () {
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("jsonInput").value = reader.result;
  };
  reader.readAsText(this.files[0]);
});

function convertCSVtoJSON() {
  const csv = document.getElementById("csvInput").value.trim();
  if (!csv) {
    alert("Please provide CSV data");
    return;
  }

  const lines = csv.split("\n");
  const headers = lines[0].split(",");

  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(",");

    headers.forEach((header, index) => {
      obj[header.trim()] = currentLine[index]?.trim();
    });

    result.push(obj);
  }

  document.getElementById("jsonOutput").value =
    JSON.stringify(result, null, 2);
}

function convertJSONtoCSV() {
  const jsonText = document.getElementById("jsonInput").value.trim();
  if (!jsonText) {
    alert("Please provide JSON data");
    return;
  }

  let data;
  try {
    data = JSON.parse(jsonText);
  } catch {
    alert("Invalid JSON");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  csvRows.push(headers.join(","));

  data.forEach(obj => {
    const row = headers.map(header => obj[header]);
    csvRows.push(row.join(","));
  });

  document.getElementById("csvOutput").value =
    csvRows.join("\n");
}

function downloadJSON() {
  const content = document.getElementById("jsonOutput").value;
  const blob = new Blob([content], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.json";
  link.click();
}

function downloadCSV() {
  const content = document.getElementById("csvOutput").value;
  const blob = new Blob([content], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.csv";
  link.click();
}
