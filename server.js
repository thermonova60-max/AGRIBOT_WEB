import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// Ollama Configuration
const OLLAMA_URL = 'http://localhost:11434/api/chat';
const OLLAMA_MODEL = 'llama3.2:3b';

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Proxy endpoint for Ollama API with streaming
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationContext } = req.body;

    const systemPrompt = `You are Agri-Bot, an expert AI agricultural assistant for Indian farmers. You provide helpful, accurate, and practical farming advice.

Your expertise includes:
- Crop cultivation (rice, wheat, vegetables, fruits, cotton, sugarcane, etc.)
- Irrigation and water management
- Fertilizers and soil health
- Pest and disease management (IPM)
- Organic and natural farming
- Government schemes (PM-KISAN, KCC, PMFBY, PKVY, etc.)
- Market prices and selling strategies
- Farm equipment and mechanization
- Livestock and dairy farming
- Weather and climate-smart agriculture

Guidelines:
- Give practical, actionable advice
- Use simple language farmers can understand
- Include specific numbers (yields, rates, timings) when relevant
- Mention relevant government schemes and subsidies
- Use emojis to make responses friendly
- Keep responses concise but informative
- If asked about non-agricultural topics, politely redirect to farming topics
- Provide India-specific advice (crops, seasons, schemes)`;

    // Build messages array for Ollama chat API
    const messages = [
      { role: 'system', content: systemPrompt }
    ];
    
    // Add conversation history
    if (conversationContext && conversationContext.length > 0) {
      conversationContext.slice(-6).forEach(msg => {
        messages.push({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        });
      });
    }
    
    // Add current user message
    messages.push({ role: 'user', content: message });

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: messages,
        stream: true
      })
    });

    if (!response.ok) {
      const errorData = await response.text().catch(() => '');
      console.error('Ollama API Error:', errorData);
      res.write(`data: ${JSON.stringify({ error: errorData })}\n\n`);
      res.end();
      return;
    }

    // Stream the response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.message && data.message.content) {
            res.write(`data: ${JSON.stringify({ token: data.message.content })}\n\n`);
          }
          if (data.done) {
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          }
        } catch (e) {
          // Skip invalid JSON lines
        }
      }
    }

    res.end();

  } catch (error) {
    console.error('Server error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Listen on all network interfaces (0.0.0.0) to allow other devices to connect
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🌾 Agri-Bot Server running!`);
  console.log(`📱 Local: http://localhost:${PORT}/bot.html`);
  console.log(`🌐 Network: http://<YOUR-IP>:${PORT}/bot.html`);
  console.log(`   (Run 'ipconfig' to find your IP address)\n`);
});
