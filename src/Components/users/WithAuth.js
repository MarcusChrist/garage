import React, { Component } from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService();

    return class AuthWrapped extends Component {
        state = {
            confirm: null,
            loaded: false
          };

          componentDidMount() {
            console.log("1")
            if (!Auth.loggedIn()) {
              console.log("2")
                this.props.history.replace('/login')
            }
            else {
                try {
                  console.log("3")
                    const confirm = Auth.getConfirm()
                    this.setState({
                        confirm: confirm,
                        loaded: true
                    })
                }
                catch(err){
                  console.log("4")
                  console.log(err);
                    Auth.logout()
                    this.props.history.replace('/login')
                }
            }
        }

        render() {
          console.log("0")
            if (this.state.loaded === true) {
              if (this.state.confirm) {
                console.log("confirmed!");
                return (
                  /* component that is currently being wrapper(App.js) */
                  <AuthComponent
                    history={this.props.history}
                    confirm={this.state.confirm}
                  />
                );
              } else {
                return console.log("not confirmed!");
              }
            } else {
              console.log("not loaded")
              return null;
            }
          }

    }

}