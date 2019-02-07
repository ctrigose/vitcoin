import React from 'react';
import { AuthUserContext } from '../Session';
import firebase from 'firebase'

import { Container, Card, Heading, Txt, Provider, Img, Fixed} from 'rendition'
import BitcoinValue from './BitcoinValue';

const Home = () => (
  <div>
    <AuthUserContext.Consumer>{
        user => user.authUser ? <HomePage userEmail={user.email}/> : <Landing/>
    }
    </AuthUserContext.Consumer>
    <BitcoinValue />
  </div>
);

Card.defaultProps = {
  color:"white",
  fontSize: "1em",
  m: "1em"
}
const card1 = {
  bg:"#a5b1c2",
}

const Landing = () => (
  <Provider>
    <Container mt="3em">
        <Heading.h1>How it works</Heading.h1>
        <Card bg="#a5b1c2">Select the amount of fake money you would like to trade with 💰</Card>
        <Card bg="#778ca3">Buy and sell bitcoins at market value 📈</Card>
        <Card bg="#4b6584">Repeat 🔄</Card>
    </Container>
  </Provider>
)

const HomePage = (props) => (
  <Provider>
    <Container>
      <p>Stuff Here {props.userEmail}</p>
    </Container>
  </Provider>
)
export default Home;