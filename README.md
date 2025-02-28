# Google Sheets Clone

## Overview
This is a web-based spreadsheet application built using **React** and **Node.js**, designed to mimic the core functionalities and UI of Google Sheets. The application supports mathematical formulas, data quality functions, drag-and-drop interactions, and real-time formula evaluation.

---

## Features

### **1. Spreadsheet Interface**
- Google Sheets-like UI with a **toolbar, formula bar, and grid-based cell structure**.
- **Drag Functions**: Enables dragging cell content and formulas.
- **Cell Dependencies**: Ensures formulas auto-update when referenced cells change.
- **Cell Formatting**: Supports **bold, italics, font size, and color adjustments**.
- **Row & Column Management**: Add, delete, and resize rows/columns dynamically.

### **2. Mathematical Functions**
- `SUM(range)`: Calculates the sum of a range of cells.
- `AVERAGE(range)`: Calculates the average of a range.
- `MAX(range)`: Returns the maximum value.
- `MIN(range)`: Returns the minimum value.
- `COUNT(range)`: Counts numeric values in a range.

### **3. Data Quality Functions**
- `TRIM(cell)`: Removes extra spaces.
- `UPPER(cell)`: Converts text to uppercase.
- `LOWER(cell)`: Converts text to lowercase.
- `REMOVE_DUPLICATES(range)`: Removes duplicate rows.
- `FIND_AND_REPLACE(find, replace, range)`: Finds and replaces text.

### **4. Data Entry and Validation**
- Supports various data types (**numbers, text, dates**).
- Ensures numeric cells contain only numbers.

### **5. Bonus Features**
- **HotFormulaParser** for advanced formula evaluation.
- **Relative & Absolute Cell Referencing**.
- **Data Visualization**: Charts and graphs.
- **Save & Load Functionality** for spreadsheets.

---

## Tech Stack

### **Frontend (React)**
- React.js with Hooks & Context API
- **Material-UI / Tailwind CSS** for styling
- `react-table` for handling the spreadsheet grid

### **Backend (Node.js + Express)**
- Express.js for API handling
- `hot-formula-parser` for formula evaluation
- **MongoDB (Optional)** for data persistence

---

## Installation Guide

### **1. Clone the Repository**
```bash
git clone https://github.com/your-repository-url.git
cd google-sheets-clone
```

### **2. Install Dependencies**
#### **Frontend**
```bash
cd frontend
npm install
```

#### **Backend**
```bash
cd backend
npm install
```

### **3. Run the Application**
#### **Start the Backend**
```bash
cd backend
npm start
```
#### **Start the Frontend**
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000/`.

---

## API Endpoints

### **1. Formula Evaluation**
**Endpoint:** `POST /evaluate`
- **Input:** `{ formula: "SUM(A1:A5)" }`
- **Output:** `{ result: 100 }`

### **2. Find & Replace**
**Endpoint:** `POST /find_replace`
- **Input:** `{ find: "oldText", replace: "newText", range: "A1:A10" }`
- **Output:** `{ status: "success" }`

### **3. Remove Duplicates**
**Endpoint:** `POST /remove_duplicates`
- **Input:** `{ range: "A1:C10" }`
- **Output:** `{ removed: 3 }`

---

## Future Enhancements
- Add **Excel Import/Export** functionality.
- Implement **user authentication** for personal spreadsheets.
- Improve **performance for large datasets**.

---

## License
This project is licensed under the MIT License.

---

## Contact
For issues or feature requests, please raise a GitHub issue or contact the developer.

---
