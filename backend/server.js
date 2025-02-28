const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 5000;

let spreadsheets = {}; // In-memory storage

// Get spreadsheet by id
app.get("/spreadsheet/:id", (req, res) => {
    const id = req.params.id;
    if (spreadsheets[id]) {
        res.json({ id, data: spreadsheets[id] });
    } else {
        res.status(404).json({ error: "Spreadsheet not found" });
    }
});

// Create a new spreadsheet
app.post("/spreadsheet", (req, res) => {
    const id = Date.now().toString();
    spreadsheets[id] = req.body.data;
    res.json({ id, data: spreadsheets[id] });
});

// Update spreadsheet by id
app.put("/spreadsheet/:id", (req, res) => {
    const id = req.params.id;
    spreadsheets[id] = req.body.data;
    res.json({ id, data: spreadsheets[id] });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
