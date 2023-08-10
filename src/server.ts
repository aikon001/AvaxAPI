const express = require('express')
const routes = require('./routes');
var bodyParser = require('body-parser')

const app = express()

const PORT = process.env.PORT || 80;

app.use(bodyParser.json());
app.use('/api',routes);

app.use(express.json()); 
app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})
