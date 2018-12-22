import React, { Component } from 'react';
import { Select, Icon, Modal } from 'antd';
const Option = Select.Option;

class Selector extends Component {
  constructor(props){
    super(props);
    this.state ={
      pages : [],
      newPage:false,
      loading: false,
      error:"",
      deleteModalVisible:false,
      editModalVisible:false,
      name:null
    };
  }
  componentDidMount(){
    fetch("https://intellgentcms.herokuapp.com/api/pages").then( response => response.json()).then((json)=>{
      this.setState({pages:json.pages});
    }
  ).catch(err => console.error(err));

}
handleSelection = (value)=> {
  this.setState({name:JSON.parse(value).name});
  this.props.pageSelected(value);

}
renderOptions= ()=>{
  return this.state.pages.map((page,i)=>{
    return (<Option value={JSON.stringify(page)} key = {i}>{page.name}</Option>)

  }
)
}
toggleNewPage=()=>{
  this.setState((prevState)=>{
    return {newPage:!prevState.newPage};
  })
}
submitNewPage = (e)=>{

  e.preventDefault();
  if(this.refs.newPageName.value.trim()!==""){
    let newPage = {name:this.refs.newPageName.value, url:this.refs.newPageName.value.replace(/\s/g,''),sections:[]};
    this.setState({loading:true,error:""});
    fetch("https://intellgentcms.herokuapp.com/api/page",{
      method: 'POST',
      headers: {
        'x-access-token':localStorage.getItem("ComToken"),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(newPage)
    }).then(response=> response.json()).then(json=>{
      if(json.success){
        this.setState((prevState)=>{
          let newPages = prevState.pages.push(newPage);
          return {loading:false, newPages,error:""};
        });
      }
      else{
        this.setState({error:json.message, loading:false});
      }
    }).catch(err=>console.error(err));
  }

  else{
    this.setState({loading:false,error:"Ingrese un nombre"});
  }
}
showDeleteModal= ()=>{
  this.setState({deleteModalVisible:true})
}
showEditModal= ()=>{
  this.setState({editModalVisible:true})
}
handleOkEdit = () => {

  if(this.refs.newName.value.trim() !==""){
    this.setState({
      loading: true,
      error:""
    });
    let newPage = {name:this.refs.newName.value, url:this.refs.newName.value.replace(/\s/g,''),originalUrl:this.state.name.replace(/\s/g,'')};

    fetch("https://intellgentcms.herokuapp.com/api/page",{
      method: 'PUT',
      headers: {
        'x-access-token':localStorage.getItem("ComToken"),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(newPage)
    }).then(response=> response.json()).then(json=>{
      if(json.success){
        this.setState({
          editModalVisible: false,
          loading: false,
          error:""
        });
        window.location.reload();
      }
      else{
        alert(json.message);
      }
    }).catch(err=>console.error(err));

  }
  else{
    this.setState({
      error:"No pueden haber campos vacíos"
    });
  }

}

handleOkDelete = () => {

  this.setState({
    loading: true,
    error:""
  });
  fetch("https://intellgentcms.herokuapp.com/api/page",{
    method: 'DELETE',
    headers: {
      'x-access-token':localStorage.getItem("ComToken"),
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body:JSON.stringify({url:this.state.name.replace(/\s/g,'')})
  }).then(response=> response.json()).then(json=>{
    if(json.success){
      this.setState({
        deleteModalVisible: false,
        loading: false,
        error:""
      });
      window.location.reload();
    }
      else{
        this.setState({
          deleteModalVisible: false,
          loading: false,
          error:""
        });
        alert(json.message);
      }
    }).catch(err=>console.error(err));
  }
  handleCancelEdit = () => {
    this.setState({
      editModalVisible: false,
    });
  }
  handleCancelDelete = () => {
    this.setState({
      deleteModalVisible: false,
    });
  }
  render() {
    return (
      <div className= "page-info">
        <div className="selector-label" >Nombre de la interna</div>
        <Select defaultValue="internas" className="page-selector"  style={{ width: 120 }} onChange={this.handleSelection}  notFoundContent ="No hay páginas">
          {
            this.renderOptions()
          }
        </Select>
        <Modal
          title="Title"
          visible={this.state.editModalVisible}
          onOk={this.handleOkEdit}
          confirmLoading={this.state.loading}
          onCancel={this.handleCancelEdit}
          >
            <div className = "editModal">Nombre:</div>
            <input  type="text" ref = "newName" placeholder = "Nombre de la categoría" className="form-control" style ={{width:"80% !important",margin:"20px 0 20px 0"}} defaultValue ={this.state.name}></input>
            <div style = {{"color":"red"}}>{this.state.error}</div>
          </Modal>



          <Modal
            title="Borrar página"
            visible={this.state.deleteModalVisible}
            onOk={this.handleOkDelete}
            confirmLoading={this.state.loading}
            onCancel={this.handleCancelDelete}
            >
              <p>¿Desea eliminar esta página?</p>
            </Modal>


            {this.state.newPage?(<Icon type="close-circle" className ="new-page-btn" onClick ={this.toggleNewPage}/>):(<Icon type="plus-circle" className ="new-page-btn" onClick ={ this.toggleNewPage} />)}
            <div style ={{ marginTop:"20px"}}>

              {this.state.name &&<button  className="btn"   onClick = {this.showEditModal} style ={{"width":"20%", marginRight:"20px"}}>Editar</button>}
              {this.state.name &&  <button  className="btn"  onClick={this.showDeleteModal} style ={{"width":"20%"}}>Eliminar</button>}
            </div>
            {this.state.newPage&&(
              <form className ="new-page" onSubmit = {this.submitNewPage}>
                <div  className = "subsubtitle new-page-item">
                  <span> Nueva página</span>
                </div>
                <input  type="text" ref = "newPageName" placeholder = "Nombre de la página" className="form-control text-input new-page-item " rows = "1"></input>
                {this.state.loading?(
                  <div className="spinner">
                    <div className="double-bounce1"></div>
                    <div className="double-bounce2"></div>
                  </div>)
                  :
                  (<div>
                    <button  className="btn new-page-item"   style ={{"width":"40%"}}  type="submit">Agregar</button>
                    <div style = {{"color":"red"}}>{this.state.error}</div>
                  </div>)
                }

              </form>
            )}
          </div>
        );
      }
    }

    export default Selector;
