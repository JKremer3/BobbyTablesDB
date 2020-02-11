// react includes 
import React from 'react';
import ReactDOM from 'react-dom';

// these were from the Create React App script
import logo from './logo.svg';
import './App.css';

// bootstrap includes 
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = { modalIsOpen: false, modalStateIGuess: "", states:[], cities:[], selectedState: "" }; 
        this.updateCities = this.updateCities.bind(this);
    }
    
    showModal = () => this.setState({ modalIsOpen: true });
    hideModal = () => this.setState({ modalIsOpen: false });


    componentDidMount() {
        fetch("http://localhost:3030/state")
          .then((response) => {
            return response.json();
          })
          .then(data => {
            console.log(data)
            let statesFromApi = data.map(state => {
              return {value: state.state, display: state.state}
            });
            console.log(statesFromApi)
            this.setState({
              states: [{value: '', display: '(Select A State)'}].concat(statesFromApi)
            });
          }).catch(error => {
            console.log(error);
          });
      }

      updateCities(e){
        this.setState({selectedState: e.target.value})
        fetch("http://localhost:3030/city/" + e.target.value)
        .then((response) => {
          return response.json();
        })
        .then(data => {
          console.log(data)
          let citiesFromApi = data.map(city => {
            return {value: city.city, display: city.city}
          });
          console.log(citiesFromApi)
          this.setState({
            cities: [{value: '', display: '(Select A City)'}].concat(citiesFromApi)
          });
        }).catch(error => {
          console.log(error);
        });
      }

    render(){
        return (
            <div className="App">
                <div >
                    <Form>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>State</Form.Label>
                            <Form.Control as="select" value={this.state.selectedState} onChange={this.updateCities}>
                            {this.state.states.map((state) => <option key={state.value} value={state.value}>{state.display}</option>)}
                            </Form.Control>
                        </Form.Group> 
                        {console.log("selectedState " + this.state.selectedState)}

                        <Form.Group controlId="exampleForm.ControlSelect2">
                            <Form.Label>City</Form.Label>
                            <Form.Control as="select">
                            {this.state.cities.map((city) => <option key={city.value} value={city.value}>{city.display}</option>)}
                            </Form.Control>
                        </Form.Group> 
                    </Form>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Business Name</th>
                            <th>State</th>
                            <th>City</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr onClick={this.showModal}>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                        </tr>
                    </tbody>
                </Table>
                
                <Modal show={this.state.modalIsOpen} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Wassup Gamers</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.hideModal}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal> 
            </div>
        );
    }
}

export default App;
