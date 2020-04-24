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
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import InputGroup from 'react-bootstrap/InputGroup';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false, modalStateIGuess: "", busstates: [], cities: [], zips: [], businessCategories: [], businesses: [],
      slectedState: "", selectedCity: "", selectedZip: "", selectedBusiness: "", sCount: "", cCount: "", activeCategories: [], tips: []
    };

    this.bName = React.createRef();
    this.cName = React.createRef();
    this.sName = React.createRef();
    this.sCount = React.createRef();
    this.tCount = React.createRef();

  }

  showModal = () => this.setState({ modalIsOpen: true });
  hideModal = () => this.setState({ modalIsOpen: false });


  componentDidMount() {
    fetch("http://localhost:3030/state")
      .then((response) => {
        return response.json();
      })
      .then(data => {
        let statesFromApi = data.map(busstates => {
          return { value: busstates.busstate, display: busstates.busstate }
        });
        this.setState({
          busstates: [{ value: '', display: '(Select A State)' }].concat(statesFromApi),
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

  updateZips = (e) => {
    this.setState({ selectedCity: e.target.value })
    fetch("http://localhost:3030/zip/" + e.target.value)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        let zipsFromApi = data.map(zip => {
          return { value: zip.postalcode, display: zip.postalcode }
        });
        this.setState({
          zips: [{ value: '', display: '(Select A Zip)' }].concat(zipsFromApi),
          businesses: []
        });
      }).catch(error => {
        console.log(error);
      });
  }

  updateTable = (value) => {
    console.log(value)
    fetch("http://localhost:3030/businesses/" + value)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        let businessFromApi = data.map(business => {
          return { id: business.busid , busname: business.busname, address: business.address, 
          city: business.city, busstate: business.busstate, stars: business.stars, distance: 0, 
        numtips: business.numtips, numcheckins: business.numcheckins }
        });
        console.log(data)
        console.log(businessFromApi)
        this.setState({
          businesses: businessFromApi
        });
      }).catch(error => {
        console.log(error);
      });
  }

  fetchCategories = (e) => {
    this.updateTable(e.target.value)
    this.setState({ selectedZip: e.target.value })
    fetch("http://localhost:3030/zip/cat/" + e.target.value)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        let catFromApi = data.map(cat => {
          return { value: cat.category, display: cat.categoy }
        });
        this.setState({
          businessCategories: catFromApi,
        });
      }).catch(error => {
        console.log(error);
      });
  }

  updateTips = (id) => {
      console.log(id);
    // get the tips for a business id
    fetch("http://localhost:3030/tip/" + id )
    .then((response) => {
      return response.json();
    } )
    .then(data => {
      let tips = data.map(tip => {
        return { tiptext: tip.tiptext, likecount: tip.likecount,
           userid: tip.userid, busid: tip.busid, 
           tipdate: tip.tipdate, tiptime: tip.tiptime }
      });
      this.setState({ tips: tips });
      console.log("Got tips");
      console.log(tips);
    }).catch( error => {
      console.log(error)
    }
    );
  }

  updateModal = (busname) => {
    this.setState({ selectedBusiness: busname });
    this.showModal();
  }


  updateTableFilter = (zip, cat) => {
    console.log("Filter fetch called")
    fetch("http://localhost:3030/business/" + zip + "/" + cat)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        let businessFromApi = data.map(business => {
          return { id: business.busid , busname: business.busname, address: business.address, 
          city: business.city, busstate: business.busstate, stars: business.stars, distance: 0, 
        numtips: business.numtips, numcheckins: business.numcheckins }
        });
        console.log(data)
        console.log(businessFromApi)
        this.setState({
          businesses: businessFromApi
        });
      }).catch(error => {
        console.log(error);
      });
  }

  activateCategory = async (cat) => {
    console.log("Activate Category called (" + cat + ")");
    console.log("ActiveCatagories: " + this.state.activeCategories)
    var activeCategories = this.state.activeCategories;
    const index = activeCategories.indexOf(cat);
    if (index == -1) {
      activeCategories.push(cat);
    }
    this.setState({ activeCategories: activeCategories });
    this.updateTableFilter( this.state.selectedZip , this.state.activeCategories[0] )

  }

  deactivateCategory = (cat) => {
    console.log("Deactivate Category called (" + cat + ")");
    var activeCategories = this.state.activeCategories

    const index = activeCategories.indexOf(cat);
    if (index > -1) {
      activeCategories.splice(index, 1);
    }

    this.setState({ activeCategories: activeCategories });
  }

  showTips = (id) => {

    this.updateTips(id)
  }

  render() {
    return (

      <div className="App" style={{ display: "flex", justifyContent: "center", backgroundColor: "#007bff", minHeight: "100vh" }} >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Navbar theme="navbar-default" bg="primary" expand="false" >
            <Navbar.Brand href="#home" style={{ fontStyle: "italic" }}>YELPER HELPER</Navbar.Brand>
          </Navbar>

          <div style={{ display: "flex", flexDirection: "column", width: "80%", backgroundColor: "#EEEEEE" }}>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ display: "block", width: "500px", margin: "20px" }}>
                <Form>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>State</Form.Label>
                    <Form.Control as="select" value={this.state.selectedState} onChange={this.updateCities}>
                      {this.state.busstates.map((busstate) => <option key={busstate.value} value={busstate.value}>
                        {busstate.display}
                      </option>)}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect2">
                    <Form.Label>City</Form.Label>
                    <Form.Control as="select" value={this.state.selectedCity} onChange={this.updateZips}>
                      {this.state.cities.map((city) => <option key={city.value} value={city.value}>{city.display}</option>)}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect3">
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control as="select" value={this.state.selectedZip} onChange={this.fetchCategories}>
                      {this.state.zips.map((zip) => <option key={zip.value} value={zip.value}>{zip.display}</option>)}
                    </Form.Control>
                  </Form.Group>
                </Form>
              </div>


              <div style={{ display: "block", width: "500px", margin: "20px" }}>
                <Form.Label>Business Catagories</Form.Label> <br></br>
                <div style={{
                  width: "500px", height: "300px", overflow: "auto", background: "#d6d4d3", margin: "10",
                  borderStyle: "solid", borderColor: "#8c8987", borderWidth: "2px"
                }}>
                  {this.state.businessCategories.map((businessCategory) =>
                    this.state.activeCategories.indexOf(businessCategory.value) == -1 ?
                      <React.Fragment>
                        <Button style={{ margin: "5px", ':hover': { outline: 'none' } }} variant="primary" onClick={() => this.activateCategory(businessCategory.value)} >{businessCategory.value}</Button>{' '}
                      </React.Fragment>
                      :
                      <React.Fragment>
                        <Button style={{ margin: "5px", ':hover': { outline: 'none' } }} variant="primary" onClick={() => this.deactivateCategory(businessCategory.value)} active>{businessCategory.value}</Button>{' '}
                      </React.Fragment>
                  )}
                </div>

              </div>

            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ display: "block", minWidth: "400px", maxHeight: "300px", margin: "20px", overflow: "auto" }}>
                <table style={{ border: "1px solid grey" }} className="sortable" id="dataTable">
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid grey" }} >Business Name</th>
                      <th style={{ border: "1px solid grey" }} >State</th>
                      <th style={{ border: "1px solid grey" }}>City</th>
                      <th style={{ border: "1px solid grey" }} >Address</th>
                      <th style={{ border: "1px solid grey" }}>Distance</th>
                      <th style={{ border: "1px solid grey" }}>Stars</th>
                      <th style={{ border: "1px solid grey" }}>Tip Count</th>
                      <th style={{ border: "1px solid grey" }}>Checkins</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.businesses.map((business) => <tr onClick={() => this.showTips(business.id)} key={business.id} value={business.id}>
                      <td style={{ border: "1px solid grey" }}>{business.busname}</td>
                      <td style={{ border: "1px solid grey" }}>{business.busstate}</td>
                      <td style={{ border: "1px solid grey" }}>{business.city}</td>
                      <td style={{ border: "1px solid grey" }}>{business.address}</td>
                      <td style={{ border: "1px solid grey" }} >{business.distance}</td>
                      <td style={{ border: "1px solid grey" }} >{business.stars}</td>
                      <td style={{ border: "1px solid grey" }}>{business.numtips}</td>
                      <td style={{ border: "1px solid grey" }}>{business.numcheckins}</td>
                    </tr>)}
                  </tbody>
                  </table>
              </div>

              <div style={{ display: "block", width: "500px", margin: "20px" }}>
                <div> Tips</div>
                <div style={{
                  width: "400px", height: "300px", overflow: "auto",
                  background: "#d6d4d3", margin: "10", borderStyle: "solid", borderColor: "#8c8987", borderWidth: "2px"
                }}>
                  <Table striped bordered hover id="tipTable">
                    <thead>
                      <tr>
                        <th>Tip</th>
                        <th>User</th>
                        <th>Likes</th>
                        <th>Date</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.tips.map((tip) => <tr key={tip.tiptext} value={tip.tiptext}>
                        <td>{tip.tiptext}</td>
                        <td>{tip.userid}</td>
                        <td>{tip.likecount}</td>
                        <td>{tip.tipdate}</td>
                        <td>{tip.tiptime}</td>
                      </tr>)}
                    </tbody>
                  </Table>




                  { this.state.tips.map((tip) => <tr key={tip.value} value={tip.value}>
                    <td>{tip.value}</td>
                  </tr>)}
                </div>
              </div>
            </div>

          </div>



        </div>



        <Modal show={this.state.modalIsOpen} onHide={this.hideModal}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.selectedBusiness}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modalBody">
              <div id="bName">Name: {this.state.selectedBusiness}</div>
              <div id="cName">City: {this.state.selectedCity}</div>
              <div id="sName">State: {this.state.selectedState}</div>
              <div id="tCount">Tips: {this.state.tCount}</div>

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
    );
  }
}

export default App;
