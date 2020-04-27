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
      selectedState: "", selectedCity: "", selectedZip: "", selectedBusiness: "", selectedBusinessAttributes: [], selectedBusinessId: "",
      selectedBusinessHours: [], currentUser: "i_EASSNcEqc1JrfdBjBeVw", tipText: "", curBusiness: [],
      selectedBusinessAddress: "", sCount: "", cCount: "", activeCategories: [], tips: [], selectedBusinessCategories: [],
      businessAttributes: ["BusinessAcceptsCreditCards", "RestaurantsReservations", "WheelchairAccessible",
        "OutdoorSeating", "GoodForKids", "RestaurantsGoodForGroups", "RestaurantsDelivery",
        "RestaurantsTakeOut", "WiFi", "BikeParking"],
      businessMeals: ["breakfast", "brunch", "lunch", "dinner", "dessert", "latenight"],
      businessPrices: ["1", "2", "3", "4"], userpage: true,
    };

    this.bName = React.createRef();
    this.cName = React.createRef();
    this.sName = React.createRef();
    this.sCount = React.createRef();
    this.tCount = React.createRef();
    this.tipTextArea = React.createRef();

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
          return {
            id: business.busid, busname: business.busname, address: business.address,
            city: business.city, busstate: business.busstate, stars: business.stars, distance: 0,
            numtips: business.numtips, numcheckins: business.numcheckins
          }
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

  fetchSort = (e) => {
    this.updateTable(e.target.value)
    this.setState({ selectedZip: e.target.value })
    this.fetchCategories(e.target.value)
  }

  fetchCategories = (zip) => {
    fetch("http://localhost:3030/zip/cat/" + zip)
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
        console.log(catFromApi)
      }).catch(error => {
        console.log(error);
      });
  }

  updateTips = (id) => {
    console.log(id);
    // get the tips for a business id
    fetch("http://localhost:3030/tip/" + id)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        let tips = data.map(tip => {
          return {
            tiptext: tip.tiptext, likecount: tip.likecount,
            userid: tip.userid, busid: tip.busid,
            tipdate: tip.tipdate, tiptime: tip.tiptime
          }
        });
        this.setState({ tips: tips });
        console.log("Got tips");
        console.log(tips);
      }).catch(error => {
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
          return {
            id: business.busid, busname: business.busname, address: business.address,
            city: business.city, busstate: business.busstate, stars: business.stars, distance: 0,
            numtips: business.numtips, numcheckins: business.numcheckins
          }
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

    this.updateTableFilter(this.state.selectedZip, freshCats)

  }

  deactivateCategory = (cat) => {
    console.log("Deactivate Category called (" + cat + ")");
    var activeCategories = this.state.activeCategories

    const index = activeCategories.indexOf(cat);
    if (index > -1) {
      activeCategories.splice(index, 1);
    }

    // if there are no active categories just call the regular fetch
    if (activeCategories.length == 0) {
      this.updateTable(this.state.selectedZip);
    }
    else {
      // if there are active categories we call the filter fetch
      this.updateTableFilter(this.state.selectedZip, activeCategories)
    }

    this.setState({ activeCategories: activeCategories })
  }

  viewBusiness = (b) => {
    console.log("Selected Business: " + this.state.selectedBusiness)
    this.fetchBusinessCategories(b.id);
    this.fetchBusinessAttributes(b.id);
    this.fetchBusinessHours(b.id);

    this.setState({curBusiness: b, selectedBusiness: b.busname, selectedBusinessAddress: b.address, selectedBusinessId: b.id });
    this.showModal();
    this.updateTips(b.id);
  }

  fetchBusinessCategories = (id) => {
    fetch("http://localhost:3030/business/categories/" + id)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        let catFromApi = data.map(cat => {
          return { value: cat.buscat }
        });
        this.setState({
          selectedBusinessCategories: catFromApi,
        });
      }).catch(error => {
        console.log(error);
      });
  }

  fetchBusinessAttributes = (id) => {
    fetch("http://localhost:3030/business/attributes/" + id)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        //console.log("data: " + data);
        let atFromApi = data.map(at => {
          return { attrib: at.busatt }
        });
        //console.log("attribs: " + atFromApi)
        this.setState({
          selectedBusinessAttributes: atFromApi,
        });
      }).catch(error => {
        console.log(error);
      });
  }

  fetchBusinessHours = (id) => {
    var d = new Date();
    var n = d.getDay();
    fetch("http://localhost:3030/business/openClose/" + id + "/" + n)
      .then((response) => {
        return response.json();
      })
      .then(data => {
        console.log("data: " + data);
        let hoursFromApi = data.map(openclose => {
          return { date: openclose.dayofweek, open: openclose.hropen, close: openclose.hrclosed }
        });
        console.log("hours: " + hoursFromApi)
        this.setState({
          selectedBusinessHours: hoursFromApi,
        });
      }).catch(error => {
        console.log(error);
      });
  }


