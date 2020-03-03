import React from 'react'
import { Container, Row,Col,Form,Alert,Button,Badge,} from 'react-bootstrap';

const SisterInputs = (props) => {
    var gotraElement = props.gotraElement;
    var occupationHandler = props.occupationHandler;
    return (
        props.sister.map((val, idx)=> {
            let sisternameId = 'sisternameId-${idx}',sisteraadharnoId = 'sisteraadharno-${idx}',sisterdobId = 'sisterdob-${idx}',sistermaritalstatusId = 'sistermaritalstatus-${idx}',sistermobilenoId = 'sistermobileno-${idx}',sisteremailId = 'sisteremail-${idx}',sisteroccupationId = 'sisteroccupation-${idx}',sisterbusinessId = 'sisterbusiness-${idx}',sistergotraId = 'sistergotra-${idx}'
                return (    
                    <div className="sisterContainer containerBlock" key={idx}>
                        <Row className="d-flex">
                           <Col md={12} className="d-flex">
                            <a href="javascript:void" className="ml-auto removeContainer"><i className="fa fa-trash"></i></a>
                           </Col>
                        </Row>
                        <Row>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="Fformtitle">
                                        <Form.Label>Title</Form.Label>
                                            <Form.Control as="select" name="stitle[]"  defaultValue="ms">
                                                <option value="ms">Ms</option>
                                                <option value="mrs">Mrs</option>
                                                <option value="late">Late</option>
                                            </Form.Control>
                                    </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="FformName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" name="sname[]" placeholder="Name" />
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="M">
                                    <Form.Label>Surname</Form.Label>
                                    <Form.Control type="text" name="ssurname[]" placeholder="Surname" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                         
                            <Col md={4} xs={12}>
                                <Form.Group controlId={sisterdobId}>
                                    <Form.Label>Dob</Form.Label>
                                    <Form.Control type="text" className="dob" name="sdob[]" placeholder="Dob" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={sistermaritalstatusId}>
                                    <Form.Label>Marital Status</Form.Label>
                                            <Form.Control as="select" className="marital_status[]" name="smarital_status">
                                                <option>Married</option>
                                                <option>Single</option>
                                            </Form.Control>
                                    </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="Dateofmarriage">
                                    <Form.Label>Date of marriage</Form.Label>
                                    <Form.Control type="text" name="sdate_of_marriage[]" className="dob marriage_date" placeholder="Date of marriage" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={sistermobilenoId}>
                                    <Form.Label>Mobile No.</Form.Label>
                                    <Form.Control type="text" name="smobile_no[]" placeholder="Mobile No." />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={sisteremailId}>
                                    <Form.Label>Email Id</Form.Label>
                                    <Form.Control type="text" name="semail[]" placeholder="email@example.com" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                    <Form.Group controlId={sisteroccupationId}>
                                    <Form.Label>Your Occupation</Form.Label>
                                            <Form.Control as="select"  onChange={occupationHandler} name="syour_occupation[]">
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
                                    <Form.Control type="text" name="syour_occupation_other[]" className="occupationOther"/>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={sisterbusinessId}>
                                    <Form.Label>Business Name</Form.Label>
                                    <Form.Control type="text" name="sbusiness_name[]" placeholder="Business Name" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                 {gotraElement('sgotra[]')}  
                            </Col>
                            
                        </Row> 
                       
                       
                       
                        
                        
                        
                        
                       
                        
                     
                    </div>
                )
        })
    )
}
export default SisterInputs