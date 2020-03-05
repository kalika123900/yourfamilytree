import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Alert, Button, Badge } from 'react-bootstrap';
import { render } from 'react-dom';
import { makeSecureEncrypt } from '../helper/security';

import Adslider from "./Adslider";


class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.username = this.props.username;
    if (this.props.isLogin == true) {
      this.props.history.push('/dashboard');
      return false;
    }

  }
  state = {
    email: '',
    password: '',
    remember: false
  }
  handleChange = (e) => {
    var _that = this;
    if (_that.state.hasOwnProperty(e.currentTarget.name) && e.currentTarget.type != 'checkbox') {
      let _propName = e.currentTarget.name;
      let _propValue = e.currentTarget.value;
      _that.setState({ [_propName]: _propValue });
    }
    else if (e.currentTarget.type == 'checkbox') {
      let _propName = e.currentTarget.name;
      let _propValue = e.currentTarget.checked;
      _that.setState({ [_propName]: _propValue });
    }
  }
  handleLogin = (e) => {

    e.preventDefault();
    var _that = this;
    if (_that.state.email == '') {
      $('.email').css('border', 'red');
      alert('*Email is required');
      $('.email').focus();
    }
    if (_that.state.password == '') {
      $('.password').css('border', 'red');
      alert('*Password is required');
      $('.password').focus();
    }
    $.ajax({ method: "POST", url: "/actions/", data: { action: 'loginUser', email: _that.state.email, password: _that.state.password } }).done(function (response) {
      response = JSON.parse(response);
      if (response.status == 1) {
        let person = { uuid: response.data.uuid, name: response.data.full_name, login: 1 };
        localStorage.setItem('__person', makeSecureEncrypt(person));
        let ref_url = localStorage.getItem('ref_url');
        if (ref_url == null) {
          window.location.href = '/dashboard';
        }
        else {
          localStorage.removeItem('ref_url');
          window.location.href = ref_url;
        }
      }
      else {
        alert(response.message);
      }
    })
  }

  render() {
    return (
      <div class="container">
        <div className="loginform">
          <form onSubmit={(e) => this.handleLogin(e)}>
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <label className="inputlabel">Email:</label><input name="email" class="email" value={this.state.email} type="email" onChange={this.handleChange} className="form-control" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group">
                  <label className="inputlabel2">Password:</label><input name="password" class="password" value={this.state.password} onChange={this.handleChange} type="password" className="form-control" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="checkbox" className="incheck">
                  <label><input onChange={this.handleChange} checked={this.state.remember} value="1" name="remember" type="checkbox" /> Remember me</label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-default">Submit</button>
            <button type="submit" className="btn btn-default">Reset</button>
          </form>
        </div>
        <Adslider />
      </div>

    )

  }
}

export default LoginPage;