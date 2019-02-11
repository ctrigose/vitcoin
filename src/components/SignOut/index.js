import React from 'react'

import { withFirebase } from '../Firebase'

import { Button } from 'rendition'


const buttonStyle = {
  border:"solid",
  borderRadius: "4px",
  borderColor: "white",
  color: "#eb3b5a",
  fontSize: "1em",
  textDecoration: "none",
  padding: "1em",
  margin: "2em 2em 2em 4em"

}
const SignOutButton = ({ firebase }) => (
  <button style={buttonStyle} type="button" onClick={firebase.doSignOut}>
    Sign Out
  </button>
)

export default withFirebase(SignOutButton)