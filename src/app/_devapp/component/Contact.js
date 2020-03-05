import React,  { Component } from 'react'
import { BrowserRouter  as Router, Route, Link } from 'react-router-dom';
import {Container, Row,Col,Form,Alert,Button,Badge} from 'react-bootstrap';

class Contact extends Component{
    constructor(){
        super();
        
    }
    
    render(){ 
    return    <div className="main">
                <header className="contactusbanner">
                    <div className="row">
                        <div className="col col-md-12 col-sm-12 headcontact">
                            <h1>Contact Us</h1>
                        </div>
                    </div>
                </header>
                <div className="container">
                    <div className="row contact-us">
                    <div className="col col-md-8 col-sm-12">
                        <Form>
                            <h3>Get in Touch</h3>
                            <h4>Please fill out the quick form and we will be in touch with lightening speed.</h4>
                            <div className="input-contact">
                            <input type="name"className="form-control" placeholder="Name" name="name" required/>
                            <input type="name"className="form-control" placeholder="Your eamil address" name="name" required/>
                            <textarea className="subject" name="subject" placeholder="Message.."></textarea>
                            </div>
                            <div className="conatct-btn">
                            <button className="form-control btn-search" type="submit">SUBMIT</button>
                            </div>
                        </Form>
                    </div>
                    <div className="col col-md-4 col-sm-12 contact-with">
                        <div className="leftcontact">
                        <h3>Connect with us:</h3>
                        <p>For support or any questions:</p>
                        <p>Email us at youfamilytree.com</p>
                        </div>
                        <div className="leftcontact">
                        <h4>Pispa USA</h4>
                        <p>501 Sliverside Road, Suite 105,</p>
                        <p>Dela 19809</p>
                        <p>USA</p>
                        </div>
                        <div className="leftcontact">
                        <h4>Pispa India</h4>
                        <p>B-222, First floor</p>
                        <p>Email us at youfamilytree.com</p>
                        <p>New Delhi</p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
}
}

export default Contact;