const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const config = require('./config');
const OpenAI = require('openai');
const PDFDocument = require('pdfkit');

const app = express();
const port = config.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// OpenAI proxy endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { personaContext, chatHistory, userMessage, model, maxTokens, temperature } = req.body;

    if (!config.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        details: 'Please set OPENAI_API_KEY in config.js file'
      });
    }

    console.log('Received request:', { personaContext, userMessage });

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: model || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: personaContext },
            ...(chatHistory || []),
            { role: 'user', content: userMessage },
          ],
          max_tokens: maxTokens || 512,
          temperature: temperature || 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        
        return res.status(response.status).json({ 
          error: `OpenAI API error: ${response.status} ${response.statusText}`,
          details: errorData
        });
      }

      const responseData = await response.json();
      console.log('OpenAI Response:', responseData);

      if (!responseData.choices?.[0]?.message?.content) {
        console.error('No AI response in data:', responseData);
        return res.status(500).json({ 
          error: 'No AI response',
          details: 'The API response did not contain a message'
        });
      }

      res.json({ message: responseData.choices[0].message.content.trim() });
    } catch (fetchError) {
      console.error('Network error:', fetchError);
      return res.status(500).json({
        error: 'Network error',
        details: fetchError.message,
        type: fetchError.type || 'unknown'
      });
    }
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.stack
    });
  }
});

app.post('/api/generate-report', async (req, res) => {
  try {
    const { reportType, userId, profile } = req.body;
    if (!config.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }
    // Compose a prompt using user profile and report type
    const prompt = `Generate a detailed ${reportType} for the following user:\n` +
      `Name: ${profile?.name}\nGender: ${profile?.gender}\nBirth Details: ${JSON.stringify(profile?.birthDetails)}\n\n` +
      `Do NOT mention or sign with any astrologer name in the report. Only provide the report content.\n\nReport:`;

    const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    const reportText = completion.choices[0].message.content;

    // Generate PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${reportType}.pdf"`);
      res.send(pdfData);
    });
    doc.fontSize(18).text(reportType, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(reportText || 'No report generated.');
    doc.end();
  } catch (err) {
    console.error('Report generation error:', err);
    res.status(500).json({ error: 'Failed to generate report', details: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message
  });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try a different port or kill the process using this port.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
}); 