import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { Container, Row, Col, Form, Alert, Button, Badge } from 'react-bootstrap';
import Layout from 'react-bootstrap';
import SpouseInputs from './SpouseInputs';
import BrotherInputs from './BrotherInput';
import SisterInputs from './SisterInput';
import ChildrenInputs from './ChildrenInput';
import Adslider from "./Adslider";
'use strict';

class Landingpage extends Component {
    constructor(props) {
        super(props);
        this.username = this.props.username;
    }

    state = {
        spouse: [],
        brother: [],
        sister: [],
        children: [],
        community: [],
        gotraList: [],
        selectedCommunity: '',
        perfectHuman: { name: '', surname: '', dob: '', fname: '', fsurname: '', fdob: '', mname: '', msurname: '', mdob: '' }
    }
    addSpouse = (e) => {
        this.setState((prevState) => ({
            spouse: [...prevState.spouse, { spousename: "", spouseaadharno: "", spousedob: "", spousemobileno: "", spouseemail: "", spouseoccupation: "", spousebusiness: "", spousegotra: "" }],
        }));

    }
    addBrother = (e) => {
        this.setState((prevState) => ({
            brother: [...prevState.brother, { brothername: "", brotheraadharno: "", brotherdob: "", brothermaritalstatus: "", brothermobileno: "", brotheremail: "", brotheroccupation: "", brotherbusiness: "", brothergotra: "" }],
        }));

    }
    addSister = (e) => {
        this.setState((prevState) => ({
            sister: [...prevState.sister, { sistername: "", sisteraadharno: "", sisterdob: "", sistermaritalstatus: "", sistermobileno: "", sisteremail: "", sisteroccupation: "", sisterbusiness: "", sistergotra: "" }],
        }));

    }
    addChildren = (e) => {
        this.setState((prevState) => ({
            children: [...prevState.children, { childrenname: "", childrenaadharno: "", childrendob: "", childrenmobileno: "", childrenemail: "", childrenoccupation: "", childrenbusiness: "", childrengotra: "" }],
        }));

    }

