const connectToMongo = require('./db');
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const path = require("path");
const cors = require('cors')


const port =  5000;
app.use(cors())
app.use(bodyParser.json());
app.use(express.json())

connectToMongo();
app.use(express.json());


//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

if(process.env.NODE_ENV === 'production'){

  // Step 1:
  app.use(express.static(path.resolve(__dirname, "../build")));
  // Step 2:
  app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../build", "index.html"));
});

}
app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}/`)
})