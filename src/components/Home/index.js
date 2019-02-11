import React from 'react';
import { AuthUserContext } from '../Session';

import { Banner, Container, Card, Heading, Txt, Provider, Img, Fixed} from 'rendition'
import BitcoinValue from './BitcoinValue';

const Home = () => (
  <Banner bg="#45aaf2" color="white">
    <AuthUserContext.Consumer>{
        user => user.authUser ? <HomePage userEmail={user.email}/> : <Landing/>
    }
    </AuthUserContext.Consumer>
  </Banner>
);

Card.defaultProps = {
  color:"white",
  fontSize: "1.4em",
  m: "1em",
}

const Landing = () => (
  <Provider>
    <Container >
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
      <p>{props.userEmail}</p>
      <BitcoinValue />
    </Container>
  </Provider>
)
export default Home;