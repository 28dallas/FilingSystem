const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Load database
let db = {};
try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    db = JSON.parse(data);
} catch (error) {
    console.error('Error loading database:', error);
    db = { documents: [], users: [], settings: {} };
}

// Save database
function saveDB() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

// Routes

// Get all documents
app.get('/api/documents', (req, res) => {
    res.json(db.documents || []);
});

// Get document by ID
app.get('/api/documents/:id', (req, res) => {
    const document = db.documents.find(doc => doc.id === req.params.id);
    if (!document) {
        return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
});

// Create new document
app.post('/api/documents', (req, res) => {
    const newDocument = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    db.documents = db.documents || [];
    db.documents.push(newDocument);
    saveDB();
    
    res.status(201).json(newDocument);
});

// Update document
app.put('/api/documents/:id', (req, res) => {
    const index = db.documents.findIndex(doc => doc.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Document not found' });
    }
    
    db.documents[index] = {
        ...db.documents[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    
    saveDB();
    res.json(db.documents[index]);
});

// Delete document
app.delete('/api/documents/:id', (req, res) => {
    const index = db.documents.findIndex(doc => doc.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Document not found' });
    }
    
    db.documents.splice(index, 1);
    saveDB();
    res.status(204).send();
});

// Search documents
app.get('/api/documents/search', (req, res) => {
    const { name, type, dateFrom, dateTo, status } = req.query;
    let results = db.documents || [];
    
    if (name) {
        results = results.filter(doc => 
            doc.personName.toLowerCase().includes(name.toLowerCase()) ||
            doc.docId.toLowerCase().includes(name.toLowerCase())
        );
    }
    
    if (type) {
        results = results.filter(doc => doc.type === type);
    }
    
    if (dateFrom) {
        results = results.filter(doc => doc.date >= dateFrom);
    }
    
    if (dateTo) {
        results = results.filter(doc => doc.date <= dateTo);
    }
    
    if (status) {
        results = results.filter(doc => doc.status === status);
    }
    
    res.json(results);
});

// Get dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
    const documents = db.documents || [];
    const currentMonth = new Date().getMonth();
    
    const stats = {
        totalDocuments: documents.length,
        pendingDocuments: documents.filter(doc => doc.status === 'pending').length,
        monthlyDocuments: documents.filter(doc => 
            new Date(doc.date).getMonth() === currentMonth
        ).length,
        recentDocuments: documents
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
    };
    
    res.json(stats);
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Digital Document Filing System server running on port ${PORT}`);
    console.log(`Access the application at: http://localhost:${PORT}`);
});

module.exports = app;