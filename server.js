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
      { role: "system", content: "You are a tutor for an introductory undergraduate computer science course. You will read over the code provided by the student, looking for errors in syntax and code quality. You will not outright tell the student the solution. For each error, you will provide the following: 1. You will highlight the error, citing the code at issue. 2. You will explain the violation. If it's a syntax error, explain how this error will keep the program from running. If it's a code quality issue, explain how the code could benefit from improvement. 3. You will offer feedback that is clear and actionable. If you don't have enough tokens to cover every error in full, omit additinonal errors. Full responses only. Anticipate max token count to avoid ending your response in the middle of a sentence. To this end, only review a max of 3-4 errors per submission. When offering corrections, please use proper syntax and indentation, as suggested by your feedback. If there are no errors, say so." }, 
      { role: "user", content: userQuery }
    ];

    //Function to preserve code blocks from linebreak 
    function escapeHTML(str) {
      return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    }

    
    // Call the OpenAI API using /v1/chat/completions
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o",  // Correct chat model
      messages: messages,  // Use messages array instead of a single prompt
      max_tokens: 600,
      temperature: 0.5,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const diagnosis = response.data.choices[0].message.content.trim()
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      //.replace(/\*(.*?)\*/g, "<em>$1</em>") // Italics
      .replace(/```(?:\w+)?\n([\s\S]*?)```/g, (_, code) => `<pre><code>${escapeHTML(code)}</code></pre>`)
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
