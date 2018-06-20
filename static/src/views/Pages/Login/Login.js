import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Alert, FormFeedback, FormGroup } from 'reactstrap';

/* eslint camelcase: 0, no-underscore-dangle: 0 */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import * as actionCreators from '../../../actions/auth';
import { validateEmail } from '../../../utils/misc';

function mapStateToProps(state) {
    return {
        isAuthenticating: state.auth.isAuthenticating,
        statusText: state.auth.statusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

class Login extends Component {

    constructor(props) {
        super(props);
        const redirectRoute = '/login';
        this.state = {
            email: '',
            password: '',
            email_error_text: null,
            password_error_text: null,
            redirectTo: redirectRoute,
            disabled: true,
        };
    }

    isDisabled() {
        let email_is_valid = false;
        let password_is_valid = false;

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

        if (email_is_valid && password_is_valid) {
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
        this.props.loginUser(this.state.email, this.state.password, this.state.redirectTo);
    }

    render() {
        return (
            <div className="app flex-row align-items-center" onKeyPress={(e) => this._handleKeyPress(e)}>
                <Container>
                    <Row className="justify-content-center">

                        <Col md="8">
                            {
                                this.props.statusText &&
                                <Alert color="warning">
                                    {this.props.statusText}
                                </Alert>
                            }
                            <CardGroup>
                                <Card className="p-4">

                                    <CardBody className="was-validated">
                                        <FormGroup className="mb-3">
                                            <InputGroup className="input-prepend">
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <i className="icon-user"></i>
                                                    </InputGroupText>
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
                                        <FormGroup className="mb-4">
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
                                        <Row>
                                            <Col xs="6">
                                                <Button color="primary" className="px-4"
                                                    onClick={(e) => this.login(e)}
                                                    disabled={this.state.disabled}
                                                >Login</Button>
                                            </Col>
                                            <Col xs="6" className="text-right">
                                                <Button color="link" className="px-0">Forgot password?</Button>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                                    <CardBody className="text-center">
                                        <div>
                                            <h2>Sign up</h2>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua.</p>
                                            <Button onClick={(e) => this.props.history.push('/register')} color="primary" className="mt-3" active>Register Now!</Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            </CardGroup>
                        </Col>
                    </Row>
                </Container>
            </div>
        );

    }
}

Login.propTypes = {
    loginUser: PropTypes.func,
    statusText: PropTypes.string,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login))
