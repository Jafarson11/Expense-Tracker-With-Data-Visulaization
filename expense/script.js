const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const canvas = document.getElementById('myChart');
const ctx = canvas.getContext('2d');

let myChart;
let currentChartType = 'bar'; // Default chart type

const toggleChartButton = document.getElementById('toggleChartButton');
toggleChartButton.addEventListener('click', toggleChartType);

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  // Get sign
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span> <button class="delete-btn">x</button>
  `;

  list.appendChild(item);

  // Add event listener to the delete button
  const deleteButton = item.querySelector('.delete-btn');
  deleteButton.addEventListener('click', () => removeTransaction(transaction.id));
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Add transaction
// Add transaction
// Add transaction
// Add transaction
async function addTransaction(e) {
    e.preventDefault();
  
    const textValue = text.value.trim();
    const amountValue = amount.value.trim();
    const categoryValue = category.value; // Get the selected category
  
    console.log("Text:", textValue);
    console.log("Amount:", amountValue);
    console.log("Category:", categoryValue);
  
    if (textValue === '' || amountValue === '' || categoryValue === '') {
      alert('Please add a text, amount, and select a category');
    } else {
      const transactionData = {
        text: textValue,
        amount: +amountValue,
        category: categoryValue
      };
  
      try {
        const response = await fetch('/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(transactionData)
        });
  
        if (!response.ok) {
          throw new Error('Failed to add transaction');
        }
  
        const result = await response.text();
        console.log(result); // Log server response
  
        text.value = '';
        amount.value = '';
        category.value = '';
      } catch (error) {
        console.error(error);
        alert('Failed to add transaction');
      }
    }
  }
// Update the balance, income and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);

  updateLocalStorage();

  init();
}

// Update local storage transactions
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to toggle between bar and pie charts
function toggleChartType() {
  if (currentChartType === 'bar') {
    currentChartType = 'pie';
  } else if (currentChartType === 'pie') {
    currentChartType = 'line';
  } else if (currentChartType === 'line') {
    currentChartType = 'boxplot'; // Placeholder for the box plot
  } else if (currentChartType === "boxplot") {
    currentChartType = 'bar';
  }
  updateChart();
}

// Function to create or update the chart
function updateChart() {
  const labels = transactions.map(transaction => transaction.text);
  const data = transactions.map(transaction => Math.abs(transaction.amount));

  if (myChart) {
    myChart.destroy();
  }

  switch (currentChartType) {
    case 'bar':
    case 'boxplot': // Using a bar chart as an approximation for a box plot
      myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Transactions',
            data: data,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      break;
    case 'pie':
      myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Transactions',
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              // Add more colors as needed
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              // Add more border colors as needed
            ],
            borderWidth: 1
          }]
        }
      });
      break;
    case 'line':
      myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Transactions',
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: false, // Set to false for a line chart without a filled area
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      break;
    // Add more cases as needed
  }
}

// Update the chart when initializing the app
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
  updateChart();
}

init();

form.addEventListener('submit', addTransaction);
