import React, {Component} from 'react';
import axios from 'axios'

const ENDPOINT = "http://localhost:5000/users"

function EmployeeCard(props){
    return(
        <div>
            {props.id}
            {props.name}
            {props.login}
            {props.salary}
        </div>
    )
}

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
            <form onSubmit={this.handleSubmit}>
                <h4>Salary Filter</h4>
            <label>
                Minimum:
                <input type="text" onChange={this.handleChangeMinSalary}/>
            </label>
            <label>
                Max:
                <input type="text" onChange={this.handleChangeMaxSalary}/>
            </label>
            <input type="submit" value="Filter"/>
            </form>
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
                <button onClick={this.handleClick} name={title}>{title}</button>
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
            <div>
                {titleList}
            </div>
        )
    }

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
                console.log("New Query", response)
            })
            .catch(error=>{
                console.log("Query Error", error);
                alert("Query Error")
            })
    }

    renderEmployee(emp){
        return(
            <div>
                <EmployeeCard 
                    id={emp._id}
                    login={emp.login}
                    name={emp.name}
                    salary={emp.salary}
                />
            </div>
        )
    }

    render(){
        let employeeList = []
        this.state.employees.forEach(employee=>{
            employeeList.push(this.renderEmployee(employee));
        })
        return(
            <div>
                <button onClick={this.handleSubmit}></button>
                <SalaryFilter onSearch={this.handleSearch}/>
                <Title onSort={this.handleSearch}/>
                {employeeList}
            </div>
        )
    }
}