import React,  { Component } from 'react'
import { BrowserRouter  as Router, Route, Link } from 'react-router-dom';

class Tree extends Component{
    state = {
        
    }

render(){ 
    return <div className="main">
        <div className="container">
            <div className="row profile-page">
                <div className="col-md-12 col-12 profile-heading">
                    <h1 className="profile-heading">Your Family Tree<span className="nav-search"><a href="#">Search</a></span></h1>
                </div>
            </div>
            <div className="row profile-alert">
                <div className="col-md-12 col-12 alert-heading">
                    <h3 className="">Request to All!</h3>
                    <p>Please fill the family tree form and after that you can see all the detail of your entire family on online portal. You can get the detail of your near & dear like business, contact detail, location etc.</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 col-12">
                    <div id="myDiagramDiv" style="width:100%; height:600px; background-color: #DAE4E4;"></div>
                    
                </div>
                <div className="col-md-6 col-12">
                </div>
            </div>
        </div>
        </div>
    }
}
export default Tree;