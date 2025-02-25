// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from "public" folder

// Endpoint to handle queries
app.post('/api/diagnose', async (req, res) => {
  const userQuery = req.body.query;
  if (!userQuery) {
    return res.status(400).json({ error: 'No query provided' });
  }

  try {
    // Use the correct structure for chat models
    const messages = [
      //{ role: "system", content: "You are a technical assistant for Windows 10. Provide troubleshooting steps in structured JSON format like this: { \"steps\": [\"Step 1\", \"Step 2\", \"Step 3\"] }." },
      { role: "system", content: "You are a technical assistant for Windows 10. Provide clear, structured, and actionable troubleshooting steps in a numbered list. Use concise language." },
      { role: "user", content: userQuery }
    ];
    
    // Call the OpenAI API using /v1/chat/completions
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o",  // Correct chat model
      messages: messages,  // Use messages array instead of a single prompt
      max_tokens: 200,
      temperature: 0.5,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const diagnosis = response.data.choices[0].message.content.trim()
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italics
      .replace(/\n/g, "<br>"); // Line breaks for better readability  
    res.json({ diagnosis });
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to get a response from OpenAI' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
