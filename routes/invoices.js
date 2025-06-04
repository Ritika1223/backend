const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Get all invoices
router.get('/', async (req, res) => {
  try {
     const { operatorId } = req.query;

    const filter = {};
    if (operatorId) {
      filter.operatorId = operatorId;
    }

    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ id: req.params.id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new invoice
router.post('/', async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    let newIdNumber = 1;
    if (lastInvoice) {
      const lastIdNumber = parseInt(lastInvoice.id.replace('INV', ''), 10);
      newIdNumber = lastIdNumber + 1;
    }

    const newInvoice = new Invoice({
      id: `INV${newIdNumber.toString().padStart(3, '0')}`,
      ...req.body
    });

    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an invoice by ID
router.put('/:id', async (req, res) => {
  try {
const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true}
    );    if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an invoice by ID
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ id: req.params.id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
