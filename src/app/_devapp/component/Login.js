import React, { Component}  from 'react';
import { Link } from 'react-router-dom';
import {Container, Row,Col,Form,Alert,Button,Badge} from 'react-bootstrap';
import Adslider from "./Adslider";

class Login extends Component {
  constructor(props){
    super(props);
    this.username = this.props.username;
  }
  render() {
    return (
          <Row>
              <Col className="" md={12} xs={12}>
                <Alert variant="primary">
                    <Alert.Heading><h1>Your Family Tree <span className="search-nav"><Link to="/login">LOGIN</Link></span></h1></Alert.Heading>
                </Alert>
              </Col>
              <Adslider/>
        </Row>        
    )
  }
}

export default Login;