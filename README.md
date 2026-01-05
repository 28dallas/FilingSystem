# Digital Document Filing & Tracking System

A modern, web-based document management system designed for organizations to digitize and track official documents such as Gate Passes, Job Cards, Invoices, Asset Movement Forms, and Score Cards.

## 🚀 Features

### Core Functionality
- **Dashboard Overview**: Real-time statistics and recent activity
- **Document Creation**: Dynamic forms for different document types
- **Search & History**: Advanced filtering and search capabilities
- **Digital Storage**: Persistent data storage with JSON Server backend
- **Status Tracking**: Document lifecycle management (Pending, Approved, Completed, Returned)

### Document Types Supported
1. **Gate Pass** - For computer/asset exit tracking
2. **Job Cards** - Work order management
3. **Invoices** - Financial document tracking
4. **Asset Movement** - Internal asset transfer forms
5. **Score Cards** - Employee performance evaluations

### Key Features
- ✅ Auto-generated document IDs
- ✅ Date-based filtering
- ✅ Name-based search
- ✅ Status management
- ✅ Responsive design
- ✅ Print-friendly layouts
- ✅ Modal document viewer
- ✅ Form validation
- ✅ Local storage backup

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: JSON Server (for development)
- **Storage**: LocalStorage + JSON Server
- **Styling**: Custom CSS with responsive design
- **Icons**: Unicode emojis for simplicity

## 📁 Project Structure

```
FileSystem/
├── index.html          # Main application file
├── styles.css          # Complete styling
├── script.js           # Application logic
├── db.json            # JSON Server database
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## 🚀 Quick Start

### Option 1: Simple Setup (Local Storage Only)
1. Open `index.html` in your web browser
2. Start creating and managing documents immediately
3. Data is stored in browser's localStorage

### Option 2: Full Setup (With JSON Server Backend)
1. Install Node.js on your system
2. Navigate to the project directory:
   ```bash
   cd /path/to/FileSystem
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the JSON Server:
   ```bash
   npm start
   ```
5. Open another terminal and start the development server:
   ```bash
   npm run dev
   ```
6. Access the application at `http://localhost:3000`

## 📋 Usage Guide

### Creating Documents
1. Click on **Create Document** or use Quick Actions on Dashboard
2. Select document type from dropdown
3. Fill in the required fields (marked with *)
4. Click **Save Document**

### Searching Documents
1. Go to **Search & History** section
2. Use filters:
   - **Name**: Search by person name or document ID
   - **Document Type**: Filter by specific document types
   - **Date Range**: Set from/to dates
   - **Status**: Filter by document status
3. Click **Search** to view results

### Viewing Document Details
1. Click on any document in search results
2. View complete document information in modal
3. Options available:
   - **Edit**: Modify document details
   - **Print**: Print-friendly view
   - **Export PDF**: Generate PDF (requires implementation)

## 🔧 Customization

### Adding New Document Types
1. Edit the `documentTypes` object in `script.js`
2. Define fields with types: `text`, `select`, `textarea`, `date`, `number`
3. Add corresponding options for select fields

Example:
```javascript
'custom-form': {
    name: 'Custom Form',
    fields: [
        { name: 'customField', label: 'Custom Field', type: 'text', required: true },
        { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'High'], required: true }
    ]
}
```

### Styling Customization
- Modify `styles.css` for visual changes
- Update color scheme by changing CSS variables
- Responsive breakpoints can be adjusted in media queries

## 📊 Document ID Format

Documents are automatically assigned IDs based on:
- **Format**: `[TYPE][YEAR][MONTH][SEQUENCE]`
- **Examples**:
  - Gate Pass: `GATEPASS24010001`
  - Job Card: `JOBCARD24010001`
  - Invoice: `INVOICE24010001`

## 🔒 Security Considerations

### Current Implementation
- Client-side storage (localStorage)
- No authentication system
- Basic form validation

### Production Recommendations
- Implement user authentication
- Add role-based access control
- Use secure backend database
- Add input sanitization
- Implement audit logging

## 🚀 Future Enhancements

### Planned Features
- [ ] PDF export functionality
- [ ] Email notifications
- [ ] Advanced reporting
- [ ] File attachments
- [ ] Digital signatures
- [ ] Mobile app version
- [ ] Integration with existing systems

### Technical Improvements
- [ ] Database migration (PostgreSQL/MySQL)
- [ ] RESTful API development
- [ ] User authentication system
- [ ] Role-based permissions
- [ ] Backup and recovery
- [ ] Performance optimization

## 🐛 Troubleshooting

### Common Issues

**Documents not saving:**
- Check browser localStorage is enabled
- Ensure all required fields are filled
- Verify JavaScript is enabled

**Search not working:**
- Clear browser cache
- Check date format (YYYY-MM-DD)
- Ensure documents exist in storage

**Styling issues:**
- Hard refresh browser (Ctrl+F5)
- Check CSS file is loading
- Verify responsive design on different screens

## 📝 Sample Data

The system includes sample documents for testing:
- Gate Pass for laptop checkout
- Job Card for server maintenance
- Invoice for consulting services
- Asset Movement for equipment transfer
- Score Card for employee evaluation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check documentation for common solutions

---

**Built with ❤️ for efficient document management**