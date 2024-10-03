const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

app.use('/static', express.static(path.join(__dirname, 'mychat')));
app.use(express.json()); 

let clients = [];

app.get('/', (req, res) => {
  res.send('hi'); 
});

app.get('/json', (req, res) => {
  const responseData = {
      text: "hi",
      numbers: [1, 2, 3]
  };
  res.json(responseData); 
});

app.get('/echo', (req, res) => {
  const input = req.query.input;

  if (!input) {
      return res.status(400).send('Missing input parameter'); 
  }

  const responseData = {
      normal: input,
      shouty: input.toUpperCase(),
      characterCount: input.length,
      backwards: input.split('').reverse().join(''),
  };

  res.json(responseData); 
});

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

const sendToClients = (message) => {
  clients.forEach(client => client.write(`data: ${JSON.stringify(message)}\n\n`));
};

app.post('/chat', (req, res) => {
  const message = req.body;
  sendToClients(message); 
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
