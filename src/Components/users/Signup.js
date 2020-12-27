import AuthService from './AuthService';
import React, {Component} from "react";
//import './login.css'
import axios from "axios";
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

export default class Signup extends Component {

  Auth = new AuthService();

  state = {
    name: "",
    email: "",
    username: "",
    password: ""
  }

  _handleChange = (e) => {
        
    this.setState(
        {
            [e.target.name]: e.target.value
        }
    )
    console.log(this.state);
  }
  handleFormSubmit = e => {
      e.preventDefault();
    
      //Add this part right here
      axios.post(`http://localhost:8080/user/register`, {
          name: this.state.name,
          username : this.state.username,
          email: this.state.email,
          password: this.state.password
        })
        .then(data => {
          console.log(data);
          this.props.history.replace("/login");
        });
    };

  componentDidMount() {
    console.log(this.Auth.loggedIn());
    if(this.Auth.loggedIn()){
        this.props.history.push('/register')
    }
  }

  render() {


    return (
        <React.Fragment>
          <div className='container background' style={{height : '800px'}}>
              <div className='row' style={{margin : '50px'}}>
                <div className='col-6'></div>
                <div className='col-6' style={{backgroundColor  : 'hsla(218, 100%, 50%, 0.3)'}}>
                  <div style={{textAlign : 'center'}}>                  
                    <span>
                      Skapa inloggning
                    </span>
                  </div>
                  <Form>
                    <Form.Group>
                      <Form.Text>
                        Ditt Namn : 
                      </Form.Text>
                      <Form.Control type="text" name="name" placeholder="Skriv in för och efternamn" onChange={this._handleChange} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Text>
                        Användarnamn : 
                      </Form.Text>
                      <Form.Control type="text" name="username" placeholder="Välj ett unikt och kort användarnamn" onChange={this._handleChange} />
                    </Form.Group>

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
                      <Form.Control type="password" name="password" placeholder="Skriv ditt lösenord" onChange={this._handleChange} />
                    </Form.Group>

                    <Button variant='primary' type='submit' onClick={this.handleFormSubmit}>
                      Klar!
                    </Button>
                    <div>
                    <Link className="link" to="/login">Already have an account? <span className="link-signup">Login</span></Link>
                    </div>
                  </Form>
                </div>
                <div className='col-6'></div>
              </div>
            </div>
        </React.Fragment>
    );
}

}