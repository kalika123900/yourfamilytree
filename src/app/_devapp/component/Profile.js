import React,  { Component, useState, useEffect } from 'react'
import { BrowserRouter  as Router, Route, Link } from 'react-router-dom';
import './css/search.css';
import {Container, Row,Col,Form,Alert,Button,Badge} from 'react-bootstrap';
import Layout from 'react-bootstrap';
import Notifications, {notify} from 'react-notify-toast';

class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            community: null,
            gotraList: [],
            selectedCommunity: '',
            self: {uuid:'',title:'',name:'',surname:'',dob:'',gender:'',marital_status:'',date_of_marriage:'',occupation:'',name_of_business:'',category:'',since:'',sector_major:'',specific_business:'',brand_name:'',email:'',mobile_no:'',landline_no:'',website:'',address:'',state:'',city:'',qualification:'',sector_major_other:''},
            father: {uuid:'',title:'',name:'',surname:'',dob:'',occupation:'',name_of_business:'',email:'',mobile_no:''},
            mother: {uuid:'',title:'',name:'',surname:'',dob:'',occupation:'',name_of_business:'',email:'',mobile_no:''},   
        }
    }
    componentDidMount(){
        var _that = this;
        $.ajax({ method: "POST",url:"/actions/",data:{action:'getCommunity'}}).done(function(response){
            var _response = JSON.parse(response);
            if(_response.status=='success'){
                _that.setState({community:_response.data.community});
                _that.setState({gotraList:_response.data.gotra});
                _that.setState({selectedCommunity:_response.data.community[0].uuid});
                $.ajax({method: "POST",url:"/actions/",data:{action:'individualEditable',uuid:_that.props.uuid}}).done(function(responser){
                     var _responser = JSON.parse(responser);
                     if(_responser.status=='1')
                     {   
                          //Handle Surname variable **patch
                          let surname = _responser.data.self['last_name'];
                          delete _responser.data.self['last_name'];
                          _responser.data.self['surname'] = surname;
                          _that.setState({self:_responser.data.self});
                         
                          //Handle Surname variable **patch
                          if(_responser.data.father!=false)
                          {
                            surname = _responser.data.father['last_name'];
                            delete _responser.data.father['last_name'];
                            _responser.data.father['surname'] = surname;
                            _that.setState({father:_responser.data.father});
                          }
                         
                          //Handle Surname variable **patch
                          if(_responser.data.mother!=false)
                          {
                            surname = _responser.data.mother['last_name'];
                            delete _responser.data.mother['last_name'];
                            _responser.data.mother['surname'] = surname;
                            _that.setState({mother:_responser.data.mother}); 
                          }
                     }
                });
               
            }
            else
            {
                console.log('-------System Failure---------');
            }
        });
    }
    handleChangeSelf = (e) => {
        let name = e.target.name;
        let {self} = this.state;
        self[name] = e.target.value;
        this.setState({self:self});
    }
    handleChangeFather = (e) => {
        let name = e.target.name;
        let {father} = this.state;
        father[name] = e.target.value;
        this.setState({father:father});
    }
    handleChangeMother = (e) => {
        let name = e.target.name;
        let {mother} = this.state;
        self[mother] = e.target.value;
        this.setState({mother:mother});
    }
    gotraElement = (_ename) => { var _that = this;
        if(typeof this.state.gotraList=='object' && this.state.gotraList.hasOwnProperty(this.state.selectedCommunity) && this.state.gotraList[this.state.selectedCommunity].length>0){
         return <Form.Group className="Gotra" controlId="Gotra">
                 <Form.Label>Gotra</Form.Label>
                 <Form.Control as="select" name={_ename} onChange={this.gotraHandler} placeholder="Gotra" >
                   <option>Select Gotra</option>
                   {this.state.gotraList[this.state.selectedCommunity].map(function(value,index){
                       return <option key={index} value={value.name}>{value.name}</option>
                   })}
                 </Form.Control>
             </Form.Group>
         }
        else
        {
         return <Form.Group controlId="Gotra">
         <Form.Label>Gotra</Form.Label>
         <Form.Control type="text" name={_ename} placeholder="Gotra" />
         <Form.Text className="text-muted">
         </Form.Text>
     </Form.Group>
     }
    }
    handleSubmit = (e) => { e.preventDefault()
        var that = this;
        var _data = {};
        _data['action'] = 'updateUserInfo';
        for ( var key in that.state.self ) {
            _data[key] = that.state.self[key];
        }
        for ( var key in that.state.father ) {
            _data['f'+key] = that.state.father[key];
        }
        for ( var key in that.state.mother ) {
            _data['m'+key] = that.state.mother[key];
        }
        
        $.ajax({method:'POST',url: STATIC_URL+'/actions/',data:_data}).success(function(response){
             var $response = JSON.parse(response);
             if($response.status=='success'){
                notify.show("Your Info Updated Successfully!", "success", 5000);
            }
        })
        .error(function(){
            alert('Could not submit the form');
        })
     
     
     }
   
    render(){
        const {community} = this.state;
        if(community==null){
            return <img src="/palm-tree.gif" style={{width:'100%'}}/>;
        }
        return    <Container className="capture">
            <Row>
            <Col className="pt-2" md={12} xs={12}>
            <Alert variant="success">
              <Alert.Heading>Edit Profile</Alert.Heading>
              <p style={{'marginBottom':'0px'}}>
               If You Entered some wrong informations, You can update data from Here.<br/>
              <strong>*Please Note if you will change first name, last name, title or Date of Birth, it might affect the family tree which shows to people, Please be careful.</strong>
              </p>
              </Alert>
              </Col>
              </Row>
                  
              <Row>
              <h3 className="col-md-12"><Button variant="primary">
                  Your <Badge variant="light">Details</Badge>
                </Button></h3>
              <Col md={12} xs={12}>
                <Form onSubmit={this.handleSubmit}>
                <div className="containerBlock">
                <Row>
                  <Col md={6} xs={12}>
                      <Form.Group controlId="formYourName">
                              <Form.Label>Community*</Form.Label>
                              <Form.Control value={this.state.self.community} name="community" onChange={(e)=>this.handleChangeSelf(e)} as="select" required>
                                 {this.state.community.map((value,index)=>{
                                    return <option key={index} value={value.uuid}>{value.name}</option>
                                 })}
                                </Form.Control>
                              <Form.Text className="text-muted"></Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={6} xs={12}>
                      <Form.Group className="communityOther" style={{'display':'none'}} controlId="commother">
                              <Form.Label>Other Community*</Form.Label>
                              <Form.Control name="otherc" type="text" placeholder="Community Name"  />
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group  controlId="formyoutitle">
                          <Form.Label>Title*</Form.Label>
                              <Form.Control value={this.state.self.title} onChange={(e)=>this.handleChangeSelf(e)} name="title" as="select" defaultValue="mr" required>
                                  <option value="mr">Mr</option>
                                  <option value="ms">Ms</option>
                                  <option value="mrs">Mrs</option>
                          </Form.Control>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="formYourName">
                              <Form.Label>Name*</Form.Label>
                              <Form.Control name="name"  type="text" value={this.state.self.name} placeholder="Name" onChange={(e)=>this.handleChangeSelf(e)} required />
                              <Form.Text className="text-muted">
                              </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="formYourName">
                              <Form.Label>Surname*</Form.Label>
                              <Form.Control name="surname" type="text" value={this.state.self.surname} placeholder="Surname" onChange={(e)=>this.handleChangeSelf(e)} required/>
                              <Form.Text className="text-muted"></Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="Dob">
                          <Form.Label>Dob*</Form.Label>
                          <Form.Control type="text" name="dob" value={this.state.self.dob} className="dob" placeholder="Dob" onChange={(e)=>this.handleChangeSelf(e)} required/>
                          <Form.Text className="text-muted">
                          </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="formYourOccupation">
                      <Form.Label>Your Gender*</Form.Label>
                              <Form.Control value={this.state.self.gender} onChange={(e)=>this.handleChangeSelf(e)} as="select" name="gender" required>
                                  <option value="">Select Gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                              </Form.Control>
                      </Form.Group>
                  </Col>
                  
                  <Col md={4} xs={12}>
                      <Form.Group onChange={this.marritalStatusChange} controlId="maritalstatus">
                          <Form.Label>Marital Status*</Form.Label>
                                  <Form.Control value={this.state.self.marital_status} as="select" value={this.state.self.marital_status} onChange={(e)=>this.handleChangeSelf(e)} name="marital_status" className="marital_status" required>
                                      <option value="">Select Marital Status</option>
                                      <option value="married">Married</option>
                                      <option value="single">Single</option>
                                  </Form.Control>
                          </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="Dateofmarriage">
                          <Form.Label>Date of marriage</Form.Label>
                          <Form.Control type="text" name="date_of_marriage" value={this.state.self.date_of_marriage} onChange={(e)=>this.handleChangeSelf(e)} className="marriage_date dob" placeholder="Date of marriage" />
                          <Form.Text className="text-muted">
                          </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="Occupation">
                      <Form.Label>Occupation</Form.Label>
                              <Form.Control as="select" value={this.state.self.occupation} onChange={this.occupationHandler}  name="your_occupation">
                                  <option value="business">Business</option>
                                  <option value="profession">Profession</option>
                                  <option value="job">Job</option>
                                  <option value="Other">Other</option>
                              </Form.Control>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12} style={{'display':'none'}}>
                      <Form.Group controlId="Occupation">
                          <Form.Label>Occupation Other</Form.Label>
                          <Form.Control type="text" name="your_occupation_other" value={this.state.self.occupation_other} onChange={(e)=>this.handleChangeSelf(e)} className="occupationOther"/>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                  <Form.Group controlId="Nameofbusiness">
                      <Form.Label>Business name</Form.Label>
                      <Form.Control type="text" name="name_of_business" value={this.state.self.name_of_business} onChange={(e)=>this.handleChangeSelf(e)} placeholder="Name of business" />
                      <Form.Text className="text-muted">
                      </Form.Text>
                  </Form.Group>
                  </Col>
                  <Col md={4} xs={12} >
                  <Form.Group controlId="Category" >
                    <Form.Label>Category</Form.Label>
                          <Form.Control as="select" value={this.state.self.category} onChange={this.categoryHandler} name="category">
                              <option value="Manufacturing">Manufacturing</option>
                              <option value="Trading">Trading</option>
                              <option value="Service">Service</option>
                              <option value="Other">Other</option>
                          </Form.Control>
                  </Form.Group>
                  </Col>
                  <Col md={4} xs={12} style={{'display':'none'}}>
                  <Form.Group controlId="CategoryOther">
                    <Form.Label>Category Other</Form.Label>
                    <Form.Control type="text" name="category_other" value={this.state.self.category_other} onChange={(e)=>this.handleChangeSelf(e)} className="categoryOther" />
                  </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="Since">
                          <Form.Label>Since</Form.Label>
                          <Form.Control type="text" name="since" onChange={(e)=>this.handleChangeSelf(e)} value={this.state.self.since} placeholder="since" />
                          <Form.Text className="text-muted">
                          </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="SectorMajor">
                          <Form.Label>Sector Major</Form.Label>
                              <Form.Control value={this.state.self.sector_major} as="select" className="sector_major" onChange={this.sectorMajorHandler} name="sector_major">
                                  <option value="Doctor">Doctor</option>
                                  <option value="CA">CA</option>
                                  <option value="Engineer">Engineer</option>
                                  <option value="CS">CS</option>
                                  <option value="Advocate">Advocate</option>
                                  <option value="other">Other</option>
                              </Form.Control>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12} style={{'display':'none'}}>
                      <Form.Group controlId="SectorMajor">
                          <Form.Label>Sector Major Detail</Form.Label>
                          <Form.Control type="text" className="sector_major_other" onChange={(e)=>this.handleChangeSelf(e)} value={this.state.self.sector_major_other}  name="specific_major_other"/>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="Specificbusiness">
                          <Form.Label>Specific business</Form.Label>
                          <Form.Control type="text" name="specific_business" onChange={(e)=>this.handleChangeSelf(e)} value={this.state.self.specific_business} placeholder="eg. Heart, Eye" />
                          <Form.Text className="text-muted">
                          </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="BrandName">
                          <Form.Label>Brand Name (if any)</Form.Label>
                          <Form.Control type="text" name="brand_name" onChange={(e)=>this.handleChangeSelf(e)} value={this.state.self.brand_name} placeholder="Brand name (if any)" />
                          <Form.Text className="text-muted">
                          </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="EmailId">
                          <Form.Label>Email Id</Form.Label>
                          <Form.Control type="text" name="email" onChange={(e)=>this.handleChangeSelf(e)} value={this.state.self.email} placeholder="email@example.com" />
                          <Form.Text className="text-muted">
                          </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="MobileNo">
                          <Form.Label>Mobile No.</Form.Label>
                          <Form.Control type="text" name="mobile_no" onChange={(e)=>this.handleChangeSelf(e)} value={this.state.self.mobile_no} placeholder="Mobile No." />
                          <Form.Text className="text-muted">
                          </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="LandlineNo">
                          <Form.Label>Landline No.</Form.Label>
                          <Form.Control type="text" name="landline_no" onChange={(e)=>this.handleChangeSelf(e)} value={this.state.self.landline_no} placeholder="Landline No." />
                          <Form.Text className="text-muted">
                          </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="Website">
                          <Form.Label>Website</Form.Label>
                          <Form.Control type="text" name="website" onChange={(e)=>this.handleChangeSelf(e)} value={this.state.self.website}  placeholder="Website" />
                          <Form.Text className="text-muted">
                          </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="Address">
                          <Form.Label>Address</Form.Label>
                          <Form.Control type="text"  name="address" onChange={(e)=>this.handleChangeSelf(e)} value={this.state.self.address} placeholder="Address" />
                          <Form.Text className="text-muted">
                          </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="State">
                          <Form.Label>State</Form.Label>
                          <Form.Control type="text" name="state" onChange={(e)=>this.handleChangeSelf(e)} value={this.state.self.state} placeholder="State" />
                          <Form.Text className="text-muted">
                          </Form.Text>
                      </Form.Group>
                     
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="City">
                              <Form.Label>City</Form.Label>
                              <Form.Control type="text"  name="city" onChange={(e)=>this.handleChangeSelf(e)} value={this.state.self.city} placeholder="Address" />
                              <Form.Text className="text-muted">
                              </Form.Text>
                      </Form.Group>
                  </Col>
                  <Col md={4} xs={12}>
                      <Form.Group controlId="Qualification">
                          <Form.Label>Qualification</Form.Label>
                              <Form.Control as="select" value={this.state.self.qualification} onChange={(e)=>this.handleChangeSelf(e)} name="qualification">
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
                                      <Form.Control  name="ftitle" value={this.state.father.title}  onChange={(e)=>this.handleChangeFather(e)} name="title" as="select" defaultValue="mr" required>
                                          <option value="mr">Mr</option>
                                          <option value="late">Late</option>
                                  </Form.Control>
                              </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                          <Form.Group controlId="FformName">
                                  <Form.Label>Name*</Form.Label>
                                  <Form.Control  name="fname" name="name" value={this.state.father.name} type="text" placeholder="Name" onChange={(e)=>this.handleChangeFather(e)} required/>
                                  <Form.Text className="text-muted">
                                  </Form.Text>
                          </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                          <Form.Group controlId="FfocrmName">
                              <Form.Label>Surname*</Form.Label>
                              <Form.Control type="text" value={this.state.father.surname} name="surname" placeholder="Surname" onChange={(e)=>this.handleChangeFather(e)} required/>
                              <Form.Text className="text-muted"></Form.Text>
                      </Form.Group>
                      </Col>
                     
                      <Col md={4} xs={12}>
                          <Form.Group controlId="Dob">
                              <Form.Label>Dob*</Form.Label>
                              <Form.Control type="text" name="dob" value={this.state.father.dob} onChange={(e)=>this.handleChangeFather(e)} className="dob" placeholder="Dob" required/>
                              <Form.Text className="text-muted">
                              </Form.Text>
                          </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                          <Form.Group controlId="MobileNo">
                              <Form.Label>Mobile No.</Form.Label>
                              <Form.Control type="text"  name="mobile_no" value={this.state.father.mobile_no} onChange={(e)=>this.handleChangeFather(e)} placeholder="Mobile No." />
                              <Form.Text className="text-muted">
                              </Form.Text>
                          </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                          <Form.Group controlId="EmailId">
                              <Form.Label>Email Id</Form.Label>
                              <Form.Control type="text" name="email" value={this.state.father.email} onChange={(e)=>this.handleChangeFather(e)} placeholder="email@example.com" />
                              <Form.Text className="text-muted">
                              </Form.Text>
                          </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                          <Form.Group controlId="formYourOccupation">
                          <Form.Label>Occupation</Form.Label>
                                  <Form.Control value={this.state.father.occupation} as="select"  onChange={this.occupationHandler} onChange={(e)=>this.handleChangeFather(e)} name="fyour_occupation"  >
                                      <option value="Business">Business</option>
                                      <option value="Profession">Profession</option>
                                      <option value="Job">Job</option>
                                      <option value="Other">Other</option>
                                  </Form.Control>
                          </Form.Group>
                      </Col>
                      <Col md={4} xs={12} style={{'display':'none'}}>
                          <Form.Group controlId="Occupation">
                              <Form.Label>Occupation Other</Form.Label>
                              <Form.Control type="text" name="occupation" onChange={(e)=>this.handleChangeFather(e)} value={this.state.father.occupation_other} className="occupationOther"/>
                          </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                          <Form.Group controlId="BusinessName">
                              <Form.Label>Business Name</Form.Label>
                              <Form.Control type="text" name="business_name" onChange={(e)=>this.handleChangeFather(e)} value={this.state.father.business_name} placeholder="Business Name" />
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
                                      <Form.Control value={this.state.mother.title} onChange={(e)=>this.handleChangeMother(e)} as="select" name="title" defaultValue="mrs" required>
                                          <option value="mrs">Mrs</option>
                                          <option value="late">Late</option>
                                      </Form.Control>
                              </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                          <Form.Group controlId="FformName">
                                  <Form.Label>Name*</Form.Label>
                                  <Form.Control type="text" name="name" placeholder="Name" value={this.state.mother.name} onChange={(e)=>this.handleChangeMother(e)} required/>
                                  <Form.Text className="text-muted">
                                  </Form.Text> 
                          </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                              <Form.Group controlId="M">
                                  <Form.Label>Surname*</Form.Label>
                                  <Form.Control type="text" name="surname" placeholder="Surname" value={this.state.mother.surname} onChange={(e)=>this.handleChangeMother(e)} required/>
                                  <Form.Text className="text-muted">
                                  </Form.Text>
                              </Form.Group>
                      </Col>
                  
                      <Col md={4} xs={12}>
                              <Form.Group controlId="Dob">
                                  <Form.Label>Dob*</Form.Label>
                                  <Form.Control type="text" name="dob" className="dob" value={this.state.mother.dob} placeholder="Dob" onChange={(e)=>this.handleChangeMother(e)} required/>
                                  <Form.Text className="text-muted">
                                  </Form.Text>
                              </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                              <Form.Group controlId="MobileNo">
                                  <Form.Label>Mobile No.</Form.Label>
                                  <Form.Control type="text" name="mobile_no" value={this.state.mother.mobile_no} onChange={(e)=>this.handleChangeMother(e)} placeholder="Mobile No." />
                                  <Form.Text className="text-muted">
                                  </Form.Text>
                              </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                              <Form.Group controlId="EmailId">
                                  <Form.Label>Email Id</Form.Label>
                                  <Form.Control type="text" name="email" value={this.state.mother.email} onChange={(e)=>this.handleChangeMother(e)} placeholder="email@example.com" />
                                  <Form.Text className="text-muted">
                                  </Form.Text>
                              </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                              <Form.Group controlId="formYourOccupation">
                              <Form.Label>Your Occupation</Form.Label>
                                      <Form.Control value={this.state.mother.occupation} as="select"  onChange={this.occupationHandler} name="myour_occupation">
                                          <option value="Business">Business</option>
                                          <option value="Profession">Profession</option>
                                          <option value="Job">Job</option>
                                          <option value="Other">Other</option>

                                      </Form.Control>
                              </Form.Group>
                      </Col>
                      <Col md={4} xs={12} style={{'display':'none'}}>
                          <Form.Group controlId="Occupation">
                              <Form.Label>Occupation Other</Form.Label>
                              <Form.Control type="text" name="myour_occupation_other" value={this.state.mother.occupation_other} onChange={(e)=>this.handleChangeMother(e)} className="occupationOther"/>
                          </Form.Group>
                      </Col>
                      <Col md={4} xs={12}>
                              <Form.Group controlId="BusinessName">
                                  <Form.Label>Business Name</Form.Label>
                                  <Form.Control type="text" name="business_name" value={this.state.mother.business_name} onChange={(e)=>this.handleChangeMother(e)} placeholder="Business Name" />
                                  <Form.Text className="text-muted">
                                  </Form.Text>
                              </Form.Group>
                      </Col>
                    </Row> 
                 
                  </div>
                  <Row>
                      <Col md={12} xs={12}>
                          <Form.Control type="hidden" name="uuid" value={this.state.self.uuid} onChange={(e)=>this.handleChangeSelf(e)} className="uuid"/>
                          <Form.Control type="submit" value="Submit" className="btn btn-success btn-block mt-1" placeholder="Submit" />
                      </Col>
                  </Row>
                  </Form>
              </Col>
            </Row>
        </Container>
  
    } 
}
export default Profile;