import React, { useState, useRef } from "react";
import { Parser } from "hot-formula-parser";
import Chart from "chart.js/auto";
import "./App.css";

// Helper: Convert cell id (e.g., "A1") to row and column indices
function cellIdToIndices(cellId) {
  const match = cellId.match(/([A-Z]+)([0-9]+)/);
  if (match) {
    const colLetters = match[1];
    const row = parseInt(match[2], 10) - 1;
    let col = 0;
    for (let i = 0; i < colLetters.length; i++) {
      col = col * 26 + (colLetters.charCodeAt(i) - 64);
    }
    col -= 1;
    return { row, col };
  }
  return { row: 0, col: 0 };
}

// Evaluate formula using hot-formula-parser
function evaluateFormula(formula, data) {
  const parser = new Parser();

  // Resolve cell references via hot-formula-parser’s event
  parser.on("callVariable", function (name, done) {
    const { row, col } = cellIdToIndices(name);
    if (data[row] && data[row][col]) {
      let cellValue = data[row][col].value;
      // If the cell is empty, treat it as 0
      if (cellValue === "") {
        done(0);
        return;
      }
      // If the referenced cell itself contains a formula, evaluate it recursively
      if (typeof cellValue === "string" && cellValue.startsWith("=")) {
        cellValue = evaluateFormula(cellValue, data);
      }
      // Convert to a number if possible
      const num = parseFloat(cellValue);
      done(isNaN(num) ? cellValue : num);
    } else {
      done(0);
    }
  });

  // Remove leading "=" if present
  const expression = formula.startsWith("=") ? formula.slice(1) : formula;
  const parsed = parser.parse(expression);
  if (parsed.error) {
    console.error("Error parsing formula:", parsed.error);
    return "Error";
  }
  return parsed.result;
}

const initialData = Array(10)
  .fill(null)
  .map(() =>
    Array(10)
      .fill(null)
      .map(() => ({
        value: "",
        bold: false,
        italic: false,
        fontSize: 14,
        color: "#000000",
      }))
  );

function App() {
  const [data, setData] = useState(initialData);
  const [formula, setFormula] = useState("");
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const chartRef = useRef(null);

  // Update cell value when editing
  const handleCellChange = (row, col, newValue) => {
    const newData = [...data];
    newData[row][col].value = newValue;
    setData(newData);
  };

  // Add a new row
  const addRow = () => {
    const cols = data[0].length;
    const newRow = Array(cols)
      .fill(null)
      .map(() => ({
        value: "",
        bold: false,
        italic: false,
        fontSize: 14,
        color: "#000000",
      }));
    setData([...data, newRow]);
  };

  // Add a new column
  const addColumn = () => {
    setData(
      data.map((row) => [
        ...row,
        { value: "", bold: false, italic: false, fontSize: 14, color: "#000000" },
      ])
    );
  };

  // Delete a row
  const deleteRow = (rowIndex) => {
    const newData = data.filter((_, idx) => idx !== rowIndex);
    setData(newData);
  };

  // Delete a column
  const deleteColumn = (colIndex) => {
    const newData = data.map((row) => row.filter((_, idx) => idx !== colIndex));
    setData(newData);
  };

  // Toggle formatting for the selected cell
  const applyFormatting = (formatType) => {
    const { row, col } = selectedCell;
    const newData = [...data];
    let cell = { ...newData[row][col] };
    switch (formatType) {
      case "bold":
        cell.bold = !cell.bold;
        break;
      case "italic":
        cell.italic = !cell.italic;
        break;
      default:
        break;
    }
    newData[row][col] = cell;
    setData(newData);
  };

  // Find & Replace
  const handleFindReplace = (find, replace) => {
    const newData = data.map((row) =>
      row.map((cell) => (cell.value === find ? { ...cell, value: replace } : cell))
    );
    setData(newData);
  };

  // Save spreadsheet (requires a running backend)
  const saveSpreadsheet = async () => {
    try {
      const response = await fetch("/spreadsheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const result = await response.json();
      alert(`Spreadsheet saved with id: ${result.id}`);
    } catch (error) {
      console.error(error);
      alert("Error saving spreadsheet");
    }
  };

  // Load spreadsheet (requires a running backend)
  const loadSpreadsheet = async () => {
    const id = prompt("Enter Spreadsheet ID to load:");
    try {
      const response = await fetch(`/spreadsheet/${id}`);
      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      } else {
        alert("Spreadsheet not found");
      }
    } catch (error) {
      console.error(error);
      alert("Error loading spreadsheet");
    }
  };

  // Render a simple chart using Chart.js (e.g., based on first row numeric values)
  const renderChart = () => {
    const chartData = data[0]
      .map((cell) => parseFloat(cell.value))
      .filter((val) => !isNaN(val));
    if (chartRef.current) {
      new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: chartData.map((_, index) => `Col ${index + 1}`),
          datasets: [
            {
              label: "Row 1 Data",
              data: chartData,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        },
        options: { scales: { y: { beginAtZero: true } } },
      });
    }
  };

  return (
    <div className="App">
      <div className="header">Google Sheets Clone</div>
      <div className="toolbar">
        <button onClick={() => applyFormatting("bold")}>Bold</button>
        <button onClick={() => applyFormatting("italic")}>Italic</button>
        <button onClick={addRow}>Add Row</button>
        <button onClick={addColumn}>Add Column</button>
        <button onClick={() => deleteRow(selectedCell.row)}>Delete Row</button>
        <button onClick={() => deleteColumn(selectedCell.col)}>Delete Column</button>
        <button onClick={saveSpreadsheet}>Save</button>
        <button onClick={loadSpreadsheet}>Load</button>
        <button onClick={renderChart}>Show Chart</button>
      </div>
      <div className="formula-bar">
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Enter formula (e.g. =SUM(A1:A3))"
        />
        <button
          onClick={() => {
            const newData = [...data];
            newData[selectedCell.row][selectedCell.col].value = formula;
            setData(newData);
          }}
        >
          Apply Formula
        </button>
      </div>
      <div className="find-replace">
        <input type="text" id="find" placeholder="Find" />
        <input type="text" id="replace" placeholder="Replace" />
        <button
          onClick={() =>
            handleFindReplace(
              document.getElementById("find").value,
              document.getElementById("replace").value
            )
          }
        >
          Find & Replace
        </button>
      </div>
      <table className="spreadsheet">
        <thead>
          <tr>
            <th></th>
            {data[0].map((_, colIndex) => (
              <th key={colIndex}>{String.fromCharCode(65 + colIndex)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{rowIndex + 1}</td>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  contentEditable
                  suppressContentEditableWarning
                  style={{
                    fontWeight: cell.bold ? "bold" : "normal",
                    fontStyle: cell.italic ? "italic" : "normal",
                    fontSize: cell.fontSize,
                    color: cell.color,
                    border:
                      selectedCell.row === rowIndex &&
                        selectedCell.col === colIndex
                        ? "2px solid #0b8043"
                        : "1px solid #e0e0e0",
                    backgroundColor:
                      selectedCell.row === rowIndex &&
                        selectedCell.col === colIndex
                        ? "#dcedc8"
                        : "#fff",
                  }}
                  onClick={() =>
                    setSelectedCell({ row: rowIndex, col: colIndex })
                  }
                  onBlur={(e) =>
                    handleCellChange(rowIndex, colIndex, e.target.innerText)
                  }
                >
                  {typeof cell.value === "string" && cell.value.startsWith("=")
                    ? evaluateFormula(cell.value, data)
                    : cell.value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <canvas ref={chartRef} width="400" height="200"></canvas>
    </div>
  );
}

export default App;
