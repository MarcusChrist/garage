import React, {Component} from 'react';
import axios from 'axios';
import AuthService from '../users/AuthService';
import withAuth from '../users/WithAuth';
import { Navbar, Nav, Button } from 'react-bootstrap'
import {Link} from 'react-router-dom'
// import SearchProducts from '../products/SearchProducts'
// import GetProducts from '../products/GetProducts';
import Products from '../products/NewProducts';
import {WebUrl} from '../../api/config';
import GridContainer from '../../functions/GridContainer';

axios.defaults.baseURL = WebUrl;
class App extends Component {

  Auth = new AuthService();

  _handleLogout = () => {
  this.Auth.logout()
  this.props.history.replace('/login');
  }

     render() {


      return (
        <div>
          <Navbar bg="grey" expand="lg">
            <Navbar.Brand href="/">{localStorage.getItem('company')}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Link style={{marginLeft: "10px", marginRight: "10px", marginBottom: "10px", marginTop: "10px"}} to='/add'>Lägg in produkter</Link>
                <Link style={{marginLeft: "10px", marginRight: "10px", marginBottom: "10px", marginTop: "10px"}} to='/admin'>Administration</Link>
                </Nav>
                <Button style={{marginLeft: "10px", marginTop: "10px"}} variant="danger" type="submit" onClick={this._handleLogout}>
                  Logout
                </Button>
            </Navbar.Collapse>
          </Navbar>
          <br/>
          <div>
             <Products fixHist={this.props.history}/>
          </div>
        </div>

      );
    }
  }
   export default withAuth(App);
