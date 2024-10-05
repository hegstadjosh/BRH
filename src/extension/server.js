const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

// Replace with your actual OpenAI API key
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

app.get('/get-prompt', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt: "Provide an engaging prompt to inspire note-taking:",
        max_tokens: 50,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    const prompt = response.data.choices[0].text.trim();
    res.json({ prompt });
  } catch (error) {
    console.error('Error generating AI prompt:', error.response.data);
    res.status(500).send('Error generating prompt');
  }
});

app.listen(3000, () => {
  console.log('Backend server running on port 3000');
});
