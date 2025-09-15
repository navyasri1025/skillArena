const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 5001;

// Initialize the Google AI model
// IMPORTANT: You must set your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.use(cors());
app.use(bodyParser.json());

app.post('/api/analyze', async (req, res) => {
  const { text, topic } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      Analyze the following explanation of the topic "${topic}" and provide a rating, score, and feedback.
      The rating should be one of: Poor, Good, Very Good, Excellent.
      The score should be a number between 0 and 100.
      The feedback should be a short paragraph explaining what was good and what could be improved.

      Explanation: "${text}"

      Provide the output in JSON format with the keys: "rating", "score", and "feedback".
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    console.log('Raw AI response:', rawText);

    // Use a regular expression to extract the JSON object
    const jsonMatch = rawText.match(/\{.*\}/s);
    if (!jsonMatch) {
      throw new Error('No JSON object found in the response');
    }
    const jsonText = jsonMatch[0];

    const analysis = JSON.parse(jsonText);
    console.log('Parsed AI response:', analysis);

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing text with AI:', error);
    if (error.message.includes('503')) {
      res.status(503).json({ error: 'The AI model is temporarily overloaded. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Failed to analyze text' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});