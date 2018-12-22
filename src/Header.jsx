import React, { Component } from 'react';
import logo from './favicropped.png';

class Header extends Component {
  render() {
    return (
      <div >
        <header className ="header ">
          <h1 className = "title">Módulo administrativo</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className = "logout" onClick= {()=>{localStorage.removeItem("ComToken"); window.location.reload();}}>salir</div>
      </div>
    );
  }
}

export default Header;
