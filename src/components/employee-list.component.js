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

class SearchBar extends React.Component {

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
        console.log(event.target.value)
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



export default class EmployeeList extends Component{

    componentDidMount(){
        this.handleSearch();
    }

    // shouldComponentUpdate(){
    //     return false
    // }

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
        this.handleSubmit = this.handleSubmit.bind(this);
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
        console.log("query", this.state.query)
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

    handleSubmit(event){
        console.log(this.state.employees);
    }

    render(){
        let employeeList = []
        for (let emp in this.state.employees){
            employeeList.push(this.renderEmployee(this.state.employees[emp]));
        }
        return(
            <div>
                <button onClick={this.handleSubmit}></button>
                <SearchBar onSearch={this.handleSearch}/>
                {employeeList}
            </div>
        )
    }
}