import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, } from 'react-bootstrap';
import Adslider from "./Adslider";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.username = this.props.username;
    this.state = {
      isLogin: this.props.isLogin,
      fullName: this.props.fullName,
    }
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}