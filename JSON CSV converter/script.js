let mode = "csv-to-json";

const toggleModeBtn = document.getElementById("toggleModeBtn");
const modeLabel = document.getElementById("modeLabel");
const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");
const convertBtn = document.getElementById("convertBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

toggleModeBtn.addEventListener("click", () => {
  const isCSVtoJSON = mode === "csv-to-json";

  if (isCSVtoJSON) {
  mode = "json-to-csv";
} else {
  mode = "csv-to-json";
}
  modeLabel.innerText = isCSVtoJSON ? "JSON → CSV" : "CSV → JSON";
  toggleModeBtn.innerText = isCSVtoJSON
    ? "Switch to CSV → JSON"
    : "Switch to JSON → CSV";

  inputArea.value = "";
  outputArea.value = "";
});

convertBtn.addEventListener("click", () => {
  if (!inputArea.value.trim()) {
    alert("Please provide input data");
    return;
  }

  try {
    const result =
      mode === "csv-to-json"
        ? csvToJson(inputArea.value)
        : jsonToCsv(inputArea.value);

    outputArea.value = result;
  } catch (err) {
    alert(err.message);
  }
});

function csvToJson(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",");

  const data = lines.slice(1).map(line => {
    const values = line.split(",");
    const obj = {};

    headers.forEach((header, i) => {
      obj[header.trim()] = values[i]?.trim() || "";
    });

    return obj;
  });

  ///woooii

  return JSON.stringify(data, null, 2);
}

function jsonToCsv(jsonText) {
  let data;

  try {
    data = JSON.parse(jsonText);
  } catch {
    throw new Error("Invalid JSON format");
  }

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("JSON must be a non-empty array");
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(obj =>
    headers.map(header => obj[header]).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const file = e.dataTransfer.files[0];
  if (file) readFile(file);
});

dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) readFile(file);
});

function readFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    inputArea.value = reader.result;
  };
  reader.readAsText(file);
}

copyBtn.addEventListener("click", () => {
  if (!outputArea.value) {
    alert("Nothing to copy");
    return;
  }

  navigator.clipboard.writeText(outputArea.value);
  alert("Output copied!");
});

downloadBtn.addEventListener("click", () => {
  if (!outputArea.value) {
    alert("Nothing to download");
    return;
  }

  const blob = new Blob([outputArea.value], {
    type: mode === "csv-to-json"
      ? "application/json"
      : "text/csv"
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = mode === "csv-to-json" ? "data.json" : "data.csv";
  link.click();
});

