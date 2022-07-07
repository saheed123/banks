require('dotenv').config();

const mongoose = require('mongoose');
const hostname = '127.0.0.1';
const dbPorts = process.env.dbPort;

 mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
 .then(success=>{
   if (!success) {
      console.log('connection error');
    } else {
      console.log(`connection successfull on localhost ${hostname} database port ${dbPorts}`);
    }
const conn = mongoose.connection;
conn.on('error', () => console.error.bind(console, 'connection error'));
conn.on('open', () => console.info('connection to database is successful'));    
 })
  



