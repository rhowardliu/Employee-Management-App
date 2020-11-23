const router = require('express').Router();
// const fs = require('fs')
// const csv = require('csv-parser')
const {parse} = require('fast-csv');
let Employee = require('../models/employee.model');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    max: 1,
    message: "Another request is being handled. Please try again later."
})


router.route('/').get((req, res) =>{
    const query_params = req.query
    Employee.find({
        salary: {$gte: query_params.min_salary, $lte:query_params.max_salary}
    }, null, {
        limit:Math.min(30, query_params.limit),
        skip:parseInt(query_params.offset),
    }).sort(query_params.sort)
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/upload', limiter).post((req, res) =>{
    const dataFile = req.files.file;
    const employeeData = dataFile.data.toString('utf8');
    let bulk = Employee.collection.initializeUnorderedBulkOp();
    let validationError = undefined
    const stream = parse({headers:true})
    .on('data', dataRow =>{
        const _id = dataRow.id;
        if (_id[0] == '#') return;
        const login = dataRow.login;
        const name = dataRow.name;
        const salary = dataRow.salary;
        const newEmployee = new Employee({
            _id, login, name, salary
        });

        validationError = validationError || newEmployee.validateSync() 
        bulk.find({_id:newEmployee._id}).upsert().updateOne({$set:{
            login: newEmployee.login,
            name: newEmployee.name,
            salary: newEmployee.salary,
        }})
        }).on('end', ()=>{
            if (!!validationError){
                res.status(400).json('Error: One or more fields have an invalid format.');
                console.log(validationError);
            }
            else{
                bulk.execute()
                .then(()=>{res.json('File Upload is successful')})
                .catch(error=>{
                    res.status(400).json('Error: Login field must be unique.');
                    console.log(error)
                })
            }
        })
    stream.write(employeeData);
    stream.end();

});


module.exports = router;