import React, {Component} from 'react';
import axios from 'axios';
const Link = require('react-router-dom').Link;

/****************************  PatientListComp  ******************************/

class PatientList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      patient_id: this.props.id
    }
  }

  render(){
    return (
      <tr className="patient-row">
        <td><Link to={`/patients/${this.props.id}`}>{this.props.patient_name}</Link></td>
        <td>{this.props.NRIC}</td>
      </tr>
    )
  }

}

export default PatientList;
