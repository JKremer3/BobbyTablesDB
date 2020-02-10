import React from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import './App.css';

function App() {
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
                      <th>#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Username</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>1</td>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                  </tr>
                  <tr>
                      <td>2</td>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                  </tr>
                  <tr>
                      <td>3</td>
                      <td colSpan="2">Larry the Bird</td>
                      <td>@twitter</td>
                  </tr>
              </tbody>
          </Table>
          <div></div>
      </div>
  );
}

export default App;
