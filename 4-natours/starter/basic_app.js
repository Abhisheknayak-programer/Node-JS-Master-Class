const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello Abhishek Sir');
});

app.get('/data', (req, res) => {
  res.status(200).json({ message: 'Hello Abhishek Sir', app: 'natours' });
});

app.post('/', (req, res) => {
  res.status(201).send('You can post this endpoint');
});

const port = 8000;
app.listen(port, () => {
  console.log(`App running on 127.0.0.1:${port}`);
});
