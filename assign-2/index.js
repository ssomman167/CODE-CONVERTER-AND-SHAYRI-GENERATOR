const express = require('express');
require("dotenv").config();
const path = require('path');

const app = express();
const port = 8000;
const cors=require("cors")
app.use(cors())

app.use(express.json());

const { Configuration, OpenAIApi } = require("openai");

async function generateCompletion(input) {
  try {
    const prompt = input;
    const maxTokens = 500;
    const n = 1;

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
    
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: maxTokens,
        n: n
      });
    console.log(response.data.choices)
    const { choices } = response.data;
    if (choices && choices.length > 0) {
      const completion = choices[0].text.trim();
      return completion
    } else {
      return false
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
app.post('/shayari', async (req, res) => {
  try {
    const {shayari} = req.body;
 
    let response = await generateCompletion(`Create a shayari on- ${shayari}`);
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});