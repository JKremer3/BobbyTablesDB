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
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


import ReactModal from 'react-modal';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false, modalStateIGuess: "", busstates: [], cities: [], zips: [], businessCategories: [], businesses: [],
      businessAttributes1: [], businessAttributes2: [], businessAttributes3: [],
      slectedState: "", selectedCity: "", selectedZip: "", selectedBusiness: "", 
      selectedBusinessAddress: "", sCount: "", cCount: "", activeCategories: [], tips: []
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
    var freshCats = activeCategories;
    const index = activeCategories.indexOf(cat);
    if (index == -1) {
      activeCategories.push(cat);
    }
    this.setState({ activeCategories: activeCategories });
    console.log("Fresh Categories: " + freshCats)

    this.updateTableFilter( this.state.selectedZip, freshCats )

  }

  deactivateCategory = (cat) => {
    console.log("Deactivate Category called (" + cat + ")");
    var activeCategories = this.state.activeCategories

    const index = activeCategories.indexOf(cat);
    if (index > -1) {
      activeCategories.splice(index, 1);
    }

    // if there are no active categories just call the regular fetch
    if (activeCategories.length == 0){
      this.updateTable(this.state.selectedZip);
    }
    else {
      // if there are active categories we call the filter fetch
      this.updateTableFilter( this.state.selectedZip, activeCategories )
    }

    this.setState({ activeCategories: activeCategories })
  }

  viewBusiness = (b) => {
    console.log("Selected Business: " + this.state.selectedBusiness )

    this.setState({ selectedBusiness: b.busname, selectedBusinessAddress: b.address});
    this.showModal();
    this.updateTips(b.id);
  }

  fetchBusinessCategories = (id) => {
    fetch("http://localhost:3030/zip/cat/" + e.target.value)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        let catFromApi = data.map(cat => {
          return { cat }
        });
        this.setState({
          businessCategories: catFromApi,
        });
      }).catch(error => {
        console.log(error);
      });
    
  }


  render() {
    var sortedCategories = this.state.businessCategories.sort();
    var sortedAttributes1 = this.state.businessAttributes1.sort();
    var sortedAttributes2 = this.state.businessAttributes2.sort();
    var sortedAttributes3 = this.state.businessAttributes3.sort();

    return (

      <div className="App" style={{ display: "flex", justifyContent: "center", backgroundColor: "#007bff", minHeight: "100vh", minWidth: "100%" }} >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Navbar theme="navbar-default" bg="primary" expand="false" >
            <Navbar.Brand href="#home" style={{ fontStyle: "italic" }}>YELPER HELPER</Navbar.Brand>
          </Navbar>

          { /* This is the flex box that wraps the 4 sections of the UI    */ }
          <div style={{ display: "flex", flexDirection: "column", minWidth: "100%", backgroundColor: "#EEEEEE" }}>

          { /* Top 2 squares (the state, city and zip selectors and the categories menu ) */ }
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ display: "block", width: "50%", margin: "20px" }}>
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

              <div style={{ display: "block", width: "100%", margin: "20px" }}>
                <Form.Label>Business Catagories</Form.Label> <br></br>
                <div style={{
                  width: "100%", height: "300px", overflow: "auto", background: "#d6d4d3", margin: "10",
                  borderStyle: "solid", borderColor: "#8c8987", borderWidth: "2px", display: "flex", flexDirection: "row"
                }}>
                  <ListGroup>
                    {sortedCategories.map((businessCategory) =>
                      this.state.activeCategories.indexOf(businessCategory.value) == -1 ?
                          <ListGroup.Item  
                              onClick={() => this.activateCategory(businessCategory.value)} >{businessCategory.value}
                              </ListGroup.Item>
                        :
                          <ListGroup.Item  
                              onClick={() => this.deactivateCategory(businessCategory.value)} active>{businessCategory.value}
                              </ListGroup.Item>
                    )}
                  </ListGroup>
                  <ListGroup>
                    {sortedCategories.map((businessCategory) =>
                      this.state.activeCategories.indexOf(businessCategory.value) == -1 ?
                          <ListGroup.Item  
                              onClick={() => this.activateCategory(businessCategory.value)} >{businessCategory.value}
                              </ListGroup.Item>
                        :
                          <ListGroup.Item  
                              onClick={() => this.deactivateCategory(businessCategory.value)} active>{businessCategory.value}
                              </ListGroup.Item>
                    )}
                  </ListGroup>
                  <ListGroup>
                    {sortedCategories.map((businessCategory) =>
                      this.state.activeCategories.indexOf(businessCategory.value) == -1 ?
                          <ListGroup.Item  
                              onClick={() => this.activateCategory(businessCategory.value)} >{businessCategory.value}
                              </ListGroup.Item>
                        :
                          <ListGroup.Item  
                              onClick={() => this.deactivateCategory(businessCategory.value)} active>{businessCategory.value}
                              </ListGroup.Item>
                    )}
                  </ListGroup>
                </div>
              </div>

            </div>

          { /* The Business Table and the Tips */ }
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ display: "block", minWidth: "80vw", maxHeight: "500px", margin: "20px", overflow: "auto" }}>
                <table style={{ border: "1px solid grey", width: "100%" }} className="sortable" id="dataTable">
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
                    { this.state.businesses.length != 0 ? 

                    this.state.businesses.map((business) => <tr onClick={() => this.viewBusiness( business )} key={business.id} value={business.id}>
                      <td style={{ border: "1px solid grey" }}>{business.busname}</td>
                      <td style={{ border: "1px solid grey" }}>{business.busstate}</td>
                      <td style={{ border: "1px solid grey" }}>{business.city}</td>
                      <td style={{ border: "1px solid grey" }}>{business.address}</td>
                      <td style={{ border: "1px solid grey" }} >{business.distance}</td>
                      <td style={{ border: "1px solid grey" }} >{business.stars}</td>
                      <td style={{ border: "1px solid grey" }}>{business.numtips}</td>
                      <td style={{ border: "1px solid grey" }}>{business.numcheckins}</td>
                    </tr>) 
                    :
                      <React.Fragment/>
                    }
                  </tbody>
                  </table>
              </div>

            </div>

            {this.state.businesses.length == 0 ?
              <div style={{ display: "flex", height: "200px", justifyContent: "center", alignItems: "center" }}>
                NO DATA
              </div>
              :
              <React.Fragment />
            }

          </div>
        </div>

        <ReactModal 
           isOpen={this.state.modalIsOpen}
           contentLabel="Minimal Modal Example"
           ariaHideApp={false}
        >
            <div className="modalBody" >
            <Tabs defaultActiveKey="BusinessInfo" id="uncontrolled-tab-example">
              <Tab eventKey="BusinessInfo" title="Business Info">
                <div>
                  <h2 id="bName">{this.state.selectedBusiness}</h2>
                  <div id="cName">City: {this.state.selectedCity}</div>
                  <div id="sName">State: {this.state.selectedState}</div>
                  <div id="sName">Address: {this.state.selectedBusinessAddress}</div>
                  <div id="sName">Categories & Attributes: </div>
                  <div id="sName">Hours Today: </div>
                </div>
              </Tab>
              <Tab eventKey="Tips" title="Tips">
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
                      <td>{tip.likecount}
                        <div onClick={() => console.log("Liked a tip")} >
                        </div>
                      </td>
                      <td>{tip.tipdate}</td>
                      <td>{tip.tiptime}</td>
                    </tr>)}
                  </tbody>
                </Table>

              </Tab>
            </Tabs>


            </div>
          <button onClick={this.hideModal}>Close Modal</button>
        </ReactModal>

      </div>
    );
  }
}

export default App;
