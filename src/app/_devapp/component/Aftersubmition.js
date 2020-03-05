import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Header from './Header';
import { Container, Row, Col, Form, Alert, Button, Badge, } from 'react-bootstrap';
import Layout from 'react-bootstrap';

class Aftersubmition extends Component {
    constructor(props) {
        super(props);
        this.username = this.props.username;
    }
    state = {
        detailsStyle: {
            display: 'none'
        }

    }
    componentDidMount() {

    }
    componentDidUpdate() {

    }
    heardFromHandle = (e) => {
        e.preventDefault();
        let p = $('select[name="heard_from"]').val();
        if (p == 'others') {
            var detailsStyle = Object.assign({}, this.state.detailsStyle);
            detailsStyle.display = 'block';
            this.setState({ detailsStyle });
            $('input[name="details"]').attr('required', true);
        }
        else {
            var detailsStyle = Object.assign({}, this.state.detailsStyle);
            detailsStyle.display = 'none';
            this.setState({ detailsStyle });
            $('input[name="details"]').removeAttr('required');
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()

        $.ajax({ type: 'POST', url: STATIC_URL + '/suggestion/', data: $('form').serialize() }).success(function (data) {
            var $response = JSON.parse(data);
            if ($response.status == 'success') {
                $('form').hide();
                $('.message').html('Thanks for your feedback');
            }
        })
            .error(function () {
                alert('Could not submit the form');
            })

    }
    render() {
        return (
            <Container>
                <Row>
                    <Col className="pt-2" md={12} xs={12}>
                        <Alert variant="success">
                            <Alert.Heading className="thanks">Thanks for Submitting your family information</Alert.Heading>
                            <p className="message">
                                <Link target="_blank" to="/loginpage">Login</Link> to see your family tree, your login details has been sent to your email address successfully!
                                Please let us know what more we can do and what more data we can gather.
                    </p>
                        </Alert>
                    </Col>
                </Row>

                <Row>
                    <Col md={12} xs={12}>
                        <Form onSubmit={this.handleSubmit} className="p-2">
                            <Form.Group controlId="formYourName">
                                <Form.Label>Suggestion*</Form.Label>
                                <Form.Control as="textarea" name="suggestion" placeholder="Suggestion" required />
                                <Form.Text className="text-muted"></Form.Text>
                            </Form.Group>

                            <Form.Group onChange={this.heardFromHandle} controlId="heardfrom">
                                <Form.Label>You heard about it from*</Form.Label>
                                <Form.Control as="select" name="heard_from" className="heard_from" required>
                                    <option value="whatsapp">Whatsapp</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="family">Family</option>
                                    <option value="others">Others</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="otherDetails" style={this.state.detailsStyle}>
                                <Form.Label>Details</Form.Label>
                                <Form.Control type="text" name="details" />
                                <Form.Text className="text-muted"></Form.Text>
                            </Form.Group>
                            <Form.Control type="hidden" name="uuid" value={this.props.uuid} />
                            <Row>
                                <Col md={12} xs={12}>
                                    <Form.Control type="submit" className="btn btn-success btn-block" placeholder="Submit" />
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>


        )
    }
}
export default Aftersubmition;
