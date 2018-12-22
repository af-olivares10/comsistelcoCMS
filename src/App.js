import React, { Component } from 'react';
import './App.css';
import Login from './Login';
import Home from './Home';
import 'antd/dist/antd.css';
import './Login.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged : false
    };
  }
  setLogged = (logged)=>{
    this.setState({logged});
  }
  componentDidMount(){
    if(localStorage.getItem("ComToken")){
      this.setState({logged:true});
    }
    else
    this.setState({logged:false});
  }
  render() {
    return (
      this.state.logged?(<Home setLogged = {this.setLogged}/>):(<Login setLogged = {this.setLogged}/>)
    );
  }

}
export default App;
