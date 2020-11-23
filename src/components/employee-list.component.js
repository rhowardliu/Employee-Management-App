import React, {Component} from 'react';
import axios from 'axios'

const ENDPOINT = "http://localhost:5000/users"


class SalaryFilter extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            min_salary:"0",
            max_salary:"10000"
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeMinSalary = this.handleChangeMinSalary.bind(this);
        this.handleChangeMaxSalary = this.handleChangeMaxSalary.bind(this);
    }

    handleChangeMinSalary(event){
        this.setState({min_salary: event.target.value});
    }

    handleChangeMaxSalary(event){
        this.setState({max_salary: event.target.value});
    }

    handleSubmit(event){
        this.props.onSearch(this.state);
        event.preventDefault();
    }

    render(){
        return(
            <div className="container-fluid d-flex justify-content-center flex-column w-50">
                    <h5 className="d-flex justify-content-center">Salary Filter</h5>
                    <form onSubmit={this.handleSubmit} className="row">
                        <label className="col">Minimum</label>
                        <label className="col">Maximum</label>
                        <div class="w-100"></div>
                        <input type="text" onChange={this.handleChangeMinSalary} className="col"/>
                        <input type="text" onChange={this.handleChangeMaxSalary} className="col"/>
                        <input type="submit" value="Filter"/>
                    </form>
            </div>

        )
    }

}


class Title extends React.Component {

    constructor(props){
        super(props);
        this.Titles = ["Id", "Name", "Login", "Salary"];
        this.state = {
            sort_by: "id",
            sort_order: "+"
        }
        this.handleClick = this.handleClick.bind(this);
    }

    renderTitle(title){
        return(
                <th key={title}>
                    <button onClick={this.handleClick} 
                            name={title} 
                            style={{border:'none', fontWeight:'bold'}}>
                        {title}
                    </button>
                </th>
        )
    }

    async handleClick(event){
        const sortField = event.target.name.toLowerCase();
        if (this.state.sort_by === sortField){
            let new_order = (this.state.sort_order === "+") ? "-" : "+"
            await this.setState({sort_order:new_order})
        }
        else{
            await this.setState({
                sort_by:sortField,
                sort_order:"+"
            })
        }
        this.props.onSort(this.state)
    }

    render(){
        let titleList = []
        this.Titles.forEach(title=>{
            titleList.push(this.renderTitle(title));
        })
        return(
            <tr>
                {titleList}
            </tr>
        )
    }

}

function EmployeeCard(props){
    return(
        <tr>
            <td>{props.id}</td>
            <td>{props.name}</td>
            <td>{props.login}</td>
            <td>{props.salary}</td>
        </tr>
    )
}


export default class EmployeeList extends Component{

    componentDidMount(){
        this.handleSearch();
    }

    constructor(props){
        super(props);
        this.state = {
            employees: [],
            min_salary:0,
            max_salary:10000000000,
            offset:0,
            limit:30,
            sort_by:"id",
            sort_order:"+"
        }
        this.handleSearch = this.handleSearch.bind(this);

    }

    buildQuery(){
        let query_params = ""
        query_params += "?min_salary=" + this.state.min_salary;
        query_params += "&max_salary=" + this.state.max_salary;
        query_params += "&offset=" + this.state.offset;
        query_params += "&limit=" + this.state.limit;
        query_params += "&sort=" + this.state.sort_order + this.state.sort_by;
        return query_params;
    }

    async handleSearch(new_param){
        if (new_param) await this.setState(new_param)
        let query = ENDPOINT + this.buildQuery()
        axios.get(query)
            .then(response=>{
                this.setState({ employees: response.data});
            })
            .catch(error=>{
                console.log("Query Error", error);
                alert("Query Error")
            })
    }

    renderEmployee(emp){
        return(
                <EmployeeCard 
                    id={emp._id}
                    login={emp.login}
                    name={emp.name}
                    salary={emp.salary}
                    key={emp._id}
                />
        )
    }

    render(){
        let employeeList = []
        this.state.employees.forEach(employee=>{
            employeeList.push(this.renderEmployee(employee));
        })
        return(
            <div>
                <SalaryFilter onSearch={this.handleSearch}/>
                <h3 className="d-flex justify-content-center">Employees</h3>
                <table className="table">
                    <thead className="thead-light">
                        <Title onSort={this.handleSearch}/>
                    </thead>
                    <tbody>
                        {employeeList}
                    </tbody>
                </table>
            </div>
        )
    }
}