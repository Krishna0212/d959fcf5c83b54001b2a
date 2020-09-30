import React from 'react';
import { TextField, Button } from '@material-ui/core'
import axois from 'axios';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import logo from './logo.svg';
import './App.css';

export const apiKey = '38cZ1xuO8eJj09tfBpEQELxMaiwLe7c2zKg3WgRc'


const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isSubmitDisabled: true,
      asteroidValue: '',
      asteroidData: {},
      isErrorBoxOpen:  false,
    }
  }

  handelTextChange = (event) => {
    const txtValue = event.target.value.trim()
    if(txtValue.length > 0) {
      this.setState({isSubmitDisabled: false})
    }else {
      this.setState({isSubmitDisabled: true})
    }
    this.setState({asteroidValue: event.target.value})
  }

  onSubmitClick = () => {
  const {asteroidValue} = this.state;
    this.getAsteroidsByID(asteroidValue);
  }

  getAsteroidsByID = (asteroidValue) => {
    const url =  `https://api.nasa.gov/neo/rest/v1/neo/${asteroidValue}?api_key=${apiKey}`
    axois.get(url).then(res =>  {
     this.setState({asteroidData: res.data})
    }).catch((resp)  => {
      this.setState({isErrorBoxOpen: true})
    })
  }

  getRandomAsteroid = () => {
    const url =  `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`
    axois.get(url).then(res =>  {
      const randomData = res.data.near_earth_objects[Math.floor(Math.random() * res.data.near_earth_objects.length- 1 )]
      this.getAsteroidsByID(randomData.id)
    }).catch((resp)  => {
      this.setState({isErrorBoxOpen: true})
    })
  }

  render(){
    const { isSubmitDisabled, asteroidData, isErrorBoxOpen} = this.state;
    return (
      <div className="App">

      <Snackbar open={isErrorBoxOpen}
      anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
      autoHideDuration={6000}>
              <Alert severity="error">
                Can't find asteroid data
              </Alert>
      </Snackbar>
        <form>
          <div className="form-control">
            <TextField
                id="asteroid_id"
                type="text"
                placeholder="Enter Asteroid ID"
                onChange={this.handelTextChange}
              />
          </div>
          <div>
          <Button variant="contained" 
          disabled={isSubmitDisabled}
          onClick={this.onSubmitClick}
          color="primary"> Submit</Button>
          <Button 
          variant="contained" 
          color="secondary"
          onClick={this.getRandomAsteroid}
          > Random Asteroid</Button>
          </div>
          <div>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>nasa_jpl_url</TableCell>
                  <TableCell>is_potentially_hazardous_asteroid</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {asteroidData && asteroidData.name &&  (
                  <TableRow>
                    <TableCell component="th" scope="row">
                      {asteroidData.name}
                    </TableCell>
                    <TableCell>{asteroidData.nasa_jpl_url}</TableCell>
                    <TableCell> {asteroidData.is_potentially_hazardous_asteroid ? 'true' : 'false'} </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </form>
      </div>
    )
  };
}

export default App;
