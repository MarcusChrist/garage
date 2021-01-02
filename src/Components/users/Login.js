import React, { Component } from "react";
import AuthService from './AuthService';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import GridItem from '../../functions/GridItem';
import GridContainer from '../../functions/GridContainer';


class Login extends Component {
  Auth = new AuthService();

  state = {
    email: "",
    password: ""
  }

  _handleChange = (e) => {
    this.setState(
      {
        [e.target.name]: e.target.value
      }
    )
  }

  handleFormSubmit = e => {
    e.preventDefault();

    /* Here is where all the login logic will go. Upon clicking the login button, we would like to utilize a login method that will send our entered credentials over to the server for verification. Once verified, it should store your token and send you to the protected route. */
    this.Auth.login(this.state.email, this.state.password)
      .then(res => {
        console.log(res);
        this.props.history.replace("/");
      })
      .catch(err => {
        console.log(err);
        alert(err.message);
      });


  };

  componentDidMount() {
    /* Here is a great place to redirect someone who is already logged in to the protected route */
    if (this.Auth.loggedIn())
      this.props.history.replace('/');
  }

  render() {
    return (
      <React.Fragment>
      <div className='container background' style={{ height: '800px' }}>
        <div className='col-6'></div>
        <div style={{ backgroundColor: 'hsla(218, 100%, 50%, 0.3)' }}>
          <div style={{ textAlign: 'center' }}>
            <span>
              Uppsala Veterinärmottagning
                    </span><br />
            <span>
              Logga in
                    </span>
          </div>
          <div style={{ margin: "20px" }}>
            <Form>
              <Form.Group>
                <Form.Text>
                  Email :
                      </Form.Text>
                <Form.Control type="email" name="email" placeholder="Skriv din email" onChange={this._handleChange} />

              </Form.Group>
              <Form.Group>
                <Form.Text>
                  Lösenord :
                      </Form.Text>
                <Form.Control type="password" name="password" placeholder="Skriv ditt Lösenord" onChange={this._handleChange} />
              </Form.Group>
              <Button variant='primary' type='submit' onClick={this.handleFormSubmit}>
                Logga in
                    </Button>
              <div>
                <Link className="center" to="/register">Har du inte ett account? <span>Skaffa ett!</span></Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
        </React.Fragment>
    );
  }


}


export default Login;
