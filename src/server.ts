import express from 'express';
import routes from './routes';
import bodyParser from 'body-parser';

const app = express()

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use('/api',routes);

app.use(express.json()); 
app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})
