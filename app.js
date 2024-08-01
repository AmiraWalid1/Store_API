const express = require('express');
const cors = require('cors');
const todo = require('./routes/product')
const user = require('./routes/user')
const morgan = require('morgan');
const dotenv = require('dotenv')

const app = express();

dotenv.config()
// cors policy [enable]
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));
app.use('/users', user);
app.use('/products', todo);

app.use((err,req, res, next)=> {
  const {name, message} = err;
  const status = err.status || 500;
  res.status(status).json({error: {name, message}});
});

app.use('/*', (req, res)=>{
  res.sendStatus(404);
});

module.exports = {app};
