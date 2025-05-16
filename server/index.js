require('dotenv').config();

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

// Debug the environment variable
console.log('API_URL from env:', process.env.API_URL);

// Default API URL if environment variable is not set
const API_URL = process.env.API_URL || 'http://24.35.35.32:5000/chanti/products';
console.log('Using API URL:', API_URL);

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy route for products
app.get('/api/products', async (req, res) => {
  try {
    console.log('Attempting to fetch from:', API_URL);
    
    if (!API_URL) {
      console.error('API_URL is not defined');
      return res.status(500).json({ error: 'API URL configuration missing' });
    }
    
    const apiResponse = await fetch(API_URL, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', apiResponse.status);
    
    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('API Error:', apiResponse.status, errorText);
      return res.status(apiResponse.status).json({ 
        error: 'Failed to fetch products', 
        status: apiResponse.status, 
        details: errorText 
      });
    }

    const data = await apiResponse.json();
    res.json(data);
  } catch (err) {
    console.error('Error details:', err);
    // Send back more details for debugging
    res.status(500).json({ 
      error: 'Internal server error', 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Serve React static files from build folder
app.use(express.static(path.join(__dirname, '../client/build')));

// For any other routes, serve React index.html (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});