import React, {Component} from 'react';
import config from '../config';
import ApiContext from '../ApiContext.js';
import PropTypes from 'prop-types';
import "./addFolder.css"

export default class AddFolder extends Component{
    static contextType = ApiContext;

    AddFolder = (name) =>{
        fetch(`${config.API_ENDPOINT}/folders/`,{
            method: 'POST',
            headers:{
                'content-type': 'application/json',
            },
            body: JSON.stringify({name})
        })
        .then(res =>res.json())
        .then(data => this.context.addFolder(data))
    }

    handleSubmit(event){
        event.preventDefault();
        const newFolder = event.target.newFolder.value;
        this.AddFolder(newFolder);
        this.props.history.goBack();
    }

    updateFolderName(newName){
        const name = newName.target.value;
        this.context.updateNewFolderName(name);
    }

    validateFolderName(){
        if(this.context.newFolder.name.trim()===0){
            return 'Must be more than 0 characters.'
        }else if(this.context.newFolder.name.trim().legnth <=3){
            return 'Must be more than 3 characters.'
        }
    }

    render() {
        return (
            <div className= 'wrapper'>
            <header>
                <h2 className='add-folder-header'>Add A New Folder</h2>
            </header>
            <form className = "add-folder-form" onSubmit={
                event =>this.handleSubmit(event)}>
            <label htmlFor="newFolder">
                Name:{this.context.newFolder.touched && (
                    <p>{this.validateFolderName()}</p>
                )}
            </label>
            <input 
            type ="text"
            name = "newFolder"
            id = "newFolder"
            aria-required ="true"
            aria-label = "Name"
            onChange = {(event)=>this.updateFolderName(event)}/>

            <button type="submit">Submit</button>
            </form>
            </div>
        )
    }

}
AddFolder.propTypes ={
    history:PropTypes.object
}
