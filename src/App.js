import logo from './logo.svg';
import './App.css';

import "bootstrap/dist/css/bootstrap.min.css"
import EmployeeList from './components/employee-list.component'

function App() {
  return (
    <div className="App">
      Hello World!
      <EmployeeList></EmployeeList>
    </div>
  );
}

function Search(query){

}

export default App;
