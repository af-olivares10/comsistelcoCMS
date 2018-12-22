import React, { Component } from 'react';

class NewSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      error:""
    };
  }

  submitNewSection = (e)=>{
    e.preventDefault();
    if( this.refs.title.value.trim() !== "" && this.refs.content.value.trim() !== ""){

      this.setState({loading:true,error:""});
      let images = [];
      if(this.refs.images.files[0]){
        uploadASecondary.bind(this)(0);
        function uploadASecondary(index){
          this.uploadFile(this.refs.images.files[index]).then(json2 =>{
            images.push(json2.imageUrl);
            if(++index<this.refs.images.files.length){
              uploadASecondary.bind(this)(index);
            }
            else{
              this.submitSection(images);
            }

          }).catch(err => {
            alert("Ocurrió un error subiendo las imágenes")
            console.error(err);
          });
        }
      }
      else{
        this.submitSection([])
      }
    }
    else{
      this.setState({error:"Ingrese todos los campos"});
    }
  }

  submitSection=(images)=>{

    let newSection = {images, title:this.refs.title.value, content: this.refs.content.value, page: {_id:this.props.pageSelected._id,name:this.props.pageSelected.name,url:this.props.pageSelected.url,}};
    fetch("https://intellgentcms.herokuapp.com/api/section",{
      method: 'POST',
      headers: {
        'x-access-token':localStorage.getItem("ComToken"),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(newSection)
    }).then(response => response.json()).then(json=>{
      this.setState({loading:false});
      if(json.success){
        newSection._id = json.id;
        this.props.newSection(newSection);
      }
      else{
        alert(json.message);
      }
    }).catch(error=>{
      this.setState({loading:false});
      alert("Ocurrió un error");
      console.error(error);
    }
    )
  }

  uploadFile = (file)=>{
    let formData = new FormData();
    formData.append("image",file);
    return fetch('https://intellgentcms.herokuapp.com/api/uploadPicture', {
      method: 'POST',
      headers: {
        'x-access-token':localStorage.getItem("ComToken")
      },
      body:formData
    }).then( response => response.json())
  }
  render() {
    return (
      <div className = "new-section">
        <h2 className = "subtitle">Nueva sección</h2>

        <form   onSubmit = {this.submitNewSection}>
          <textarea ref = "title" className="form-control text-input new-section-title" rows="1"  placeholder="Titulo" ></textarea>
          <textarea ref = "content" className="form-control text-input new-section-content" rows="4"  placeholder="Contenido" ></textarea>
          <div  className = "images-label">
             Imágenes
          </div>
          <div className = " images-input-wrapper">
            <input id = "file-upload" className = "text-input images-input" type="file" ref = "images" name="myimages"  accept="image/*"  multiple /><br/>
          </div>
          {(!this.state.loading)&&(
            <button  className="btn"  style ={{marginLeft:"10%"}} type="submit">Agregar</button>
          )
        }
        {(this.state.loading)&&(
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        )
      }
      <label className ="login-error" >{this.state.error}</label>
    </form>


  </div>


);
}
}

export default NewSection;
