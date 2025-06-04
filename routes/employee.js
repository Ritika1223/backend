const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

router.post('/', async (req, res) => {
  try {
    console.log('POST /api/employees body:', req.body);
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    console.log('Employee saved:', newEmployee);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Error saving employee:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { operatorId } = req.query;

    const filter = {};
    if (operatorId) {
      filter.operatorId = operatorId;
    }

    const employees = await Employee.find(filter);
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: error.message });
  }
});
// DELETE /api/employees/:id - Delete employee by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/employees/:id - Update employee by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
