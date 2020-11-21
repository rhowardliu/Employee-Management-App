const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(fileUpload({
    createParentPath: true
}))
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true})
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log('Connected to MongoDB database');
})
;

const employeesRouter = require('./routes/employees')

app.use('/users', employeesRouter)

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});