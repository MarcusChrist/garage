import React, {Component} from 'react';
import axios from 'axios';
import AuthService from '../users/AuthService';
import withAuth from '../users/WithAuth';
import { Navbar, Nav, Button } from 'react-bootstrap'
import {Link} from 'react-router-dom'
// import SearchProducts from '../products/SearchProducts'
// import GetProducts from '../products/GetProducts';
import Products from '../products/NewProducts';
import { WebUrl } from '../../api/config';

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
            <Navbar.Brand href="/">Uppsala Veterinärmottagning</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link><Link to='/'>Hem</Link></Nav.Link>
                <Nav.Link><Link to='/add'>Ny Produkt</Link></Nav.Link>
                {/* <Nav.Link><Link to='/scan'>Inventera</Link></Nav.Link> */}
                </Nav>
                <Button variant="danger" type="submit" onClick={this._handleLogout}>
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
