// Navigation
document.querySelectorAll('.nav-links li').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('.nav-links li').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
    document.getElementById(this.dataset.target).classList.add('active-view');

    if(this.dataset.target === 'students-view') loadStudents();
    if(this.dataset.target === 'dashboard-view') loadDashboard();
  });
});

// Modals
function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

// API Base URL (Change to relative since it's hosted together)
const API_BASE = '/api';

// Authentication
let authToken = localStorage.getItem('tuition-erp-token');

// Check if logged in on load
if (authToken) {
  showApp();
}

function showApp() {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('app-container').style.display = 'flex';
  loadDashboard();
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      authToken = data.token;
      localStorage.setItem('tuition-erp-token', authToken);
      showApp();
    } else {
      alert('Login Failed: ' + data.message);
    }
  } catch (err) {
    console.error(err);
    alert('Login error');
  }
});

// Custom fetch to append auth token
async function apiFetch(endpoint, options = {}) {
  const headers = { ...options.headers };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  if (res.status === 401) {
    // Unauthorized
    localStorage.removeItem('tuition-erp-token');
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
    throw new Error('Unauthorized');
  }
  return res;
}

// Load Dashboard Data
async function loadDashboard() {
  try {
    const res = await apiFetch('/students');
    const students = await res.json();
    document.getElementById('total-students-count').innerText = students.length;
    // We would add more sophisticated logic here for fees/classes
  } catch (err) {
    console.error(err);
  }
}

// Load Students
async function loadStudents() {
  try {
    const res = await apiFetch(`/students`);
    const students = await res.json();
    const tbody = document.getElementById('students-tbody');
    tbody.innerHTML = '';
    
    students.forEach(student => {
      tbody.innerHTML += `
        <tr>
          <td>
            <div style="font-weight: 500">${student.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary)">${student.phone || 'No phone'}</div>
          </td>
          <td>${student.batch_time || 'N/A'}</td>
          <td>${student.fee_type} (₹${student.fee_amount})</td>
          <td>
            <button class="btn" style="background: rgba(239, 68, 68, 0.2); color: var(--danger)" onclick="deleteStudent('${student._id}')">Delete</button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error(err);
  }
}

// Add Student
document.getElementById('add-student-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById('student-name').value,
    phone: document.getElementById('student-phone').value,
    batch_time: document.getElementById('student-batch').value,
    fee_type: document.getElementById('student-fee-type').value,
    fee_amount: Number(document.getElementById('student-fee-amount').value)
  };

  try {
    await apiFetch(`/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    closeModal('student-modal');
    e.target.reset();
    loadStudents();
    loadDashboard();
  } catch (err) {
    console.error(err);
  }
});

// Delete Student
async function deleteStudent(id) {
  if(!confirm('Are you sure you want to delete this student?')) return;
  try {
    await apiFetch(`/students/${id}`, { method: 'DELETE' });
    loadStudents();
    loadDashboard();
  } catch (err) {
    console.error(err);
  }
}

// Initialize
loadDashboard();

// ==== AI CHATBOT LOGIC ====
function toggleAIChat() {
  const body = document.getElementById('ai-chat-body');
  body.style.display = body.style.display === 'none' ? 'flex' : 'none';
}

function handleAIKeyPress(e) {
  if (e.key === 'Enter') {
    sendAIMessage();
  }
}

async function sendAIMessage() {
  const input = document.getElementById('ai-chat-input');
  const message = input.value.trim();
  if (!message) return;

  const messagesContainer = document.getElementById('ai-chat-messages');
  
  // Add User Message
  const userDiv = document.createElement('div');
  userDiv.className = 'message user';
  userDiv.innerText = message;
  messagesContainer.appendChild(userDiv);
  
  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Add Loading State
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'message ai';
  loadingDiv.innerText = 'Thinking...';
  messagesContainer.appendChild(loadingDiv);

  try {
    const res = await apiFetch('/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    const data = await res.json();
    loadingDiv.innerText = data.reply || data.message;
  } catch (err) {
    loadingDiv.innerText = 'Sorry, there was an error connecting to the AI.';
  }
  
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
