// ========================
// 1. App state
// ========================
let mode = "csv-to-json";

// ========================
// 2. DOM elements
// ========================
const modeLabel = document.getElementById("modeLabel");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");
const convertBtn = document.getElementById("convertBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

// ========================
// 3. Toggle mode
// ========================
toggleModeBtn.addEventListener("click", () => {
  const isCSV = mode === "csv-to-json";

  mode = isCSV ? "json-to-csv" : "csv-to-json";
  modeLabel.innerText = isCSV ? "JSON → CSV" : "CSV → JSON";
  toggleModeBtn.innerText = isCSV
    ? "Switch to CSV → JSON"
    : "Switch to JSON → CSV";

  inputArea.value = "";
  outputArea.value = "";
});

// ========================
// 4. Convert
// ========================
convertBtn.addEventListener("click", () => {
  if (!inputArea.value.trim()) {
    alert("Please provide input data.");
    return;
  }

  try {
    outputArea.value =
      mode === "csv-to-json"
        ? csvToJson(inputArea.value)
        : jsonToCsv(inputArea.value);
  } catch (err) {
    alert("Invalid input format.");
  }
});

// ========================
// 5. CSV → JSON
// ========================
function csvToJson(text) {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const obj = {};

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j];
    }

    result.push(obj);
  }

  return JSON.stringify(result, null, 2);
}

// ========================
// 6. JSON → CSV
// ========================
function jsonToCsv(text) {
  const data = JSON.parse(text);
  const headers = Object.keys(data[0]);
  const rows = data.map(obj =>
    headers.map(h => obj[h]).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

// ========================
// 7. Drag & Drop
// ========================
dropZone.addEventListener("dragover", e => {
  e.preventDefault();
  dropZone.classList.add("drag");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag");
});

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  dropZone.classList.remove("drag");

  const file = e.dataTransfer.files[0];
  if (!file) return;

  readFile(file);
});

// ========================
// 8. Click to select file
// ========================
dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  readFile(file);
  fileInput.value = "";
});

// ========================
// 9. File reader helper
// ========================
function readFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    inputArea.value = reader.result;
  };
  reader.readAsText(file);
}

// ========================
// 10. Copy output
// ========================
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(outputArea.value);
  alert("Copied!");
});

// ========================
// 11. Download output
// ========================
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([outputArea.value], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = mode === "csv-to-json" ? "output.json" : "output.csv";
  link.click();
});
