import React,  { Component } from 'react'
import {withRouter} from 'react-router';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import {Container, Row,Col,Form,Alert,Button,Badge} from 'react-bootstrap';
import { BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import 'whatwg-fetch';

class Footer extends Component {
    constructor(props){
      super(props);
      this.username = this.props.username;
    }

render() {
    return (
    <footer className="container-fluid bg-dark text-white">	
        <div className="container footertext">
            <small>Copyright © 2019 By Your Family Tree, Inc. All rights reserved.</small>
            <div className="right-link">
                <ul className="bottom-link">
                    <li><Link to="/aboutus">About Us</Link></li>
                    <li><a href="javascript:void(0)">Feedback</a></li>
                    <li><a href="javascript:void(0)">Privacy Policy</a></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li><Link to="/join">Join</Link></li>
                </ul>
            </div>
        </div> 
    </footer>
 )
}
};

export default Footer;