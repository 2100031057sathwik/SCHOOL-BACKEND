const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  NAME: {
    type: String,
    required: true,
  },
  'F.NAME': String,
  CLASS: {
    type: String,
    required: true,
  },
  VILL: String,
  'PH.NO': {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); // Validates 10-digit phone numbers
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  // Add more fields as necessary
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
