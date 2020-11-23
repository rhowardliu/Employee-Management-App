const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    _id:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    login:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name:{
        type: String,
        required: true,
        trim: true,
    },
    salary:{
        type: Number,
        min: 0,
        required: true
    }
},{
    validateBeforeSave: true,
})

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee;