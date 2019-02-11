import React from 'react'
import AuthUserContext from './context'
import { withFirebase } from '../Firebase'

const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
        super(props);

            this.state = {
                authUser: null,
                email: ""
            }
        }

        componentDidMount() {
            this.listener = this.props.firebase.auth.onAuthStateChanged(
                authUser => {
                    console.log("Auth change")
                    authUser
                        ? this.setState({ authUser, email: authUser.email})
                        : this.setState({ authUser: null, email: "" })
                },
            )
        }

        componentWillUnmount() {
            this.listener()
        }

        render() {
            return (
                <AuthUserContext.Provider value={this.state}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            )
        }
    }

    return withFirebase(WithAuthentication)
}

export default withAuthentication