import React from "react"
import { Container, Row,Col,Form,Alert,Button,Badge,} from 'react-bootstrap';

const ChildrenInputs = (props) => {
    var gotraElement = props.gotraElement;
    var occupationHandler = props.occupationHandler;
    return (
        props.children.map((val, idx)=> {
            let childrennameId = 'childrennameId-${idx}',childrenaadharnoId = 'childrenaadharno-${idx}',childrendobId = 'childrendob-${idx}',childrenGenderId='childrengender-${idx}',childrenmobilenoId = 'childrenmobileno-${idx}',childrenemailId = 'childrenemail-${idx}',childrenoccupationId = 'childrenoccupation-${idx}',childrenbusinessId = 'childrenbusiness-${idx}',childrengotraId = 'childrengotra-${idx}'
                return (    
                    <div className="childrenContainer containerBlock" key={idx}>
                        <Row className="d-flex">
                           <Col md={12} className="d-flex">
                            <a href="javascript:void" className="ml-auto removeContainer"><i className="fa fa-trash"></i></a>
                           </Col>
                        </Row>
                         <Row>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="Fformtitle">
                                        <Form.Label>Title</Form.Label>
                                            <Form.Control as="select" name="ctitle[]" defaultValue="mr">
                                                <option value="mr">Mr</option>
                                                <option value="mrs">Mrs</option>
                                                <option value="miss">Miss</option>
                                                <option value="late">Late</option>
                                            </Form.Control>
                                    </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="FformName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" name="cname[]" placeholder="Name" />
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="M">
                                    <Form.Label>Surname</Form.Label>
                                    <Form.Control type="text" name="csurname[]" placeholder="Surname" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                          
                            <Col md={4} xs={12}>
                                <Form.Group controlId={childrendobId}>
                                    <Form.Label>Dob</Form.Label>
                                    <Form.Control type="text" name="cdob[]" className="dob" placeholder="Dob" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={childrenmobilenoId}>
                                    <Form.Label>Mobile No.</Form.Label>
                                    <Form.Control type="text" name="cmobile_no[]" placeholder="Mobile No." />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={childrenemailId}>
                                    <Form.Label>Email Id</Form.Label>
                                    <Form.Control type="text" name="cemail[]" placeholder="email@example.com" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={childrenGenderId}>
                                    <Form.Label>Your Gender</Form.Label>
                                        <Form.Control as="select" name="cgender[]" required>
                                            <option>Select Gender*</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                    <Form.Group controlId={childrenoccupationId}>
                                    <Form.Label>Your Occupation</Form.Label>
                                            <Form.Control as="select"  onChange={occupationHandler} name="cyour_occupation[]">
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
                                    <Form.Control type="text" name="cyour_occupation_other[]" className="occupationOther"/>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={childrenbusinessId}>
                                    <Form.Label>Business Name</Form.Label>
                                    <Form.Control type="text" name="cbusiness_name[]" placeholder="Business Name" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>

                        </Row> 
                      </div>
                )
        })
    )
}
export default ChildrenInputs