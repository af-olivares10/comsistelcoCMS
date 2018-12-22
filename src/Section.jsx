import React, { Component } from 'react';
import './App.css';
import {Icon, Modal} from "antd"
class Section extends Component {
constructor(props){
  super(props);
  this.state = {
    editModalVisible: false,
    deleteModalVisible: false,
    loading:false,
    error:""
  }
}

  showEditModal = () => {
    this.setState({
      editModalVisible: true,
    });
  }

  showDeleteModal = () => {
    this.setState({
      deleteModalVisible: true,
    });
  }

  handleOkEdit = () => {

    if(this.refs.newTitle.value.trim() !=="" && this.refs.newContent.value.trim() !==""){
      this.setState({
        loading: true,
        error:""
      });
      let newSection = {_id:this.props.section._id,page:this.props.pageSelected,content:this.refs.newContent.value,title:this.refs.newTitle.value,}
      fetch("https://intellgentcms.herokuapp.com/api/section",{
        method: 'PUT',
        headers: {
          'x-access-token':localStorage.getItem("ComToken"),
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(newSection)
      }).then(response=> response.json()).then(json=>{
        if(json.success){
          this.setState({
            editModalVisible: false,
            loading: false,
            error:""
          });
          this.props.sectionEdited(newSection);
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
          let byeSection = {_id:this.props.section._id,page:this.props.pageSelected,}
          fetch("https://intellgentcms.herokuapp.com/api/section",{
            method: 'DELETE',
            headers: {
              'x-access-token':localStorage.getItem("ComToken"),
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body:JSON.stringify(byeSection)
          }).then(response=> response.json()).then(json=>{
            if(json.success){
              this.setState({
                deleteModalVisible: false,
                loading: false,
                error:""
              });
              this.props.sectionDeleted(byeSection);
            }
            else{
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
  showImages = ()=>{
    if(this.props.section.images)
    return this.props.section.images.map((imageUrl,i)=>{
      return (<img src = {imageUrl} className = "thumbnail"></img>)
    })
  }
  render() {
    return (
      <div className = "section-wrapper">
        <div className = "section">
          <h2 className = "section-title"> {this.props.section.title}</h2>
          <div className = "section-content"> {this.props.section.content}</div>
          <div className = "images-wrapper">

            {this.showImages()}
          </div>
        </div>
        <div className = "section-icons">
          <Icon className = "section-icon" type="edit" onClick = {this.showEditModal}/>
          <Modal
            title="Title"
            visible={this.state.editModalVisible}
            onOk={this.handleOkEdit}
            confirmLoading={this.state.loading}
            onCancel={this.handleCancelEdit}
          >
            <div className = "editModal">Nombre:</div>
            <input  type="text" ref = "newTitle" placeholder = "Nombre de la categoría" className="form-control" style ={{width:"80% !important",margin:"20px 0 20px 0"}} defaultValue ={this.props.section.title}></input>
            <div  className = "editModal"> Descripción</div>
            <input  type="text" ref = "newContent" placeholder = "Descripción de la categoría" className="form-control" style ={{width:"80% !important",margin:"20px 0 20px 0"}} defaultValue ={this.props.section.content}></input>
            <div style = {{"color":"red"}}>{this.state.error}</div>
          </Modal>



          <Icon className = "section-icon" type="delete" onClick = {this.showDeleteModal}/>
          <Modal
            title="Title"
            visible={this.state.deleteModalVisible}
            onOk={this.handleOkDelete}
            confirmLoading={this.state.loading}
            onCancel={this.handleCancelDelete}
          >
            <p>¿Desea eliminar esta Sección de la página?</p>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Section;
