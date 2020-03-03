import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { Container, Row, Col, Form, Alert, Button, Badge } from 'react-bootstrap';
import Layout from 'react-bootstrap';
import SpouseInputs from './SpouseInputs';
import Adslider from "./Adslider";


class Join extends Component {
    constructor(props) {
        super(props);
        this.username = this.props.username;
    }

    state = {
        spouse: [],
        gotraList: [],
        community: [],
        selectedCommunity: '',
        perfectHuman: { name: '', surname: '', dob: '', fname: '', fsurname: '', fdob: '', mname: '', msurname: '', mdob: '' }
    }
    communityChange = (e) => {
        var cvalue = e.currentTarget.value;
        this.setState({ selectedCommunity: cvalue });
        if (cvalue == 'other') {
            $('.communityOther').css('display', 'block');
        }
        else {
            $('.communityOther').css('display', 'block');
        }
    }
    gotraHandler = (e) => {
        var _that = $(e.currentTarget);
        if (_that.val() == 'Other') {
            _that.closest('.containerBlock').find('.gotraOther').closest('.col-md-4').css('display', 'block');
        }
        else {
            _that.closest('.containerBlock').find('.gotraOther').closest('.col-md-4').css('display', 'none');
        }
    }
    componentDidMount() {
        var that = this;
        $('.dob').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            locale: {
                format: 'DD/MM/YYYY'
            },
        })
        $('body').on('change', '.dob', function (e) {
            var _that = $(this);
            var name = _that.attr('name');
            that.state.perfectHuman[_that.attr('name')] = _that.val();

        });
        var _that = this;
        $.ajax({ method: "POST", url: "/actions/", data: { action: 'getCommunity' } }).done(function (response) {
            var _response = JSON.parse(response);
            if (_response.status == 'success') {
                _that.setState({ community: _response.data.community });
                _that.setState({ gotraList: _response.data.gotra });
                _that.setState({ selectedCommunity: _response.data.community[0].uuid });

            }
            else {
                console.log('-------System Failure---------');
            }
        });
    }
    gotraElement = (_ename) => {
        var _that = this;
        if (typeof this.state.gotraList == 'object' && this.state.gotraList.hasOwnProperty(this.state.selectedCommunity) && this.state.gotraList[this.state.selectedCommunity].length > 0) {
            return <Form.Group className="Gotra" controlId="Gotra">
                <Form.Label>Gotra</Form.Label>
                <Form.Control as="select" name={_ename} onChange={this.gotraHandler} placeholder="Gotra" >
                    <option>Select Gotra</option>
                    {this.state.gotraList[this.state.selectedCommunity].map(function (value, index) {
                        return <option key={index} value={value.name}>{value.name}</option>
                    })}
                </Form.Control>
            </Form.Group>
        }
        else {
            return <Form.Group controlId="Gotra">
                <Form.Label>Gotra</Form.Label>
                <Form.Control type="text" name={_ename} placeholder="Gotra" />
                <Form.Text className="text-muted">
                </Form.Text>
            </Form.Group>
        }
    }
    componentDidUpdate() {
        $('.dob').daterangepicker({
            singleDatePicker: true,
            showDropdowns: true,
            locale: {
                format: 'DD/MM/YYYY'
            }
        });
    }


    handleChange = (e) => {
        var _that = this;
        _that.state.perfectHuman[e.target.name] = e.target.value;

    }

    handleSubmit = (e) => {
        e.preventDefault()
        var that = this;
        //$.ajax({type: 'POST',url: STATIC_URL+'/registration/', data: $('form').serialize()}).success(function(data){
        // var $response = JSON.parse(data);
        // if($response.status=='success'){
        //that.props.submitSuccess({uuid:$response.data.uuid,name:'kalika',father_name:'pradeep',surname:'mishra'});
        //that.props.history.push('/suggestion'); 
        Console.log("work sucessfully")
            // }
            //})
            .error(function () {
                alert('Could not submit the form');
            })
    }

    render() {
        const { community } = this.state;
        if (community == null) {
            return <img src="/palm-tree.gif" style={{ width: '100%' }} />;
        }
        return (
            <Container className="capture">
                <Row>
                    <Col className="pt-2" md={12} xs={12}>
                        <Alert variant="success">
                            <Alert.Heading>Request to All!</Alert.Heading>
                            <p style={{ 'marginBottom': '0px' }}>
                                Please fill the family tree form.<br />
                                <strong>*Please Note that Date Of Birth, First Name and Last Name must be right of your Family Members.</strong>
                            </p>
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <h3 className="col-md-12"><Button variant="primary">
                        Your <Badge variant="light">Details</Badge>
                        <span className="sr-only">unread messages</span>
                    </Button></h3>
                    <Col md={12} xs={12}>
                        <Form onSubmit={this.handleSubmit}>
                            <div className="containerBlock">
                                <Row>
                                    <Col md={6} xs={12}>
                                        <Form.Group controlId="formYourName">
                                            <Form.Label>Community*</Form.Label>
                                            <Form.Control name="community" onChange={this.communityChange} as="select" required>
                                                {this.state.community.map((value, index) => {
                                                    return <option key={index} value={value.uuid}>{value.name}</option>
                                                })}
                                            </Form.Control>
                                            <Form.Text className="text-muted"></Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <Form.Group className="communityOther" style={{ 'display': 'none' }} controlId="commother">
                                            <Form.Label>Other Community*</Form.Label>
                                            <Form.Control name="otherc" type="text" placeholder="Community Name" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="formyoutitle">
                                            <Form.Label>Title*</Form.Label>
                                            <Form.Control name="title" as="select" defaultValue="mr" required>
                                                <option value="mr">Mr</option>
                                                <option value="ms">Ms</option>
                                                <option value="mrs">Mrs</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="formYourName">
                                            <Form.Label>Name*</Form.Label>
                                            <Form.Control name="name" type="text" placeholder="Name" onChange={this.handleChange} required />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="formYourName">
                                            <Form.Label>Surname*</Form.Label>
                                            <Form.Control name="surname" type="text" placeholder="Surname" onChange={this.handleChange} required />
                                            <Form.Text className="text-muted"></Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Dob">
                                            <Form.Label>Dob*</Form.Label>
                                            <Form.Control type="text" name="dob" className="dob" placeholder="Dob" required />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="formYourOccupation">
                                            <Form.Label>Your Gender*</Form.Label>
                                            <Form.Control as="select" name="gender" required>
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>


                                    <Col md={4} xs={12}>
                                        <Form.Group onChange={this.marritalStatusChange} controlId="maritalstatus">
                                            <Form.Label>Marital Status*</Form.Label>
                                            <Form.Control as="select" name="marital_status" className="marital_status" required>
                                                <option value="">Select Marital Status</option>
                                                <option value="married">Married</option>
                                                <option value="single">Single</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="EmailId">
                                            <Form.Label>Email Id*</Form.Label>
                                            <Form.Control type="email" name="email" placeholder="email@example.com" required />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            <h4 className="infofamily">Family Information</h4>
                            <Alert variant="primary">
                                <div className="alert-heading newhead"><h5>Father</h5></div>
                            </Alert>
                            <div className="containerBlock">
                                <Row>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Fformtitle">
                                            <Form.Label>Title*</Form.Label>
                                            <Form.Control name="ftitle" as="select" defaultValue="mr" required>
                                                <option value="mr">Mr</option>
                                                <option value="late">Late</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="FformName">
                                            <Form.Label>Name*</Form.Label>
                                            <Form.Control name="fname" type="text" placeholder="Name" onChange={this.handleChange} required />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="FfocrmName">
                                            <Form.Label>Surname*</Form.Label>
                                            <Form.Control type="text" name="fsurname" placeholder="Surname" onChange={this.handleChange} required />
                                            <Form.Text className="text-muted"></Form.Text>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Dob">
                                            <Form.Label>Dob*</Form.Label>
                                            <Form.Control type="text" name="fdob" className="dob" placeholder="Dob" required />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        {this.gotraElement('fgotra')}
                                    </Col>
                                    <Col md={4} xs={4} style={{ 'display': 'none' }} >
                                        <Form.Group className="gotraOther" controlId="gotraOther">
                                            <Form.Label>Gotra Other</Form.Label>
                                            <Form.Control type="text" name="fgotra_other" placeholder="Gotra Other" required />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>

                                </Row>
                            </div>
                            <Alert variant="primary">
                                <div className="alert-heading newhead"><h5>Mother</h5></div>
                            </Alert>
                            <div className="containerBlock">
                                <Row>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Fformtitle">
                                            <Form.Label>Title*</Form.Label>
                                            <Form.Control as="select" name="mtitle" defaultValue="mrs" required>
                                                <option value="mrs">Mrs</option>
                                                <option value="late">Late</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="FformName">
                                            <Form.Label>Name*</Form.Label>
                                            <Form.Control type="text" name="mname" placeholder="Name" onChange={this.handleChange} required />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="M">
                                            <Form.Label>Surname*</Form.Label>
                                            <Form.Control type="text" name="msurname" placeholder="Surname" onChange={this.handleChange} required />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>

                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Dob">
                                            <Form.Label>Dob*</Form.Label>
                                            <Form.Control type="text" name="mdob" className="dob" placeholder="Dob" required />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        {this.gotraElement('mgotra')}
                                    </Col>
                                    <Col md={4} xs={12} style={{ 'display': 'none' }}>
                                        <Form.Group className="gotraOther" controlId="gotraOther">
                                            <Form.Label>Gotra Other</Form.Label>
                                            <Form.Control type="text" name="mgotra_other" placeholder="Gotra Other" required />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>

                                </Row>
                            </div>
                            <Row>
                                <Col md={12} xs={12}>
                                    <Form.Control type="submit" value="Submit" className="btn btn-success btn-block mt-1" placeholder="Submit" />
                                </Col>
                            </Row>

                        </Form>
                        <Adslider />
                    </Col>
                </Row>

            </Container>

        )
    }
}
export default Join;