import React,  { Component } from 'react'
import {withRouter} from 'react-router';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import {Container, Row,Col,Form,Alert,Button,Badge} from 'react-bootstrap';
import { BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import {makeSecureDecrypt} from '../helper/security';
import 'whatwg-fetch';

// The Header creates links that can be used to navigate
// between routes.
class Header extends Component {
  constructor(props){
    super(props);
    this.username = this.props.username;
    this.state = {
      isLogin : this.props.isLogin,
      fullName : this.props.fullName,
    }
  }
  componentDidMount(){
   
  }
  showProfile=()=>{
    this.props.history.push('/profile');
  }
  logout = () =>{
    localStorage.removeItem('__person');
    this.setState({isLogin:false})
    this.setState({fullName:null});
    window.location.href='/';
  }
  componentDidUpdate(){
    

  }

  render() {
    const {isLogin} = this.state;
    const {fullName} = this.state;
    return (
          <Row>
              <Col className="" md={12} xs={12}>
                <Alert variant="primary">
                    <Alert.Heading>
                      
                      <Link to={"/"}><img src="/app/assets/mockup-img/logo.png" alt="" className="logoset"/></Link>
                      {(isLogin==false) && <span className="search-nav"><Link to={"/loginpage"}>Sign In</Link></span>}
                      {(isLogin==true) && <span className="search-nav"><h3 onClick={()=>this.showProfile()} className="profile_name">{fullName}</h3><h3 onClick={()=>this.logout()} className="shut_down"><i className="fa fa-power-off"></i></h3></span>}
                      </Alert.Heading>
                </Alert>
              </Col>
        </Row>        
    )
  }
};

export default withRouter(Header);