sendNewTip = (busID, userid) => {
  // userid, tipTime, tip date, tip text, busID
  // get the tip text and then clear the text box
  var text = this.state.tipText
  this.setState({tipText: "" })
  
  var d = new Date(); 
  // pull the date and time out of this
  var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay()
  var time = d.getHours() + ":" +  d.getMinutes() + ":" + d.getSeconds();
  
  var newTip = {
    busid: this.state.selectedBusinessId,
    userid: userid,
    likecount: 0,
    tiptext: text,
    tipdate: date,
    tiptime: time
  };

  try {
    const response = fetch('http://localhost:3030/tip/insert/', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify(newTip),
    })
  } catch (error) {
    console.log(error)
  }


  this.updateTips(busID)
  this.forceUpdate()

}

checkinToBusiness(busID){

  try {
    const response = fetch('http://localhost:3030/business/checkin/' + busID, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'post'
    })
  } catch (error) {
    console.log(error)
  }

  var newBusiness = this.state.curBusiness
  newBusiness.numcheckins += 1
  this.setState({ curBusiness: newBusiness });
  
}

likeATip(tip){
  // busID, userid, tipdate, tiptime 

  try {
    const response = fetch('http://localhost:3030/tip/' + 
                  tip.busid + '/' + tip.userid + '/' + tip.tipdate + '/' + tip.tiptime , {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'post'
    })
  } catch (error) {
    console.log(error)
  }

  // update the tip locally
  this.updateTips(tip.busid);
}

