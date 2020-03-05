import React from "react"
import { Container, Row,Col,Form,Alert,Button,Badge,} from 'react-bootstrap';

const BrotherInputs = (props) => {
    var gotraElement = props.gotraElement;
    var occupationHandler = props.occupationHandler;
    return (
        props.brother.map((val, idx)=> {
            let brothernameId = 'brothernameId-${idx}',brotheraadharnoId = 'brotheraadharno-${idx}',brotherdobId = 'brotherdob-${idx}',brothermaritalstatusId = 'brothermaritalstatus-${idx}',brothermobilenoId = 'brothermobileno-${idx}',brotheremailId = 'brotheremail-${idx}',brotheroccupationId = 'brotheroccupation-${idx}',brotherbusinessId = 'brotherbusiness-${idx}',brothergotraId = 'brothergotra-${idx}'
                return (    
                    <div className="brotherContainer containerBlock" key={idx}>
                       <Row className="d-flex">
                           <Col md={12} className="d-flex">
                            <a href="javascript:void" className="ml-auto removeContainer"><i className="fa fa-trash"></i></a>
                           </Col>
                       </Row>
                       <Row>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="Fformtitle">
                                        <Form.Label>Title</Form.Label>
                                            <Form.Control as="select" name="btitle[]" defaultValue="mr">
                                                <option value="mr">Mr</option>
                                                <option value="late">Late</option>
                                            </Form.Control>
                                    </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="FformName">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control type="text" name="bname[]" placeholder="Name" />
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="M">
                                    <Form.Label>Surname</Form.Label>
                                    <Form.Control type="text" name="bsurname[]" placeholder="Surname" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={brotherdobId}>
                                    <Form.Label>Dob</Form.Label>
                                    <Form.Control type="text" name="bdob[]"  className="dob" placeholder="Dob" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={brothermaritalstatusId}>
                                    <Form.Label>Marital Status</Form.Label>
                                        <Form.Control as="select" className="marital_status" name="bmarital_status[]">
                                            <option>Married</option>
                                            <option>Single</option>
                                        </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId="Dateofmarriage">
                                    <Form.Label>Date of marriage</Form.Label>
                                    <Form.Control type="text" name="bdate_of_marriage[]" className="marriage_date dob" placeholder="Date of marriage" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={brothermobilenoId}>
                                    <Form.Label>Mobile No.</Form.Label>
                                    <Form.Control type="text" name="bmobile_no[]" placeholder="Mobile No." />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={brotheremailId}>
                                    <Form.Label>Email Id</Form.Label>
                                    <Form.Control type="text" name="bemail[]" placeholder="email@example.com" />
                                    <Form.Text className="text-muted">
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                    <Form.Group controlId={brotheroccupationId}>
                                    <Form.Label>Your Occupation</Form.Label>
                                            <Form.Control as="select"  onChange={occupationHandler} name="byour_occupation[]">
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
                                    <Form.Control type="text" name="byour_occupation_other[]" className="occupationOther"/>
                                </Form.Group>
                            </Col>
                            <Col md={4} xs={12}>
                                <Form.Group controlId={brotherbusinessId}>
                                    <Form.Label>Business Name</Form.Label>
                                    <Form.Control type="text" name="bbusiness_name[]" placeholder="Business Name" />
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
export default BrotherInputs