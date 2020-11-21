const router = require('express').Router();
// const fs = require('fs')
// const csv = require('csv-parser')
const {parse} = require('fast-csv');
let Employee = require('../models/employee.model');


router.route('/').get((req, res) =>{
    query_params = req.query    
    Employee.find({
        salary: {$gte: query_params.min_salary, $lte:query_params.max_salary}
    }, null, {
        limit:30,
        skip:parseInt(query_params.offset),
    }).sort({

    })
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
    
})

router.route('/upload').post(async (req, res) =>{
    const dataFile = req.files.file;
    const employeeData = dataFile.data.toString('utf8');
    let bulk = Employee.collection.initializeUnorderedBulkOp();
    let validationError = undefined
    const stream = parse({headers:true})
    .on('data', dataRow =>{
        const id = dataRow.id;
        const login = dataRow.login;
        const name = dataRow.name;
        const salary = dataRow.salary;
        const newEmployee = new Employee({
            id, login, name, salary
        });

        validationError = validationError || newEmployee.validateSync() 
        bulk.find({id:newEmployee.id}).upsert().updateOne({$set:{
            login: newEmployee.login,
            name: newEmployee.name,
            salary: newEmployee.salary,
        }})
        }).on('end', ()=>{
            if (!!validationError){
                res.status(400).json('Error ' + validationError);
            }
            else{
                bulk.execute()
                .then(()=>{res.json('Successfully added')})
                .catch(error=>{
                    res.status(400).json('Error: ' + error);
                })
            }
        })
    stream.write(employeeData);
    stream.end();

});


module.exports = router;