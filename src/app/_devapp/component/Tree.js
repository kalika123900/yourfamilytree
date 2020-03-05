import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Alert, Button, Badge } from 'react-bootstrap';
import Adslider from "./Adslider";

class Tree extends Component {
    constructor(props) {
        super(props);
        this.state = { treeData: '', uuid: this.props.match.params.uuid, dob: '', gender: '', address: '', marital_status: '' };
        if (this.props.isLogin == true) {
            //go ahead
        }
        else {
            localStorage.setItem('ref_url', this.props.history.location.pathname);
            this.props.history.push('/loginpage');
        }
    }

    componentDidMount() {
        var _that = this;
        var responseArray = [];
        var _uuid = this.state.uuid;
        $.ajax({ url: STATIC_URL + '/actions/', method: 'POST', data: { action: 'familyTreeEx', uuid: _uuid } }).done(function (response) {
            response = JSON.parse(response);
            responseArray = [response];
            _that.setState({ treeData: responseArray });
        });

    }
    componentDidUpdate() {

    }
    componentWillReceiveProps(newProps) {
        var _that = this;

        if (newProps.match.params.uuid == this.props.match.params.uuid) {
            return;
        }

        _that.setState({ uuid: newProps.match.params.uuid });
        var responseArray = [];
        $.ajax({ url: STATIC_URL + '/actions/', method: 'POST', data: { action: 'familyTreeEx', uuid: newProps.match.params.uuid } }).done(function (response) {
            response = JSON.parse(response);
            responseArray = [response];
            _that.setState({ treeData: responseArray });
        });
    }
    changePerson = (p) => {
        this.props.history.push('/person/' + p);
    }
    renderParent = (n) => {

        return <div className="hv-item-parent">
            <p> {n.name} </p>
        </div>;
    }
    showInfo = (n) => {
        let uuid = n.uuid;
        let name = n.name;
        let $infoBox = $(this.refs.infobox);
        $infoBox.css('display', 'block');
        $infoBox.find('.box-content').html('');
        $infoBox.find('.box-content').append('<h3>' + name + '</h3>');
        $.ajax({ url: STATIC_URL + '/actions/', method: 'POST', data: { action: 'individualInfo', uuid: uuid } }).done(function (response) {
            response = JSON.parse(response);
            if (response.status == 1) {
                let $data = response.data;
                if ($data.hasOwnProperty('age')) {
                    $infoBox.find('.box-content').append('<h5>Age - ' + $data.age + ' Year</h3>');
                }
                if ($data.hasOwnProperty('marital_status')) {
                    $infoBox.find('.box-content').append('<h5> Marital Status  - ' + $data.marital_status + '</h3>');
                }
                if ($data.hasOwnProperty('gotra')) {
                    $infoBox.find('.box-content').append('<h5> Gotra - ' + $data.gotra + '</h3>');
                }
                if ($data.hasOwnProperty('category')) {
                    $infoBox.find('.box-content').append('<h5> Profession - ' + $data.category + '</h3>');
                }
                if ($data.hasOwnProperty('occupation')) {
                    $infoBox.find('.box-content').append('<h5> Occupation - ' + $data.occupation + '</h3>');
                }
                if ($data.hasOwnProperty('name_of_business')) {
                    $infoBox.find('.box-content').append('<h5> Name Of Business/Company - ' + $data.name_of_business + '</h3>');
                }


            }
            else {
                $infoBox.find('.box-content').append('No Information found!');
            }
        });
    }
    closeShowInfo = () => {
        $(this.refs.infobox).css('display', 'none');
    }
    renderNode = (n, level, key) => {
        if (n.hasOwnProperty('children') && n.children.length > 0) {
            var p = n.children.map((value, index) => {
                let nextLevel = level + 1;
                return this.renderNode(value, nextLevel);
            })
            if (level == 0) {
                return <div key={key} className="hv-item">
                    <div className="hv-item-parent top-node">
                        <p>{n.name.toUpperCase()} <a href="javascript:void(0)" onClick={() => this.showInfo(n)}><i className="fa fa-info"></i></a> </p>
                    </div>
                    <div className="hv-item-children">
                        {p}
                    </div>
                </div>

            }
            else {
                return <div key={key} className="hv-item-child">
                    <div className="hv-item-parent">
                        <p onClick={() => this.changePerson(n.uuid)}>{n.name.toUpperCase()}<small>{n.relation.toUpperCase()}</small></p>
                    </div>
                    <div className="hv-item-children">
                        {p}
                    </div>
                </div>

            }
        }
        else {
            if (level == 0) {
                return <div key={key} className="hv-item">
                    <div className="hv-item">
                        <p>{n.name.toUpperCase()} <a href="javascript:void(0)" onClick={() => this.showInfo(n)}><i className="fa fa-info"></i></a></p>
                    </div>
                </div>

            }
            else {
                return <div key={key} className="hv-item-child">
                    <p onClick={() => this.changePerson(n.uuid)}>{n.name.toUpperCase()}<small>{n.relation.toUpperCase()}</small></p>
                </div>
            }

        }
    }

    render() {
        const { treeData } = this.state;
        if (treeData == "") {
            return '';
        }
        return <Container className="capture">
            <Row>
                <Col className="pt-2" md={12} xs={12}>
                    <Alert variant="success">
                        <Alert.Heading>Family Tree</Alert.Heading>
                        <p style={{ 'marginBottom': '0px' }}>
                            Click Any Person name to See his Family Tree.
                        </p>
                    </Alert>
                </Col>
            </Row>
            <div className="hv-wrapper">
                {
                    treeData.map((value, key) => {
                        let level = 0;
                        return this.renderNode(value, level, key);
                    })
                }
            </div>
            <div className="bg-overlay" ref="infobox">
                <div className="box" >
                    <div onClick={() => this.closeShowInfo()} className="close-button">x</div>
                    <div className="box-content">

                    </div>
                </div>
            </div>
            <Adslider />
        </Container>
    }

}
export default Tree;