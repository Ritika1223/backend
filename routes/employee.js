const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Helper to generate employee ID
function generateEmpId() {
  return 'EMP' + Date.now().toString().slice(-6); // Example: EMP123456
}

router.post('/', async (req, res) => {
  try {
    const { operatorId } = req.body;
    if (!operatorId) return res.status(400).json({ message: 'Operator ID is required' });

    console.log('POST /api/employees body:', req.body);

    // Auto-generate empId and add to request body
    const empId = generateEmpId();
    const newEmployee = new Employee({
      ...req.body,
      empId,
    });

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
    console.log("Operator ID from query:", operatorId); // 👈 Debug log

    const filter = operatorId ? { operatorId } : {}; // concise

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
// PUT /api/employees/:id/status - Toggle employee status
// PATCH /api/employees/:id/status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Employee.findByIdAndUpdate(
      id,
      { status },
      { new: true } 
    );
    if (!updated) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
