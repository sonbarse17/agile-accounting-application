const API_BASE = '/api';
let authToken = localStorage.getItem('authToken');

// Navigation functions
function showLogin() {
    hideAllSections();
    document.getElementById('login-section').style.display = 'block';
}

function showDashboard() {
    if (!authToken) {
        showLogin();
        return;
    }
    hideAllSections();
    document.getElementById('dashboard-section').style.display = 'block';
    loadDashboard();
}

function showAccounts() {
    if (!authToken) {
        showLogin();
        return;
    }
    hideAllSections();
    document.getElementById('accounts-section').style.display = 'block';
    loadAccounts();
}

function showTransactions() {
    if (!authToken) {
        showLogin();
        return;
    }
    hideAllSections();
    document.getElementById('transactions-section').style.display = 'block';
    loadTransactions();
}

function hideAllSections() {
    const sections = ['login-section', 'dashboard-section', 'accounts-section', 'transactions-section'];
    sections.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
}

// API functions
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (authToken) {
        options.headers.Authorization = `Bearer ${authToken}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'API request failed');
        }
        
        return result;
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

// Authentication
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const result = await apiCall('/auth/login', 'POST', { email, password });
        authToken = result.token;
        localStorage.setItem('authToken', authToken);
        showSuccess('Login successful!');
        showDashboard();
    } catch (error) {
        showError('Login failed: ' + error.message);
    }
});

// Dashboard
async function loadDashboard() {
    try {
        const [accounts, transactions] = await Promise.all([
            apiCall('/accounts'),
            apiCall('/transactions')
        ]);
        
        document.getElementById('total-accounts').textContent = accounts.length || 0;
        document.getElementById('total-transactions').textContent = transactions.length || 0;
    } catch (error) {
        showError('Failed to load dashboard data');
    }
}

// Accounts
async function loadAccounts() {
    try {
        const accounts = await apiCall('/accounts');
        const accountsList = document.getElementById('accounts-list');
        
        accountsList.innerHTML = accounts.map(account => `
            <div class="list-item">
                <strong>${account.name}</strong> - ${account.type}
                <br>Balance: $${account.balance || 0}
            </div>
        `).join('');
    } catch (error) {
        showError('Failed to load accounts');
    }
}

function createAccount() {
    const name = prompt('Account Name:');
    const type = prompt('Account Type (asset/liability/equity/revenue/expense):');
    
    if (name && type) {
        apiCall('/accounts', 'POST', { name, type })
            .then(() => {
                showSuccess('Account created successfully!');
                loadAccounts();
            })
            .catch(() => showError('Failed to create account'));
    }
}

// Transactions
async function loadTransactions() {
    try {
        const transactions = await apiCall('/transactions');
        const transactionsList = document.getElementById('transactions-list');
        
        transactionsList.innerHTML = transactions.map(transaction => `
            <div class="list-item">
                <strong>$${transaction.amount}</strong> - ${transaction.description}
                <br>Date: ${new Date(transaction.date).toLocaleDateString()}
            </div>
        `).join('');
    } catch (error) {
        showError('Failed to load transactions');
    }
}

function createTransaction() {
    const amount = prompt('Amount:');
    const description = prompt('Description:');
    
    if (amount && description) {
        apiCall('/transactions', 'POST', { 
            amount: parseFloat(amount), 
            description,
            date: new Date().toISOString()
        })
            .then(() => {
                showSuccess('Transaction created successfully!');
                loadTransactions();
            })
            .catch(() => showError('Failed to create transaction'));
    }
}

// Utility functions
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.getElementById('main-content').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success';
    successDiv.textContent = message;
    document.getElementById('main-content').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showDashboard();
    } else {
        showLogin();
    }
});