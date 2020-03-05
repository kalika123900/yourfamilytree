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
      uuid: this.props.uuid
    }
  }

  render() {
    const { uuid } = this.state;
    return (
      <Container className="capture">
        <div className="containerBlock">
          <Row>
            <Col md={12} xs={4}>
              <Link to={'/profile/' + uuid}><button type="button" className="btn btn-primary lightbtn" style={{ 'fontSize': '0.6rem', 'width': '150px' }}>See Tree</button></Link>
            </Col>
          </Row>
          <Row>

            <Col md={12} xs={4}>
              <Link to="/landingpage"> <button type="button" className="btn btn-primary lightbtn" style={{ 'fontSize': '0.6rem', 'width': '150px' }}>Update Details</button></Link>
            </Col>
          </Row>
          <Row>

            <Col md={12} xs={4}>
              <Link to="/javascript:void(0)"><button type="button" className="btn btn-primary lightbtn" style={{ 'fontSize': '0.6rem', 'width': '150px' }} >Who See You</button></Link>
            </Col>
          </Row>

        </div>

        <Adslider />
      </Container>

    )
  }
}
export default Dashboard;
