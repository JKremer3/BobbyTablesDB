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

class App extends React.Component {
    constructor(props){
        super(props)
        this.state = { modalIsOpen: false, modalStateIGuess: "" };  
    }
    
    showModal = () => this.setState({ modalIsOpen: true });
    hideModal = () => this.setState({ modalIsOpen: false });

    render(){
        return (
            <div className="App">
                <div >
                    <select id="State">
                        <option value="WA">WA</option>
                        <option value="ID">ID</option>
                        <option value="FL">FL</option>
                        <option value="CA">CA</option>
                    </select>
                    <select id="City">
                        <option value="WA">Pullman</option>
                        <option value="ID">Vancouver</option>
                        <option value="FL">Seattle</option>
                        <option value="CA">Spokane</option>
                    </select>
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
                        <tr>
                            <td>2</td>
                            <td>Jacob</td>
                            <td>Thornton</td>
                        </tr>
                        <tr>
                            <td colSpan="2">Larry the Bird</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </Table>
                
                <Button variant="primary" onClick={this.showModal}>
                    Show Modal
                </Button>

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
