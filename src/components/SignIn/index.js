import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { Button, Input, Heading, Container, Alert, Provider } from 'rendition'

Input.defaultProps = {
  mb: "10px",
}
Heading.h1.defaultProps = {
  mb: "20px",
  mt: "20px"
}
Container.defaultProps = {
  align: "center",
}
Alert.defaultProps = {
  mb: "20px",
  mt: "20px"
}


const SignInPage = () => (
  <Provider>
    <Container pt="3em">
      <SignInForm />
      <SignUpLink />
    </Container>
  </Provider >
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <Heading.h1>Sign In</Heading.h1>
        {error && <Alert danger>{error.message}</Alert>}
        <Input 
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <br></br>
        <Input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <br></br>

        <Button mb="5em" disabled={isInvalid} type="submit">
          Sign In
        </Button>
      </form>
    );
  }
}

const SignInForm = withRouter(withFirebase(SignInFormBase))

export default SignInPage;

export { SignInForm };