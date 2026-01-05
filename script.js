// Global variables
let documents = JSON.parse(localStorage.getItem('documents')) || [];
let currentEditId = null;

// Document type configurations
const documentTypes = {
    'gate-pass': {
        name: 'Gate Pass',
        fields: [
            { name: 'assetType', label: 'Asset Type', type: 'select', options: ['Laptop', 'Desktop', 'Printer', 'Monitor', 'Other'], required: true },
            { name: 'assetTag', label: 'Asset Tag/Serial Number', type: 'text', required: true },
            { name: 'exitDate', label: 'Exit Date', type: 'date', required: true },
            { name: 'returnDate', label: 'Expected Return Date', type: 'date', required: true },
            { name: 'purpose', label: 'Purpose/Reason', type: 'textarea', required: true }
        ]
    },
    'job-card': {
        name: 'Job Card',
        fields: [
            { name: 'jobTitle', label: 'Job Title', type: 'text', required: true },
            { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'], required: true },
            { name: 'assignedTo', label: 'Assigned To', type: 'text', required: true },
            { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
            { name: 'description', label: 'Job Description', type: 'textarea', required: true }
        ]
    },
    'invoice': {
        name: 'Invoice',
        fields: [
            { name: 'invoiceNumber', label: 'Invoice Number', type: 'text', required: true },
            { name: 'clientName', label: 'Client Name', type: 'text', required: true },
            { name: 'amount', label: 'Amount', type: 'number', required: true },
            { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
            { name: 'description', label: 'Service Description', type: 'textarea', required: true }
        ]
    },
    'asset-movement': {
        name: 'Asset Movement',
        fields: [
            { name: 'assetName', label: 'Asset Name', type: 'text', required: true },
            { name: 'fromLocation', label: 'From Location', type: 'text', required: true },
            { name: 'toLocation', label: 'To Location', type: 'text', required: true },
            { name: 'movementDate', label: 'Movement Date', type: 'date', required: true },
            { name: 'reason', label: 'Reason for Movement', type: 'textarea', required: true }
        ]
    },
    'score-card': {
        name: 'Score Card',
        fields: [
            { name: 'employeeName', label: 'Employee Name', type: 'text', required: true },
            { name: 'period', label: 'Review Period', type: 'text', required: true },
            { name: 'score', label: 'Overall Score', type: 'number', required: true },
            { name: 'reviewer', label: 'Reviewer', type: 'text', required: true },
            { name: 'comments', label: 'Comments', type: 'textarea', required: true }
        ]
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();
    setCurrentDate();
    generateDocumentId();
});

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Add active class to clicked nav button
    event.target.classList.add('active');
    
    // Update dashboard when switching to it
    if (sectionName === 'dashboard') {
        updateDashboard();
    }
}

// Dashboard functions
function updateDashboard() {
    const totalDocs = documents.length;
    const pendingDocs = documents.filter(doc => doc.status === 'pending').length;
    const currentMonth = new Date().getMonth();
    const monthlyDocs = documents.filter(doc => 
        new Date(doc.date).getMonth() === currentMonth
    ).length;
    
    document.getElementById('totalDocs').textContent = totalDocs;
    document.getElementById('pendingDocs').textContent = pendingDocs;
    document.getElementById('monthlyDocs').textContent = monthlyDocs;
    
    updateRecentActivity();
}

function updateRecentActivity() {
    const recentList = document.getElementById('recentList');
    const recentDocs = documents
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    if (recentDocs.length === 0) {
        recentList.innerHTML = '<p style="text-align: center; color: #6c757d;">No recent activity</p>';
        return;
    }
    
    recentList.innerHTML = recentDocs.map(doc => `
        <div class="activity-item">
            <div>
                <strong>${doc.docId}</strong> - ${documentTypes[doc.type]?.name || doc.type}
                <br><small>${doc.personName}</small>
            </div>
            <div>
                <span class="result-status status-${doc.status}">${doc.status}</span>
                <br><small>${formatDate(doc.date)}</small>
            </div>
        </div>
    `).join('');
}

// Document creation functions
function createDocument(type) {
    showSection('create');
    document.getElementById('docType').value = type;
    updateFormFields();
}

function updateFormFields() {
    const docType = document.getElementById('docType').value;
    const dynamicFields = document.getElementById('dynamicFields');
    
    if (!docType || !documentTypes[docType]) {
        dynamicFields.innerHTML = '';
        return;
    }
    
    const fields = documentTypes[docType].fields;
    dynamicFields.innerHTML = fields.map(field => {
        if (field.type === 'select') {
            return `
                <div class="form-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <select id="${field.name}" ${field.required ? 'required' : ''}>
                        <option value="">Select ${field.label}</option>
                        ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                    </select>
                </div>
            `;
        } else if (field.type === 'textarea') {
            return `
                <div class="form-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <textarea id="${field.name}" rows="3" ${field.required ? 'required' : ''}></textarea>
                </div>
            `;
        } else {
            return `
                <div class="form-group">
                    <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
                    <input type="${field.type}" id="${field.name}" ${field.required ? 'required' : ''}>
                </div>
            `;
        }
    }).join('');
    
    generateDocumentId();
}

function generateDocumentId() {
    const docType = document.getElementById('docType').value;
    if (!docType) return;
    
    const prefix = docType.toUpperCase().replace('-', '');
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const count = documents.filter(doc => doc.type === docType).length + 1;
    
    const docId = `${prefix}${year}${month}${count.toString().padStart(3, '0')}`;
    document.getElementById('docId').value = docId;
}

function setCurrentDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('docDate').value = today;
}

function saveDocument() {
    const form = document.getElementById('documentForm');
    const docType = document.getElementById('docType').value;
    
    if (!docType) {
        alert('Please select a document type');
        return;
    }
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const document = {
        id: currentEditId || Date.now().toString(),
        docId: document.getElementById('docId').value,
        type: docType,
        date: document.getElementById('docDate').value,
        personName: document.getElementById('personName').value,
        authorizedBy: document.getElementById('authorizedBy').value,
        status: document.getElementById('status').value,
        createdAt: currentEditId ? documents.find(d => d.id === currentEditId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Add dynamic fields
    if (documentTypes[docType]) {
        documentTypes[docType].fields.forEach(field => {
            const element = document.getElementById(field.name);
            if (element) {
                document[field.name] = element.value;
            }
        });
    }
    
    if (currentEditId) {
        const index = documents.findIndex(d => d.id === currentEditId);
        documents[index] = document;
        currentEditId = null;
    } else {
        documents.push(document);
    }
    
    localStorage.setItem('documents', JSON.stringify(documents));
    
    alert('Document saved successfully!');
    clearForm();
    updateDashboard();
}

function clearForm() {
    document.getElementById('documentForm').reset();
    document.getElementById('docType').value = '';
    document.getElementById('dynamicFields').innerHTML = '';
    currentEditId = null;
    setCurrentDate();
}

// Search functions
function searchDocuments() {
    const searchName = document.getElementById('searchName').value.toLowerCase();
    const searchType = document.getElementById('searchType').value;
    const searchDateFrom = document.getElementById('searchDateFrom').value;
    const searchDateTo = document.getElementById('searchDateTo').value;
    const searchStatus = document.getElementById('searchStatus').value;
    
    let filteredDocs = documents.filter(doc => {
        const matchesName = !searchName || 
            doc.personName.toLowerCase().includes(searchName) ||
            doc.docId.toLowerCase().includes(searchName);
        
        const matchesType = !searchType || doc.type === searchType;
        
        const matchesDateFrom = !searchDateFrom || doc.date >= searchDateFrom;
        const matchesDateTo = !searchDateTo || doc.date <= searchDateTo;
        
        const matchesStatus = !searchStatus || doc.status === searchStatus;
        
        return matchesName && matchesType && matchesDateFrom && matchesDateTo && matchesStatus;
    });
    
    displaySearchResults(filteredDocs);
}

function displaySearchResults(results) {
    const resultsCount = document.getElementById('resultsCount');
    const searchResults = document.getElementById('searchResults');
    
    resultsCount.textContent = `${results.length} document${results.length !== 1 ? 's' : ''} found`;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="text-align: center; padding: 2rem; color: #6c757d;">No documents found matching your criteria</p>';
        return;
    }
    
    searchResults.innerHTML = results.map(doc => `
        <div class="result-item" onclick="viewDocument('${doc.id}')">
            <div class="result-header">
                <div class="result-title">${doc.docId} - ${documentTypes[doc.type]?.name || doc.type}</div>
                <span class="result-status status-${doc.status}">${doc.status}</span>
            </div>
            <div class="result-details">
                <strong>${doc.personName}</strong> • ${formatDate(doc.date)} • Authorized by: ${doc.authorizedBy}
            </div>
        </div>
    `).join('');
}

function clearSearch() {
    document.getElementById('searchName').value = '';
    document.getElementById('searchType').value = '';
    document.getElementById('searchDateFrom').value = '';
    document.getElementById('searchDateTo').value = '';
    document.getElementById('searchStatus').value = '';
    document.getElementById('searchResults').innerHTML = '';
    document.getElementById('resultsCount').textContent = '0 documents found';
}

// Modal functions
function viewDocument(docId) {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    const modal = document.getElementById('documentModal');
    const details = document.getElementById('documentDetails');
    
    let dynamicFields = '';
    if (documentTypes[doc.type]) {
        dynamicFields = documentTypes[doc.type].fields.map(field => {
            const value = doc[field.name] || 'N/A';
            return `<p><strong>${field.label}:</strong> ${value}</p>`;
        }).join('');
    }
    
    details.innerHTML = `
        <h2>${doc.docId} - ${documentTypes[doc.type]?.name || doc.type}</h2>
        <div style="margin: 1rem 0; padding: 1rem; background: #f8f9fa; border-radius: 4px;">
            <p><strong>Document ID:</strong> ${doc.docId}</p>
            <p><strong>Date:</strong> ${formatDate(doc.date)}</p>
            <p><strong>Person/Department:</strong> ${doc.personName}</p>
            <p><strong>Authorized By:</strong> ${doc.authorizedBy}</p>
            <p><strong>Status:</strong> <span class="result-status status-${doc.status}">${doc.status}</span></p>
            ${dynamicFields}
            <p><strong>Created:</strong> ${formatDateTime(doc.createdAt)}</p>
            ${doc.updatedAt !== doc.createdAt ? `<p><strong>Last Updated:</strong> ${formatDateTime(doc.updatedAt)}</p>` : ''}
        </div>
    `;
    
    modal.style.display = 'block';
    modal.dataset.docId = docId;
}

function closeModal() {
    document.getElementById('documentModal').style.display = 'none';
}

function editDocument() {
    const docId = document.getElementById('documentModal').dataset.docId;
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    closeModal();
    showSection('create');
    
    // Populate form with document data
    currentEditId = docId;
    document.getElementById('docType').value = doc.type;
    updateFormFields();
    
    document.getElementById('docId').value = doc.docId;
    document.getElementById('docDate').value = doc.date;
    document.getElementById('personName').value = doc.personName;
    document.getElementById('authorizedBy').value = doc.authorizedBy;
    document.getElementById('status').value = doc.status;
    
    // Populate dynamic fields
    if (documentTypes[doc.type]) {
        documentTypes[doc.type].fields.forEach(field => {
            const element = document.getElementById(field.name);
            if (element && doc[field.name]) {
                element.value = doc[field.name];
            }
        });
    }
}

function printDocument() {
    window.print();
}

function exportPDF() {
    alert('PDF export functionality would be implemented with a library like jsPDF');
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        alert('Logout functionality would redirect to login page');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('documentModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Sample data for testing
function loadSampleData() {
    if (documents.length === 0) {
        const sampleDocs = [
            {
                id: '1',
                docId: 'GATEPASS23010001',
                type: 'gate-pass',
                date: '2024-01-15',
                personName: 'John Doe',
                authorizedBy: 'Manager Smith',
                status: 'approved',
                assetType: 'Laptop',
                assetTag: 'LT001234',
                exitDate: '2024-01-15',
                returnDate: '2024-01-20',
                purpose: 'Work from home setup',
                createdAt: '2024-01-15T10:00:00Z',
                updatedAt: '2024-01-15T10:00:00Z'
            },
            {
                id: '2',
                docId: 'JOBCARD23010001',
                type: 'job-card',
                date: '2024-01-16',
                personName: 'IT Department',
                authorizedBy: 'CTO Johnson',
                status: 'pending',
                jobTitle: 'Server Maintenance',
                priority: 'High',
                assignedTo: 'Tech Team',
                dueDate: '2024-01-25',
                description: 'Monthly server maintenance and updates',
                createdAt: '2024-01-16T09:00:00Z',
                updatedAt: '2024-01-16T09:00:00Z'
            }
        ];
        
        documents = sampleDocs;
        localStorage.setItem('documents', JSON.stringify(documents));
        updateDashboard();
    }
}

// Load sample data on first visit
setTimeout(loadSampleData, 1000);