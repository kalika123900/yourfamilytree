import React,  { Component } from 'react'
import { BrowserRouter  as Router, Route, Link } from 'react-router-dom';

class Aboutus extends Component{
    constructor(){
        super();
        
    }
    
    render(){ 
    return  <div className="main">
                <header className="aboutusbanner">
                    <div className="row">
                        <div className="col col-md-12 col-sm-12 headingus">
                            <h1>About Us</h1>
                        </div>
                    </div>
                </header>
                <div className="container">
                    <div className="aboutus-text">
                        <h3>FAMILY TREE</h3>
                        <p>Family Tree is a joint venture of S.K. Global and S.K. Innovative an entity of S K GROUP. Basically this is online portal where you can get basic details of your entire family andyour near and dear ones which we should know, but normally we don’t know and also don’t know the huge benefits which we can get from our own family and near & dear ones if we have connection and information about them.</p>
                        <p>In the present era everyone is busy and doesn’t get time to get connect and have any information of own family member and for entire life we try to get new connection, references, relation for education, marriage,job, business, social life and ultimately retirement. So this is the platform where you can get basic detail of your entire family and your near and dear ones at one place and you can get connected with them very easily.</p>
                    </div>
                </div>
                <div className="row basic-points">
                    <div className="container">
                        <div className="col col-md-12 col-sm-12 center-content">
                            <h6>Some of the benefits of family tree are -</h6>
                            <div className="left-content">
                                <p> - To get basic information of our own entire family.</p>
                                <p> - To get connect with your near and dear ones.</p>
                                <p> - Business expansions.</p>
                                <p> - Data for matrimonial purpose with entire family details</p>
                                <p> - To get any references across the globe.</p>
                                <p> - To help or support our own family by internal business.</p>
                                <p> - Promotion of anything within family members and choice of near & dear ones.</p>
                                <p> - To give any message or any announcement within your entire family.</p>
                            </div>
                        </div> 
                    </div>
                </div>
                <div className="container">
                    <div className="row jumbotron">
                        <div className="col col-md-12 col-sm-12 last-content">
                            <h4>S K Innovatives</h4>
                            <p>S K Innovative is a firm which deals in business concept selling. Firm is regularly involved in development of new business, surveys, study of existing business, consultation for change in business model, diversification, expansion etc.</p>
                        </div>
                        <div className="col col-md-12 col-sm-12 last-content">  
                            <h4>S K Global</h4>
                            <p>S K Global is a firm which deals in multiple businesses like trading, industrial supplies, online portal, restaurants etc. Firm also keep investing in different business having opportunity and new concept. </p>
                        </div>
                    </div>
                </div>
            </div>
}
}

export default Aboutus;