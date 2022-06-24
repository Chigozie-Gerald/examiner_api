require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const compression = require('compression');
const mongoose = require('mongoose');
const { errorObj } = require('./errorObject');
const profileRouter = require('./routes/profile');
//const net = require('net');

//connect mongodb
app.use(express.json());
app.use(cors()); //cors
app.use(compression()); //compression
app.use(express.urlencoded({ extended: false }));

//Routes
app.use('/api', profileRouter);
app.listen(
  6060,
  mongoose
    .connect('mongodb://127.0.0.1/examiner', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      mongoose.set('runValidators', true);

      console.log('Mongo connected...');
      console.log('Server started on port 6060');
    })
    .catch((err) => console.log(err)),
);

/*console.log(123);
const client = net.createConnection({ port: 1010 }, () => {
  console.log('mongoose says helvvlo');
});

client.on('connect', () => {
  console.log('Just connected to the java server!');
});

module.exports = { client };*/
