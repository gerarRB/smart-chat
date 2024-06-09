import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { CohereClient } from 'cohere-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY 
});

app.get('/', (req, res) => {
  res.status(200).send({ message: 'Hello World' });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    console.log('Prompt recibido:', prompt);

    // Solicitud a la API de Cohere
    const response = await cohere.chat({
      chatHistory: [], 
      message: prompt,
      connectors: [] 
    });

    console.log('Respuesta de Cohere:', response);


    res.status(200).send({
      bot: response.text 
    });
  } catch (error) {
    console.error('Error en la solicitud a Cohere:', error.message);
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
