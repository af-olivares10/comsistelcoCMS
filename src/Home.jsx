import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Selector from './Selector';
import NewSection from './NewSection';
import Sections from './Sections';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      pageSelected : null,
      loading:true
    };
  }
  componentDidMount(){
    fetch("https://intellgentcms.herokuapp.com/api/pages").then( response => response.json()).then((json)=>{
      this.setState({loading:false});
    }
  ).catch(err => console.error(err));

  }
  pageSelected = (page)=>{
    this.setState({pageSelected:JSON.parse(page)})
  }
  newSection = (section)=>{
    alert("Sección añadida a la página")
    this.setState((prevState)=>{
      prevState.pageSelected.sections.push(section);
      return({pageSelected:prevState.pageSelected});
    }
  );
  }

  sectionEdited = (section)=>{
    this.setState((prevState)=>{
      for (var i = 0; i < prevState.pageSelected.sections.length; i++) {
        if(prevState.pageSelected.sections[i]._id === section._id){
          prevState.pageSelected.sections[i].title = section.title;
          prevState.pageSelected.sections[i].content = section.content;
          break;
        }
      }
      return({pageSelected:prevState.pageSelected});
    }
  );
  }
  sectionDeleted = (section)=>{
    this.setState((prevState)=>{
      for (var i = 0; i < prevState.pageSelected.sections.length; i++) {
        if(prevState.pageSelected.sections[i]._id === section._id){
          prevState.pageSelected.sections.splice(i,1) ;
          break;
        }
      }
      return({pageSelected:prevState.pageSelected});
    }
  );
  }
  render() {
    return (
      this.state.loading? (
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      ):
      <div>
        <Header/>
        <div className = "home-wrapper">
          <Selector pageSelected = {this.pageSelected}/>
          {this.state.pageSelected&&
            (
              <div>
                <div className="page-title" >{this.state.pageSelected.name}</div>
                <NewSection pageSelected = {this.state.pageSelected} newSection= {this.newSection}/>
                <Sections pageSelected = {this.state.pageSelected} sectionEdited ={this.sectionEdited} sectionDeleted ={this.sectionDeleted}/>
              </div>
            )
          }
        </div>
      </div>


    );
  }
}

export default App;
