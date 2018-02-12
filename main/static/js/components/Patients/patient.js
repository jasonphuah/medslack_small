import React, {Component} from 'react';
import axios from 'axios';

// Import Live Charts
import HeartRateGraph from '../Graphs/heart_rate';
import BloodSaturationGraph from '../Graphs/blood_str';
import EcgGraph from '../Graphs/ecg';

/****************************  PatientComp  ******************************/

class Patient extends Component {

  constructor(props) {
    super(props);
    this.state = {
     loadData: true,
     loadDataByInterval: true
    }
    this.loadDataByInterval = this.loadDataByInterval.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  loadData(){

   const patient_id = this.props.match.params.patient_id;

   axios
      .get(`/api/patients/${patient_id}`)
      .then(resp => {
        var latestStats = resp.data.statistics;
        var stats = latestStats[latestStats.length - 1].stats;
        var sPStats = [];
        var hRStats = [];
        var tempStats = [];
        var ecgStats = [];
        var dates = [];
        this.setState({
          currentPatientSpO2: stats[stats.length - 1].spo2,
          currentPatientHeartRate: stats[stats.length - 1].hr,
          currentPatientTemperature: stats[stats.length - 1].temperature,
          currentPatientEcg: stats[stats.length - 1].ecg
        });

        for (var i = 0; i < stats.length; i++) {
          ecgStats.push({
            ecg: parseFloat(stats[i].ecg),
            updated_at: stats[i].updated_at
          });
        }

        for (var i = 0; i < stats.length; i++) {
          sPStats.push({
            spo2: parseFloat(stats[i].spo2),
            updated_at: stats[i].updated_at
          });
        }

        for (var m = 0; m < stats.length; m++) {
          hRStats.push({
            heart_rate: parseFloat(stats[m].hr.substr(2,5).substr(0,3)),
            updated_at: stats[m].updated_at
          });
        }


        for (var z = 0; z < stats.length; z++) {
          tempStats.push({
            temperature: parseFloat(stats[z].temperature),
            updated_at: stats[z].updated_at
          });
        }

        //Get the all the dates on which statistics were taken

        for (var n = 0; n < latestStats.length; n++) {
          dates.push(latestStats[n].updated_at);
        }

        this.setState({
          sPData: sPStats,
          hRData: hRStats,
          tempData: tempStats,
          ecgData: ecgStats,
          dates: dates,
          currentStatDate: ""
        });
      })
      .catch(function(error) {
        console.log(error);
      });

  }

  // Setting interval to load the data
  loadDataByInterval() {
    this.setState({
      loadData: true
    });

    this.interval = setInterval(this.loadData, 1000);
  }

  clearDataInterval() {
    this.setState({
      loadData: false
  });

    clearInterval(this.interval);
  }

  componentWillMount() {
     this.loadData();
  }

  componentDidMount() {
     this.loadDataByInterval();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidCatch(error) {
   this.setState({error})
  }

  render(){

    return(
      <div>
        <HeartRateGraph
          chartData={this.state.hRData}
        />
        <BloodSaturationGraph
          chartData={this.state.sPData}
        />
        <EcgGraph
          chartData={this.state.ecgData}
        />
      </div>

    )

  }

}

export default Patient;
