
const form = document.getElementById('expense-form');
const amountInput = document.getElementById('amount');
const nameInput = document.getElementById('name');
const descInput = document.getElementById('desc');
const tableBody = document.getElementById('expense-table-body');
const editIdInput = document.getElementById('edit-id');

let expenses = [];

// Load from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('expenses');
  if (stored) {
    expenses = JSON.parse(stored);
    renderTable();
  }
});

// Save or Update
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const amount = parseFloat(amountInput.value.trim());
  const name = nameInput.value.trim();
  const desc = descInput.value.trim();
  const editId = editIdInput.value;

  if (!amount || !name || !desc) {
    alert('Please fill all fields correctly.');
    return;
  }

  if (editId) {
    // Edit existing
    expenses = expenses.map(exp => {
      if (exp.id == editId) {
        return { id: exp.id, amount, name, desc };
      }
      return exp;
    });
    editIdInput.value = '';
  } else {
    // New expense
    const newExpense = {
      id: Date.now(),
      amount,
      name,
      desc
    };
    expenses.push(newExpense);
  }

  localStorage.setItem('expenses', JSON.stringify(expenses));
  renderTable();
  form.reset();
});

// Render the table
function renderTable() {
  tableBody.innerHTML = '';
  expenses.forEach((exp, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>₹${exp.amount.toFixed(2)}</td>
      <td>${exp.name}</td>
      <td>${exp.desc}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editExpense(${exp.id})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteExpense(${exp.id})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Edit
function editExpense(id) {
  const expense = expenses.find(exp => exp.id === id);
  if (expense) {
    amountInput.value = expense.amount;
    nameInput.value = expense.name;
    descInput.value = expense.desc;
    editIdInput.value = expense.id;
  }
}

// Delete
function deleteExpense(id) {
  if (confirm("Are you sure you want to delete this expense?")) {
    expenses = expenses.filter(exp => exp.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    renderTable();
  }
}

