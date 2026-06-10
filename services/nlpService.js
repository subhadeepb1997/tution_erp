const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'], forceNER: true });

async function trainNLP() {
  console.log('Training Local AI Assistant (node-nlp)...');

  // Intent: Greeting
  manager.addDocument('en', 'hello', 'greeting');
  manager.addDocument('en', 'hi', 'greeting');
  manager.addDocument('en', 'hey there', 'greeting');
  manager.addDocument('en', 'good morning', 'greeting');
  
  // Intent: Students Count
  manager.addDocument('en', 'how many students do i have', 'students.count');
  manager.addDocument('en', 'total students', 'students.count');
  manager.addDocument('en', 'what is the student count', 'students.count');
  manager.addDocument('en', 'count of students', 'students.count');

  // Intent: Pending Fees
  manager.addDocument('en', 'who has not paid', 'fees.pending');
  manager.addDocument('en', 'who owes money', 'fees.pending');
  manager.addDocument('en', 'unpaid fees', 'fees.pending');
  manager.addDocument('en', 'show me pending fees', 'fees.pending');
  manager.addDocument('en', 'who hasn\'t paid this month', 'fees.pending');
  manager.addDocument('en', 'students with pending fees', 'fees.pending');

  // Intent: Help
  manager.addDocument('en', 'what can you do', 'help');
  manager.addDocument('en', 'help', 'help');

  // Train the model
  await manager.train();
  console.log('Local AI Training Complete.');
  
  return manager;
}

module.exports = { trainNLP, manager };
