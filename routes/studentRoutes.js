const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './studentfeelist.xlsx'); // Adjust the path to your Excel file

// Function to read Excel file and return JSON data
const readExcelFile = () => {
  const workbook = XLSX.readFile(filePath);
  const sheet_name_list = workbook.SheetNames;
  return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
};

// Route to search students based on criteria
router.get('/search', (req, res) => {
  const { name, class: studentClass, village, fatherName } = req.query;
  try {
    const jsonData = readExcelFile();

    // Filter data based on provided query parameters
    const filteredData = jsonData.filter(student => {
      if (name && student['NAME'] && student['NAME'].toLowerCase() !== name.toLowerCase()) return false;
      if (studentClass && student['CLASS'] && student['CLASS'].toLowerCase() !== studentClass.toLowerCase()) return false;
      if (village && student['VILL'] && student['VILL'].toLowerCase() !== village.toLowerCase()) return false;
      if (fatherName && student['F.NAME'] && student['F.NAME'].toLowerCase() !== fatherName.toLowerCase()) return false;
      return true;
    });

    res.json(filteredData);
  } catch (error) {
    console.error('Error searching for students:', error);
    res.status(500).json({ error: 'Error searching for students' });
  }
});

module.exports = router;