handleOnChange(event) {
  this.setState({
    tipText: event.target.value
  })
}
  togglepage = () => {
    this.setState({ userpage: !this.state.userpage })
    console.log("togglepane")
  }

  render() {
    // Render Business Page ****************************************
    var sortedCategories = this.state.businessCategories.sort();
    var sortedAttributes = this.state.businessAttributes.sort();
    var sortedMeals = this.state.businessMeals.sort();
    var sortedPrices = this.state.businessPrices.sort();

    return (

      <div className="App" style={{ display: "flex", justifyContent: "center", backgroundColor: "#007bff", minHeight: "100vh", minWidth: "100%" }} >


        <div style={{ display: "flex", flexDirection: "column" }}>
          <Navbar theme="navbar-default" bg="primary" expand="false" >
            <Navbar.Brand href="#home" style={{ fontStyle: "italic" }}>YELPER HELPER</Navbar.Brand>
            <button type="switchmode" onClick={this.togglepage}>Switch Mode</button>
          </Navbar>
          {this.state.userpage ?
            <React.Fragment>
              { /* This is the flex box that wraps the 4 sections of the UI    */}
              < div style={{ display: "flex", flexDirection: "column", minWidth: "100%", backgroundColor: "#EEEEEE" }}>

                { /* Top 2 squares (the state, city and zip selectors and the categories menu ) */}
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
                        <Form.Control as="select" value={this.state.selectedZip} onChange={this.fetchSort}>
                          {this.state.zips.map((zip) => <option key={zip.value} value={zip.value}>{zip.display}</option>)}
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  </div>

                  <div style={{ display: "block", width: "100%", margin: "20px" }}>
                    <Form.Label>Business Filter</Form.Label> <br></br>
                    <div style={{
                      width: "100%", height: "300px", overflow: "auto", background: "#d6d4d3", margin: "10",
                      borderStyle: "solid", borderColor: "#8c8987", borderWidth: "2px", display: "flex", flexDirection: "row"
                    }}>
                      <ListGroup> Categories
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
                      <ListGroup> Attributes
                      {sortedAttributes.map((businessAttributes) =>
                        this.state.activeCategories.indexOf(businessAttributes.value) == -1 ?
                          <ListGroup.Item
                            onClick={() => this.activateCategory(businessAttributes)} >{businessAttributes}
                          </ListGroup.Item>
                          :
                          <ListGroup.Item
                            onClick={() => this.deactivateCategory(businessAttributes)} active>{businessAttributes}
                          </ListGroup.Item>
                      )}
                      </ListGroup>
                      <ListGroup> Meals
                      {sortedMeals.map((meals) =>
                        this.state.activeCategories.indexOf(meals.value) == -1 ?
                          <ListGroup.Item
                            onClick={() => this.activateCategory(meals)} >{meals}
                          </ListGroup.Item>
                          :
                          <ListGroup.Item
                            onClick={() => this.deactivateCategory(meals)} active>{meals}
                          </ListGroup.Item>
                      )}
                      </ListGroup>
                      <ListGroup> Price
                      {sortedPrices.map((prices) =>
                        this.state.activeCategories.indexOf(prices) == -1 ?
                          <ListGroup.Item
                            onClick={() => this.activateCategory(prices)} >{prices}
                          </ListGroup.Item>
                          :
                          <ListGroup.Item
                            onClick={() => this.deactivateCategory(prices)} active>{prices}
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
                      <td style={{ border: "1px solid grey" }}>{business.distance}</td>
                      <td style={{ border: "1px solid grey" }}>{business.stars}</td>
                      <td style={{ border: "1px solid grey" }}>{business.numtips}</td>
                      <td style={{ border: "1px solid grey" }}>{business.numcheckins}</td>
                    </tr>) 
                    :
                      <React.Fragment/>
                    }
                  </tbody>



                  </table>
                {this.state.businesses.length == 0 ?
                  <div style={{ display: "flex", height: "200px", justifyContent: "center", alignItems: "center" }}>
                    NO DATA
                </div>
                  :
                  <React.Fragment />
                }
              </div>


              </div>
              </div>
            </React.Fragment> :
            <div>
            </div>
          }

        </div>

        <ReactModal style={{ overflow: "visible"}}
           isOpen={this.state.modalIsOpen}
           contentLabel="Minimal Modal Example"
           ariaHideApp={false}
        >
          <div style={{ backgroundColor: "#EEEEEE" }} className="modalBody" >
            <Tabs defaultActiveKey="BusinessInfo" id="uncontrolled-tab-example">
              <Tab eventKey="BusinessInfo" title="Business Info" style={{width: "90vw"}}>
                <div>
                  <h2 id="bName">{this.state.selectedBusiness}</h2>
                  <div id="cName">City: {this.state.selectedCity}</div>
                  <div id="sName">State: {this.state.selectedState}</div>
                  <div >Address: {this.state.selectedBusinessAddress}</div>
                  <div style={{ display: "flex", flexDirection: "row"}}>
                    <div >Categories: &nbsp;</div>{this.state.selectedBusinessCategories.map((cat) => <div> {cat.value}, &nbsp;</div>)}
                  </div>
                  <div style={{ display: "flex", flexDirection: "row"}}>
                    <div >Attributes: &nbsp;</div>{this.state.selectedBusinessAttributes.map((at) => <div> {at.attrib}, &nbsp;</div>)}
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                    <div >Hours: &nbsp;</div>{this.state.selectedBusinessHours.map((openclose) => <div> {openclose.date}: {openclose.open}0 AM - {openclose.close}0 PM </div>)}
                  </div>
                  <Button variant="primary" type="submit" onClick={() => this.checkinToBusiness(this.state.curBusiness.busid) }>
                    Checkin
                  </Button>
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
                      <td onClick={() => this.likeATip(tip)} >{tip.likecount}
                      </td>
                      <td>{tip.tipdate}</td>
                      <td>{tip.tiptime}</td>
                    </tr>)}
                  </tbody>
                </Table>

              </Tab>
              <Tab eventKey="NewTip" title="Write a New Tip">
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Write a New Tip</Form.Label>
                  <Form.Control onChange={(event) => this.handleOnChange(event)}
                   value={this.state.tipText} as="textarea" rows="3" maxLength="500" />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={() => this.sendNewTip( this.state.selectedBusinessId, this.state.currentUser )}>
                  Submit
                </Button>

              </Tab>
            </Tabs>

            </div>
          <Button onClick={this.hideModal} style={{ marginRight: "10px"}} variant="secondary">Close Modal</Button>
        </ReactModal>
      </div>
    );
  }
}

export default App;
