import React, {Component} from 'react';

import axios from 'axios';

const Link = require('react-router-dom').Link;


/****************************  NewPatientComp  ******************************/

class NewPatient extends React.Component {

    constructor(props) {
    super(props);
    // Declaring initial state
      this.state = {

      };
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    handleSubmit(e){

      e.preventDefault()
      axios({
        method: 'post',
        url: '/api/patients/new',
        data: {
          name: this.refs.name.value,
          age: this.refs.age.value,
          nric: this.refs.nric.value,
        }
      })
      .then(function(response) {
        console.log(response)
      });
      window.alert("New patient created");
      this.props.history.push('/');

    }

    render(){
      return (

        <div className="container">
          <div className="btn btn-add">
              <Link to={'/'}><span className="pe-7s-angle-left-circle return"></span>Definition List</Link>
          </div>

          <form onSubmit={(e) => this.handleSubmit(e)}>
            <table>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td><input type="text" ref='name' /></td>
                </tr>
                <tr>
                  <td>Age</td>
                  <td><input type="number" ref='age' /></td>
                </tr>
                <tr>
                  <td>NRIC</td>
                  <td><input type="text" ref='nric' /></td>
                </tr>
                <tr>
                  <td><input type="submit" value="Save" /></td>
                </tr>
              </tbody>
            </table>

          </form>

        </div>

    );
  }

};

export default NewPatient;
