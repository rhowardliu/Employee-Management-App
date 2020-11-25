const router = require('express').Router();
const {parse} = require('fast-csv');
let Employee = require('../models/employee.model');
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    max: 1,
    message: "Another request is being handled. Please try again later."
})


router.route('/').get((req, res) =>{
    const requiredParameters = ['minSalary', 'maxSalary', 'limit', 'offset', 'sort']
    requiredParameters.forEach(param=>{
        if(!req.query.hasOwnProperty(param)){
            res.status(400).json('Error: Not all required parameters are present');
            return
        }
    })
    let query_params = req.query
    if (query_params.sort.slice(1,) === 'id') query_params.sort = query_params.sort.slice(0,1) + '_id';
    Employee.find({
        salary: {$gte: query_params.minSalary, $lte:query_params.maxSalary}
    }, null, {
        limit:Math.min(30, query_params.limit),
        skip:parseInt(query_params.offset),
    }).sort(query_params.sort)
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: Invalid filter'));
})

router.route('/upload', limiter).post((req, res) =>{
    const fields = new Set(['id', 'login', 'name', 'salary'])
    const dataFile = req.files.file;
    const employeeData = dataFile.data.toString('utf8');
    let bulk = Employee.collection.initializeUnorderedBulkOp();
    let validationError = undefined
    const stream = parse({headers:true, comment:'#'})
    .on('headers', headers=>{
        headers.forEach(header=>{
            if (!fields.has(header)){
                console.log(fields)
                res.status(400).json('Error: headers must be (id, login, name, salary).');
            }
        })
    })
    .on('data', dataRow =>{
        const _id = dataRow.id;
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
        })
    .on('error', ()=>{
        res.status(400).json('Error: One or more rows have incorrect number of fields.');
    })
    .on('end', ()=>{
        if (!!validationError){
            res.status(400).json('Error: One or more fields have an invalid format.');
            console.log(validationError);
        }
        else{
            bulk.execute()
            .then(()=>{res.json('File Upload is successful')})
            .catch(error=>{
                res.status(400).json('Error: Login field must be unique.');
            })
        }
    })
    stream.write(employeeData);
    stream.end();

});


module.exports = router;