    communityChange = (e) => {
        var cvalue = e.currentTarget.value;
        this.setState({ selectedCommunity: cvalue });
        if (cvalue == 'com-54f3b12d-a164-4205-8eb3-454e742257b4') {
            $('.communityOther').css('display', 'block');
        }
        else {
            $('.communityOther').css('display', 'none');
        }
    }
    marritalStatusChange = (e) => {
        let p = document.getElementById('maritalstatus').value;
        if (p == 'single') {
            var spouse = document.getElementsByClassName('spouseContainer');
            console.log(spouse);
            document.getElementById('addSpouse').disabled = true;
            [].forEach.call(spouse, function (v) {
                v.style.display = 'none';
            });
            $('.ssname').removeAttr('required');
            $('.sssurname').removeAttr('required');
            $('.ssdob').removeAttr('required');
        }
        else {
            var spouse = document.getElementsByClassName('spouseContainer');
            document.getElementById('addSpouse').disabled = false;
            [].forEach.call(spouse, function (v) {
                v.style.display = 'block';
            });
            $('.ssname').attr('required', true);
            $('.sssurname').attr('required', true);
            $('.ssdob').attr('required', true);
            this.setState((prevState) => ({
                spouse: [...prevState.spouse, { spousename: "", spouseaadharno: "", spousedob: "", spousemobileno: "", spouseemail: "", spouseoccupation: "", spousebusiness: "", spousegotra: "" }],
            }));
        }

    }
    occupationHandler = (e) => {
        var _that = $(e.currentTarget);
        if (_that.val() == 'Other') {
            _that.closest('.containerBlock').find('.occupationOther').closest('.col-md-4').css('display', 'block');
        }
        else {
            _that.closest('.containerBlock').find('.occupationOther').closest('.col-md-4').css('display', 'none');
        }
    }
    categoryHandler = (e) => {
        var secMaj = document.getElementById('Category');
        if (secMaj.value == 'Other') {
            $('.categoryOther').closest('.col-md-4').css('display', 'block');
        }
        else {
            $('.categoryOther').closest('.col-md-4').css('display', 'none');
        }
    }
    sectorMajorHandler = (e) => {
        var secMaj = document.getElementById('SectorMajor');
        if (secMaj.value == 'other') {
            $('.sector_major_other').closest('.col-md-4').css('display', 'block');
        }
        else {
            $('.sector_major_other').closest('.col-md-4').css('display', 'none');
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
    checkBrotherSister() {
        const { perfectHuman } = this.state;
        var _count = 0;
        for (var index in perfectHuman) {
            if (perfectHuman[index] != '') {
                _count++
            }
        }
        if (_count >= 9) {
            //RUN AJAX and Load Brother - Sister
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
        });
        $('body').on('change', '.dob', function (e) {
            var _that = $(this);
            var name = _that.attr('name');
            that.state.perfectHuman[_that.attr('name')] = _that.val();
            that.checkBrotherSister();
        });
        var p = document.getElementById('maritalstatus');
        if (p != null) {
            p = p.value;
            if (p == 'single') {
                $('.ssname').removeAttr('required');
                $('.sssurname').removeAttr('required');
                $('.ssdob').removeAttr('required');
            }
            else {
                $('.ssname').attr('required', true);
                $('.sssurname').attr('required', true);
                $('.ssdob').attr('required', true);
            }
        }
        $('input[name="bname[]"]').keyup(function () {
            var _that = $(this);
            var _parent = _that.closest('.brotherContainer');
            if (_that.val() != '') {
                _parent.find('input[name="bsurname[]"]').attr('required', true);
                _parent.find('input[name="bdob[]"]').attr('required', true);
            }
            else {
                _parent.find('input[name="bsurname[]"]').removeAttr('required');
                _parent.find('input[name="bdob[]"]').removeAttr('required');
            }
        });
        $('input[name="sname[]"]').keyup(function () {
            var _that = $(this);
            var _parent = _that.closest('.sisterContainer');
            if (_that.val() != '') {
                _parent.find('input[name="ssurname[]"]').attr('required', true);
                _parent.find('input[name="sdob[]"]').attr('required', true);
            }
            else {
                _parent.find('input[name="ssurname[]"]').removeAttr('required');
                _parent.find('input[name="sdob[]"]').removeAttr('required');
            }
        });
        $('input[name="ssname[]"]').keyup(function () {
            var _that = $(this);
            var _parent = _that.closest('.spouseContainer');
            if (_that.val() != '') {
                _parent.find('input[name="sssurname[]"]').attr('required', true);
                _parent.find('input[name="ssdob[]"]').attr('required', true);
            }
            else {
                _parent.find('input[name="sssurname[]"]').removeAttr('required');
                _parent.find('input[name="ssdob[]"]').removeAttr('required');
            }
        });
        $('input[name="cname[]"]').keyup(function () {
            var _that = $(this);
            var _parent = _that.closest('.childrenContainer');
            if (_that.val() != '') {
                _parent.find('input[name="csurname[]"]').attr('required', true);
                _parent.find('input[name="cdob[]"]').attr('required', true);
            }
            else {
                _parent.find('input[name="csurname[]"]').removeAttr('required');
                _parent.find('input[name="cdob[]"]').removeAttr('required');
            }
        });
        $('.removeContainer').click(function (e) {
            var _that = $(this);
            _that.closest('.containerBlock').remove();
        });
        $('.marital_status').change(function (e) {
            var _that = $(this);
            var _ms = _that.val();
            if (_ms == 'married') {
                _that.closest('.containerBlock').find('.marriage_date').show();
                _that.closest('.containerBlock').find('.marriage_date').closest('.form-group').show();
                _that.closest('.containerBlock').find('.marriage_date').attr('required', 'true');
            }
            else {
                _that.closest('.containerBlock').find('.marriage_date').hide();
                _that.closest('.containerBlock').find('.marriage_date').closest('.form-group').hide();
                _that.closest('.containerBlock').find('.marriage_date').removeAttr('required');
            }
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
        var p = document.getElementById('maritalstatus');
        if (p.length > 0) {
            p = p.value;
            if (p == 'single') {
                $('.ssname').removeAttr('required');
                $('.sssurname').removeAttr('required');
                $('.ssdob').removeAttr('required');
            }
            else {
                $('.ssname').attr('required', true);
                $('.sssurname').attr('required', true);
                $('.ssdob').attr('required', true);
            }
        }
        $('input[name="bname[]"]').keyup(function () {
            var _that = $(this);
            var _parent = _that.closest('.brotherContainer');
            if (_that.val() != '') {
                _parent.find('input[name="bsurname[]"]').attr('required', true);
                _parent.find('input[name="bdob[]"]').attr('required', true);
            }
            else {
                _parent.find('input[name="bsurname[]"]').removeAttr('required');
                _parent.find('input[name="bdob[]"]').removeAttr('required');
            }
        });
        $('input[name="sname[]"]').keyup(function () {
            var _that = $(this);
            var _parent = _that.closest('.sisterContainer');
            if (_that.val() != '') {
                _parent.find('input[name="ssurname[]"]').attr('required', true);
                _parent.find('input[name="sdob[]"]').attr('required', true);
            }
            else {
                _parent.find('input[name="ssurname[]"]').removeAttr('required');
                _parent.find('input[name="sdob[]"]').removeAttr('required');
            }
        });
        $('input[name="ssname[]"]').keyup(function () {
            var _that = $(this);
            var _parent = _that.closest('.spouseContainer');
            if (_that.val() != '') {
                _parent.find('input[name="sssurname[]"]').attr('required', true);
                _parent.find('input[name="ssdob[]"]').attr('required', true);
            }
            else {
                _parent.find('input[name="sssurname[]"]').removeAttr('required');
                _parent.find('input[name="ssdob[]"]').removeAttr('required');
            }
        });
        $('input[name="cname[]"]').keyup(function () {
            var _that = $(this);
            var _parent = _that.closest('.childrenContainer');
            if (_that.val() != '') {
                _parent.find('input[name="csurname[]"]').attr('required', true);
                _parent.find('input[name="cdob[]"]').attr('required', true);
            }
            else {
                _parent.find('input[name="csurname[]"]').removeAttr('required');
                _parent.find('input[name="cdob[]"]').removeAttr('required');
            }
        });
        $('.removeContainer').click(function (e) {
            var _that = $(this);
            _that.closest('.containerBlock').remove();
        });
        $('.marital_status').change(function (e) {
            var _that = $(this);
            var _ms = _that.val();
            if (_ms == 'married') {
                _that.closest('.containerBlock').find('.marriage_date').show();
                _that.closest('.containerBlock').find('.marriage_date').attr('required', 'true');
            }
            else {
                _that.closest('.containerBlock').find('.marriage_date').hide();
                _that.closest('.containerBlock').find('.marriage_date').removeAttr('required');
            }
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        var that = this;
        $.ajax({ type: 'POST', url: STATIC_URL + '/registration/', data: $('form').serialize() }).success(function (data) {
            var $response = JSON.parse(data);
            if ($response.status == 'success') {
                that.props.submitSuccess({ uuid: $response.data.uuid, name: 'kalika', father_name: 'pradeep', surname: 'mishra' });
                that.props.history.push('/suggestion');
            }
        })
            .error(function () {
                alert('Could not submit the form');
            })

    }
    handleChange = (e) => {
        var _that = this;
        _that.state.perfectHuman[e.target.name] = e.target.value;
        _that.checkBrotherSister();
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
                                Please fill the family tree form and after that you can see all the detail of your entire family on online portal. You can get the detail of your near & dear like business, contact detail, location etc.<br />
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
                                        <Form.Group controlId="Dateofmarriage">
                                            <Form.Label>Date of marriage</Form.Label>
                                            <Form.Control type="text" name="date_of_marriage" className="marriage_date dob" placeholder="Date of marriage" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Occupation">
                                            <Form.Label>Occupation</Form.Label>
                                            <Form.Control as="select" onChange={this.occupationHandler} name="your_occupation">
                                                <option value="business">Business</option>
                                                <option value="profession">Profession</option>
                                                <option value="job">Job</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12} style={{ 'display': 'none' }}>
                                        <Form.Group controlId="Occupation">
                                            <Form.Label>Occupation Other</Form.Label>
                                            <Form.Control type="text" name="your_occupation_other" className="occupationOther" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Nameofbusiness">
                                            <Form.Label>Business name</Form.Label>
                                            <Form.Control type="text" name="name_of_business" placeholder="Name of business" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12} >
                                        <Form.Group controlId="Category" >
                                            <Form.Label>Category</Form.Label>
                                            <Form.Control as="select" onChange={this.categoryHandler} name="category">
                                                <option value="Manufacturing">Manufacturing</option>
                                                <option value="Trading">Trading</option>
                                                <option value="Service">Service</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12} style={{ 'display': 'none' }}>
                                        <Form.Group controlId="CategoryOther">
                                            <Form.Label>Category Other</Form.Label>
                                            <Form.Control type="text" name="category_other" className="categoryOther" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Since">
                                            <Form.Label>Since</Form.Label>
                                            <Form.Control type="text" name="since" placeholder="since" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="SectorMajor">
                                            <Form.Label>Sector Major</Form.Label>
                                            <Form.Control as="select" className="sector_major" onChange={this.sectorMajorHandler} name="sector_major">
                                                <option value="Doctor">Doctor</option>
                                                <option value="CA">CA</option>
                                                <option value="Engineer">Engineer</option>
                                                <option value="CS">CS</option>
                                                <option value="Advocate">Advocate</option>
                                                <option value="other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12} style={{ 'display': 'none' }}>
                                        <Form.Group controlId="SectorMajor">
                                            <Form.Label>Sector Major Detail</Form.Label>
                                            <Form.Control type="text" className="sector_major_other" name="specific_major_other" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Specificbusiness">
                                            <Form.Label>Specific business</Form.Label>
                                            <Form.Control type="text" name="specific_business" placeholder="eg. Heart, Eye" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="BrandName">
                                            <Form.Label>Brand Name (if any)</Form.Label>
                                            <Form.Control type="text" name="brand_name" placeholder="Brand name (if any)" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="EmailId">
                                            <Form.Label>Email Id</Form.Label>
                                            <Form.Control type="text" name="email" placeholder="email@example.com" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="MobileNo">
                                            <Form.Label>Mobile No.</Form.Label>
                                            <Form.Control type="text" name="mobile_no" placeholder="Mobile No." />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="LandlineNo">
                                            <Form.Label>Landline No.</Form.Label>
                                            <Form.Control type="text" name="landline_no" placeholder="Landline No." />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Website">
                                            <Form.Label>Website</Form.Label>
                                            <Form.Control type="text" name="website" placeholder="Website" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Address">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control type="text" name="address" placeholder="Address" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="State">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control type="text" name="state" placeholder="State" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>

                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="City">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control type="text" name="city" placeholder="Address" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="Qualification">
                                            <Form.Label>Qualification</Form.Label>
                                            <Form.Control as="select" name="qualification">
                                                <option value="Post-Graduate">Post Graduate</option>
                                                <option value="Graduate">Graduate</option>
                                                <option value="Under-Graduate">Under Graduate</option>
                                            </Form.Control>
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
                                        <Form.Group controlId="MobileNo">
                                            <Form.Label>Mobile No.</Form.Label>
                                            <Form.Control type="text" name="fmobile_no" placeholder="Mobile No." />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="EmailId">
                                            <Form.Label>Email Id</Form.Label>
                                            <Form.Control type="text" name="femail" placeholder="email@example.com" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="formYourOccupation">
                                            <Form.Label>Occupation</Form.Label>
                                            <Form.Control as="select" onChange={this.occupationHandler} name="fyour_occupation"  >
                                                <option value="Business">Business</option>
                                                <option value="Profession">Profession</option>
                                                <option value="Job">Job</option>
                                                <option value="Other">Other</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12} style={{ 'display': 'none' }}>
                                        <Form.Group controlId="Occupation">
                                            <Form.Label>Occupation Other</Form.Label>
                                            <Form.Control type="text" name="fyour_occupation_other" className="occupationOther" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="BusinessName">
                                            <Form.Label>Business Name</Form.Label>
                                            <Form.Control type="text" name="fbusiness_name" placeholder="Business Name" />
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
                                            <Form.Control type="text" name="fgotra_other" placeholder="Gotra Other" />
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
                                        <Form.Group controlId="MobileNo">
                                            <Form.Label>Mobile No.</Form.Label>
                                            <Form.Control type="text" name="mmobile_no" placeholder="Mobile No." />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="EmailId">
                                            <Form.Label>Email Id</Form.Label>
                                            <Form.Control type="text" name="memail" placeholder="email@example.com" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="formYourOccupation">
                                            <Form.Label>Your Occupation</Form.Label>
                                            <Form.Control as="select" onChange={this.occupationHandler} name="myour_occupation">
                                                <option value="Business">Business</option>
                                                <option value="Profession">Profession</option>
                                                <option value="Job">Job</option>
                                                <option value="Other">Other</option>

                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12} style={{ 'display': 'none' }}>
                                        <Form.Group controlId="Occupation">
                                            <Form.Label>Occupation Other</Form.Label>
                                            <Form.Control type="text" name="myour_occupation_other" className="occupationOther" />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} xs={12}>
                                        <Form.Group controlId="BusinessName">
                                            <Form.Label>Business Name</Form.Label>
                                            <Form.Control type="text" name="mbusiness_name" placeholder="Business Name" />
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
                                            <Form.Control type="text" name="mgotra_other" placeholder="Gotra Other" />
                                            <Form.Text className="text-muted">
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                            </div>
                            <Row>
                                <Col md={2} xs={4}>
                                    <Alert variant="primary darkbtn">
                                        <Alert.Heading><h5>Brother</h5></Alert.Heading>
                                    </Alert>
                                </Col>
                                <Col md={12} xs={4}>
                                    <BrotherInputs occupationHandler={this.occupationHandler} gotraElement={this.gotraElement} brother={this.state.brother} />
                                    <a href="javascript:void(0)" className="btn btn-primary lightbtn" style={{ 'fontSize': '0.6rem', 'width': '150px' }} onClick={this.addBrother}>Add Brother</a>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2} xs={4}>
                                    <Alert variant="primary darkbtn">
                                        <Alert.Heading><h5>Sister</h5></Alert.Heading>
                                    </Alert>
                                </Col>
                                <Col md={12} xs={4}>
                                    <SisterInputs occupationHandler={this.occupationHandler} gotraElement={this.gotraElement} sister={this.state.sister} />
                                    <a href="javascript:void(0)" className="btn btn-primary lightbtn" style={{ 'fontSize': '0.6rem', 'width': '150px' }} onClick={this.addSister}>Add Sister</a>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2} xs={4}>
                                    <Alert variant="primary darkbtn">
                                        <Alert.Heading><h5>Spouse</h5></Alert.Heading>
                                    </Alert>
                                </Col>
                                <Col md={12} xs={4}>
                                    <SpouseInputs occupationHandler={this.occupationHandler} gotraElement={this.gotraElement} spouse={this.state.spouse} />
                                    <button type="button" className="btn btn-primary lightbtn" id="addSpouse" style={{ 'fontSize': '0.6rem', 'width': '150px' }} onClick={this.addSpouse}>Add Spouse</button>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={2} xs={4}>
                                    <Alert variant="primary darkbtn">
                                        <Alert.Heading><h5>Children</h5></Alert.Heading>
                                    </Alert>
                                </Col>
                                <Col md={12} xs={4}>
                                    <ChildrenInputs occupationHandler={this.occupationHandler} gotraElement={this.gotraElement} children={this.state.children} />
                                    <a href="javascript:void(0)" className="btn btn-primary lightbtn" style={{ 'fontSize': '0.6rem', 'width': '150px' }} onClick={this.addChildren}>Add Children</a>
                                </Col>
                            </Row>
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

export default Landingpage;