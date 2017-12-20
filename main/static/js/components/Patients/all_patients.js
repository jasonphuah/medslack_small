import React from 'react';
import axios from 'axios';
const Link = require('react-router-dom').Link;

// Import Patient List
import PatientList from './patient_list';

/****************************  ListOfAllPatientsComp  ******************************/

class Patients extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      patients: ''
    }
    this.loadData = this.loadData.bind(this);
  }


  loadData() {

     // LOAD data from server...
    axios.get('/api/patients')
      .then(resp => {
        this.setState({
          patients: resp.data
        });

      })
      .catch(console.error);

  }

  componentDidMount() {
      this.loadData();
  }

  componentWillMount() {
      this.loadData();
  }

  componentDidUpdate(){
      this.loadData();
  }

  componentDidCatch(error) {
   this.setState({error})
  }

  render(){

    const patients = this.state.patients

    if (patients){
      return(
        <div>
          <div className="table-responsive">
            <table id="dataTableExample1" className="table table-bordered table-striped table-hover">
               <thead>
                  <tr className="info">
                     <th>Name</th>
                     <th>NRIC</th>
                  </tr>
               </thead>
               <tbody>
                 {Object.keys(patients).map(patientIndex =>
                   <PatientList
                   key={patientIndex}
                   {...patients[patientIndex]} />
                 )}
               </tbody>
            </table>
          </div>

          <div className="btn btn-add">
            <Link to={'/patients/new'}><i className="fa fa-plus"></i>Add Patient</Link>
          </div>

        </div>
      )
    } else {
        return(
          <div>Loading Data...</div>
        )
    }

  }

}

export default Patients;
