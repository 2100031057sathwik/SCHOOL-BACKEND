const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = process.env.EXCEL_FILE_PATH || path.join(__dirname, '../studentfeelist.xlsx'); // Adjust the path to your Excel file

// Function to read Excel file and return JSON data
const readExcelFile = () => {
  if (!fs.existsSync(filePath)) {
    throw new Error('Excel file not found');
  }
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);
};

// Route to search students based on criteria
router.get('/search', (req, res) => {
  const { name, class: studentClass, village, fatherName } = req.query;

  try {
    const jsonData = readExcelFile();

    // Filter data based on provided query parameters
    const filteredData = jsonData.filter((student) => {
      const matchName = name ? student['NAME']?.toLowerCase() === name.toLowerCase() : true;
      const matchClass = studentClass ? student['CLASS']?.toLowerCase() === studentClass.toLowerCase() : true;
      const matchVillage = village ? student['VILL']?.toLowerCase() === village.toLowerCase() : true;
      const matchFatherName = fatherName ? student['F.NAME']?.toLowerCase() === fatherName.toLowerCase() : true;

      return matchName && matchClass && matchVillage && matchFatherName;
    });

    res.json(filteredData);
  } catch (error) {
    console.error('Error searching for students:', error.message);
    res.status(500).json({ error: 'Error searching for students' });
  }
});

module.exports = router;
