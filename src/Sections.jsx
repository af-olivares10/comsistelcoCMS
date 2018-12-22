import React, { Component } from 'react';
import './App.css';
import Section from './Section';

class Sections extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  }


  showSections = ()=>{
  return   this.props.pageSelected.sections.map((section,i)=>{
      return <Section key ={i} section = {section} pageSelected= {this.props.pageSelected}   sectionEdited ={this.props.sectionEdited} sectionDeleted ={this.props.sectionDeleted}/>
    });
  }
  render() {
    return (
      <div>
        <h2 className = "subtitle">Secciones en la interna</h2>
        {this.showSections()}
      </div>
    );
  }
}

export default Sections;
