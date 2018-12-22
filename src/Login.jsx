import React, { Component } from 'react';

import './Login.css';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      loginError:"",
      loading:false
    };
  }

  login = (e)=>{
    this.setState({loading:true,loginError:""});
    e.preventDefault();
    let data = {username:this.refs.username.value, password:this.refs.password.value};
    //fetch('/api/authenticate', {
    fetch('https://intellgentcms.herokuapp.com/api/authenticateComsistelco', {

      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then((response) => response.json())
    .then((responseJson) => {
       this.setState({loading:false});
       if(!responseJson.success)
       this.setState({loginError:responseJson.message});
       else
       {
         localStorage.setItem("ComToken",responseJson.token);
         this.props.setLogged(true);
       }

    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <div className = "login">
        <div  className="container ">
          <div  className="profile profile--open">
            <div  className="profile__avatar" id="toggleProfile">
              <img src="./favi.png" alt="Comsistelco" />
            </div>
            <form  className="profile__form" onSubmit = {this.login}>
              <div  className="profile__fields">
                <div  className="field">
                  <input type="text" id="fieldUser"  className="input" ref = "username" required pattern=".*\S.*" />
                  <label htmlFor="fieldUser"  className="label label1">Username</label>
                </div>
                <div  className="field">
                  <input type="password" id="fieldPassword" className="input"    ref = "password"  required pattern=".*\S.*" />
                  <label htmlFor="fieldPassword"  className="label label2">Password</label>
                </div>
                {(!this.state.loading)&&(
                  <div  className="profile__footer">
                    <button  className="btn"   type="submit">Login</button>
                  </div>
                )
              }
              {(this.state.loading)&&(
                <div className="spinner">
                  <div className="double-bounce1"></div>
                  <div className="double-bounce2"></div>
                </div>
              )
            }
            <label className ="login-error" >{this.state.loginError}</label>
          </div>
        </form>
      </div>
    </div>

      </div>

);
}
}

export default Login;
