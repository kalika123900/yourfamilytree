
import React from "react"
import { Container, Row,Col,Form,Alert,Button,Badge,} from 'react-bootstrap';

const SpouseInputs = (props) => {
    var gotraElement = props.gotraElement;
    var occupationHandler = props.occupationHandler;
    return (
        props.spouse.map((val, idx)=> {
            let spousenameId = 'spousenameId-${idx}',spouseaadharnoId = 'spouseaadharno-${idx}',spousedobId = 'spousedob-${idx}',spousemobilenoId = 'spousemobileno-${idx}',spouseemailId = 'spouseemail-${idx}',spouseoccupationId = 'spouseoccupation-${idx}',spousebusinessId = 'spousebusiness-${idx}',spousegotraId = 'spousegotra-${idx}'
                return (    
                    <div className='spouseContainer containerBlock' key={idx}>
                        <Row className="d-flex">
                           <Col md={12} className="d-flex">
                            <a href="javascript:void" className="ml-auto removeContainer"><i className="fa fa-trash"></i></a>
                           </Col>
                        </Row>
                        <Row>    
                            <Col md={4} xs={12}>
                                <Form.Group controlId="Fformtitle">
                                        <Form.Label>Title</Form.Label>
                                            <Form.Control as="select" className="sstitle" name="sstitle[]" defaultValue="ms">
                                                <option value="mr">Mr</option>
                                                <option value="mrs">Mrs</option>
                                                <option value="late">Late</option>
                                            </Form.Control>
                                    </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="FformName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" className="ssname" name="ssname[]" placeholder="Name" />
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="M">
                                    <Form.Label>Surname</Form.Label>
                                    <Form.Control type="text" name="sssurname[]" className="sssurname" placeholder="Surname" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={spousedobId}>
                                    <Form.Label>Dob</Form.Label>
                                    <Form.Control type="text" name="ssdob[]" className="dob ssdob" placeholder="Dob" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={spousedobId}>
                                    <Form.Label>Father Name</Form.Label>
                                    <Form.Control type="text" name="ssfname[]" className="ssfname" placeholder="Father name" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={spousedobId}>
                                    <Form.Label>Father Last Name</Form.Label>
                                    <Form.Control type="text" name="ssfsurname[]" className="ssfsurname" placeholder="Father last name" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={spousedobId}>
                                    <Form.Label>Mother Name</Form.Label>
                                    <Form.Control type="text" name="ssmname[]" className="ssmname" placeholder="Mother name" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={spousedobId}>
                                    <Form.Label>Mother Last Name</Form.Label>
                                    <Form.Control type="text" name="ssmsurname[]" className="ssmsurname" placeholder="Mother last name" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            
                            <Col md={4} xs={12}>
                                <Form.Group controlId={spousemobilenoId}>
                                    <Form.Label>Mobile No.</Form.Label>
                                    <Form.Control type="text" name="ssmobile_no[]" placeholder="Mobile No." />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={spouseemailId}>
                                    <Form.Label>Email Id</Form.Label>
                                    <Form.Control type="text" name="ssemail[]" placeholder="email@example.com" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                    <Form.Group controlId={spouseoccupationId}>
                                    <Form.Label>Your Occupation</Form.Label>
                                            <Form.Control as="select"  onChange={occupationHandler} name="ssyour_occupation[]">
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
                                    <Form.Control type="text" name="ssyour_occupation_other[]" className="occupationOther"/>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={spousebusinessId}>
                                    <Form.Label>Business Name</Form.Label>
                                    <Form.Control type="text" name="ssbusiness_name[]" placeholder="Business Name" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                {gotraElement('ssgotra[]')}
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group class="gotraOther" style={{'display':'none'}} controlId="gotraOther">
                                    <Form.Label>Gotra Other</Form.Label>
                                    <Form.Control type="text" name="ssgotra_other[]" placeholder="Gotra Other" />
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
export default SpouseInputs