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
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false, modalStateIGuess: "", states: [], cities: [], zips: [], businessCategories: [], businesses: [],
      slectedState: "", selectedCity: "", selectedBusiness: "", sCount: "", cCount: ""
    };

    this.bName = React.createRef();
    this.cName = React.createRef();
    this.sName = React.createRef();
    this.sCount = React.createRef();
    this.cCount = React.createRef();

  }

  showModal = () => this.setState({ modalIsOpen: true });
  hideModal = () => this.setState({ modalIsOpen: false });


  componentDidMount() {
    fetch("http://localhost:3030/state")
      .then((response) => {
        return response.json();
      })
      .then(data => {
        let statesFromApi = data.map(state => {
          return { value: state.state, display: state.state }
        });
        this.setState({
          states: [{ value: '', display: '(Select A State)' }].concat(statesFromApi),
          businesses: []
        });
      }).catch(error => {
        console.log(error);
      });
  }

  updateCities = (e) => {
    this.setState({ selectedState: e.target.value })
    fetch("http://localhost:3030/city/" + e.target.value)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        let citiesFromApi = data.map(city => {
          return { value: city.city, display: city.city }
        });
        this.setState({
          cities: [{ value: '', display: '(Select A City)' }].concat(citiesFromApi),
          businesses: []
        });
      }).catch(error => {
        console.log(error);
      });
  }

  updateTable = (e) => {
    this.setState({ selectedCity: e.target.value })
    fetch("http://localhost:3030/businesses/" + e.target.value)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        let businessFromApi = data.map(business => {
          return { value: business.name }
        });
        this.setState({
          businesses: businessFromApi
        });
      }).catch(error => {
        console.log(error);
      });
  }

  fetchStateCount = () => {
    fetch("http://localhost:3030/count/state/" + this.state.selectedState)
    .then((response) => {
      return response.json();
    })
    .then(data => {
      this.setState ({
        sCount: data[0].count
      });
    }).catch(error => {
      console.log(error)
    })
  }

  fetchCityCount = () => {
    fetch("http://localhost:3030/count/city/" + this.state.selectedCity)
    .then((response) => {
      return response.json();
    })
    .then(data => {
      this.setState ({
        cCount: data[0].count
      })
    }).catch(error => {
      console.log(error)
    })
  }

  updateModal = (name) => {
    this.setState({ selectedBusiness: name });
    this.fetchStateCount();
    this.fetchCityCount();
    this.showModal();
  }

  render() {
    return (
      <div className="App" style={{display: "flex", justifyContent: "center" }} >
        <div style={{width: "500px"}} >
          
        <div>
          <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>State</Form.Label>
              <Form.Control as="select" value={this.state.selectedState} onChange={this.updateCities}>
                {this.state.states.map((state) => <option key={state.value} value={state.value}>{state.display}</option>)}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect2">
              <Form.Label>City</Form.Label>
              <Form.Control as="select" value={this.state.selectedCity} onChange={this.updateTable}>
                {this.state.cities.map((city) => <option key={city.value} value={city.value}>{city.display}</option>)}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect3">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control as="select" value={this.state.selectedZipCode} onChange={this.updateTable}>
                {this.state.zips.map((zip) => <option key={zip.value} value={zip.value}>{zip.display}</option>)}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect4">
              <Form.Label>Bussiness Categories</Form.Label>
              <Form.Control as="select" value={this.state.selectedBusinessCategories} onChange={this.updateTable}>
                {this.state.businessCategories.map((businessCategory) => <option key={businessCategory.value} value={businessCategory.value}>{businessCategory.display}</option>)}
              </Form.Control>
            </Form.Group>
          </Form>
        </div>
        <Table striped bordered hover id="dataTable">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>State</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {this.state.businesses.map((business) => <tr key={business.value} value={business.value}>
              <td onClick={() => this.updateModal(business.value)}>{business.value}</td>
              <td>{this.state.selectedState}</td>
              <td>{this.state.selectedCity}</td>
            </tr>)}
          </tbody>
        </Table>

        <Modal show={this.state.modalIsOpen} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.selectedBusiness}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modalBody">
              <div id="bName">Name: {this.state.selectedBusiness}</div>
              <div id="cName">City: {this.state.selectedCity}</div>
              <div id="sName">State: {this.state.selectedState}</div>
              <div id="cCount">Businesses in City: {this.state.cCount}</div>
              <div id="sCount">Businesses in State: {this.state.sCount}</div>
            </div>
          </Modal.Body>
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
      </div>
    );
  }
}

export default App;
