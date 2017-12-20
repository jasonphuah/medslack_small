import React from "react";
import ReactDOM from "react-dom";
import { browserHistory } from 'react-router';
import { BrowserRouter as Router, Route, IndexRoute } from 'react-router-dom';
import {Switch} from 'react-router-dom';

import Patients from './components/Patients/all_patients'
import Patient from './components/Patients/patient'
import NewPatient from './components/Patients/new'

ReactDOM.render(

  <Router history={browserHistory} >
  	<Switch>
	    <Route exact path="/" component={Patients} />
      <Route exact path="/patients/new" component={NewPatient} />
      <Route exact path="/patients/:patient_id" component={Patient} />

    </Switch>
  </Router>,

  document.getElementById('content')

);
