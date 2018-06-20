import React, { Component } from 'react';
import { Button, Col, Card, CardBody, CardGroup, CardFooter, CardFooterCol, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert, FormGroup } from 'reactstrap';

/* eslint camelcase: 0, no-underscore-dangle: 0 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import * as actionCreators from '../../../actions/auth';
import { validateEmail } from '../../../utils/misc';

function mapStateToProps(state) {
  return {
    isRegistering: state.auth.isRegistering,
    registerStatusText: state.auth.registerStatusText,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

class Register extends Component {

  constructor(props) {
    super(props);
    const redirectRoute = '/login';
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      email_error_text: null,
      password_error_text: null,
      confirmPasswordErrorText: null,
      redirectTo: redirectRoute,
      disabled: true,
    };
  }

  isDisabled() {
    let email_is_valid = false;
    let password_is_valid = false;
    let confirm_is_valid = false;

    if (this.state.email === '') {
      this.setState({
        email_error_text: null,
      });
    } else if (validateEmail(this.state.email)) {
      email_is_valid = true;
      this.setState({
        email_error_text: null,
      });

    } else {
      this.setState({
        email_error_text: 'Sorry, this is not a valid email',
      });
    }

    if (this.state.password === '' || !this.state.password) {
      this.setState({
        password_error_text: null,
      });
    } else if (this.state.password.length >= 6) {
      password_is_valid = true;
      this.setState({
        password_error_text: null,
      });
    } else {
      this.setState({
        password_error_text: 'Your password must be at least 6 characters',
      });

    }

    if (this.state.confirmPassword === '' || !this.state.confirmPassword) {
      this.setState({
        confirmPasswordErrorText: null,
      });
    } else if (this.state.confirmPassword == this.state.password) {
      confirm_is_valid = true;
      this.setState({
        confirmPasswordErrorText: null,
      });
    } else {
      this.setState({
        confirmPasswordErrorText: 'Your password does not match',
      });

    }

    if (email_is_valid && password_is_valid, confirm_is_valid) {
      this.setState({
        disabled: false,
      });
    }

  }

  changeValue(e, type) {
    const value = e.target.value;
    const next_state = {};
    next_state[type] = value;
    this.setState(next_state, () => {
      this.isDisabled();
    });
  }

  _handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (!this.state.disabled) {
        this.login(e);
      }
    }
  }

  login(e) {
    e.preventDefault();
    this.props.registerUser(this.state.email, this.state.password, this.state.redirectTo);
  }

  render() {
    return (
      <div className="app flex-row align-items-center" onKeyPress={(e) => this._handleKeyPress(e)}>
        <Container>
          <Row className="justify-content-center">
            {
              this.props.registerStatusText &&
              <Alert color="warning">
                {this.props.registerStatusText}
              </Alert>
            }
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-prepend">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        label="Email"
                        placeHolder="Email"
                        type="email"
                        invalid={!!this.state.email_error_text}
                        onChange={(e) => this.changeValue(e, 'email')}
                      />
                    </InputGroup>
                    <span className="help-block invalid-feedback d-block">
                      {this.state.email_error_text}</span>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-prepend">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        label="Password"
                        placeHolder="Password"
                        type="password"
                        invalid={!!this.state.password_error_text}
                        onChange={(e) => this.changeValue(e, 'password')}
                      />
                    </InputGroup>
                    <span className="help-block invalid-feedback d-block">{this.state.password_error_text}</span>
                  </FormGroup>
                  <FormGroup className="mb-3">
                    <InputGroup className="input-prepend">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" placeholder="Repeat password"
                        label="Email"
                        placeHolder="Repeat password"
                        type="password"
                        invalid={!!this.state.confirmPasswordErrorText}
                        onChange={(e) => this.changeValue(e, 'confirmPassword')}
                      />
                    </InputGroup>
                    <span className="help-block invalid-feedback d-block">{this.state.confirmPasswordErrorText}</span>
                  </FormGroup>
                  <Button onClick={(e) => this.login(e)}
                    disabled={this.state.disabled} color="success" block>Create Account</Button>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button className="btn-facebook" block><span>facebook</span></Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Button className="btn-twitter" block><span>twitter</span></Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func,
  registerStatusText: PropTypes.string,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Register))