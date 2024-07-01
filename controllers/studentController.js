const Student = require('../models/student');
const XLSX = require('xlsx');
const fs = require('fs');

exports.uploadExcel = async (req, res) => {
  try {
    const file = req.file;
    const workbook = XLSX.readFile(file.path);
    const sheet_name_list = workbook.SheetNames;
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    await Student.insertMany(data);
    fs.unlinkSync(file.path); // delete the file after uploading
    res.status(200).send('File uploaded and data saved.');
  } catch (error) {
    res.status(500).send('Error uploading file: ' + error.message);
  }
};

exports.searchStudents = async (req, res) => {
  try {
    let query = {};
    const { name, fatherName, class: studentClass, village } = req.query;

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search for name
    }
    if (fatherName) {
      query.fatherName = { $regex: new RegExp(fatherName, 'i') }; // Case-insensitive search for fatherName
    }
    if (studentClass) {
      query.class = studentClass;
    }
    if (village) {
      query.village = { $regex: new RegExp(village, 'i') }; // Case-insensitive search for village
    }

    const students = await Student.find(query);
    res.status(200).json(students);
  } catch (error) {
    console.error('Error searching for students:', error);
    res.status(500).send('Error searching for students: ' + error.message);
  }
};
