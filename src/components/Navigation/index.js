import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';

import { Box, Flex, Provider, Img, Fixed } from 'rendition'
import logo from '../../assets/images/logo.png'

Flex.defaultProps = {
  justify: "center",
  p: "0",
  ml:"7.5em",
  bg: "#eb3b5a",
}

Img.defaultProps = {
  w: "7.5em",
}

const linkStyle = {
  border:"solid",
  borderRadius: "4px",
  borderColor: "white",
  color: "white",
  fontSize: "1em",
  textDecoration: "none",
  padding: "1em",
  margin: "2em"
}

const Navigation = () => (
  <div>
    <Fixed><Img src={logo}/></Fixed>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser.authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
)

const NavigationAuth = () => (
  
  <Provider>
    <Box>
      <Flex>

        <Link style={linkStyle} to={ROUTES.HOME}>Home</Link>

        <Link style={linkStyle} to={ROUTES.TRADE}>Trade</Link>
            
        <Link style={linkStyle} to={ROUTES.ACCOUNT}>Account</Link>
      
        <SignOutButton />
      </Flex>
    </Box>
  </Provider>
);

const NavigationNonAuth = () => (
  <Flex>

      <Link style={linkStyle} to={ROUTES.HOME}>Home</Link>
    
      <Link style={linkStyle} to={ROUTES.SIGN_IN}>Sign In</Link>
    
  </Flex>
);


export default Navigation;