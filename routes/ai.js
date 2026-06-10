const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Fee = require('../models/Fee');
const { manager } = require('../services/nlpService');

router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Process the natural language message
    const response = await manager.process('en', message);
    const intent = response.intent;

    let reply = "I'm sorry, I didn't understand that. I can tell you about total students or who has pending fees.";

    // Route logic based on detected intent
    if (intent === 'greeting') {
      reply = "Hello! I'm your local AI assistant. Ask me about your students or fees.";
    } 
    else if (intent === 'help') {
      reply = "I can help you analyze your data! Try asking:\n- 'How many students do I have?'\n- 'Who has not paid?'";
    }
    else if (intent === 'students.count') {
      const count = await Student.count();
      reply = `You currently have ${count} students registered in the system.`;
    }
    else if (intent === 'fees.pending') {
      const pendingFees = await Fee.findAll({ 
        where: { status: 'Pending' }, 
        include: [Student] 
      });
      
      if (pendingFees.length === 0) {
        reply = "Great news! Nobody has pending fees.";
      } else {
        const names = pendingFees.map(f => f.Student?.name || 'Unknown').join(', ');
        reply = `There are ${pendingFees.length} students with pending fees: ${names}.`;
      }
    }

    res.json({ reply });

  } catch (err) {
    res.status(500).json({ message: 'NLP processing error: ' + err.message });
  }
});

module.exports = router;
