import React from 'react';


import AuthUserContext from './context';
import {withFirebase} from '../Firebase';

const AUTH_USER = 'authUser';
const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                authUser: JSON.parse(localStorage.getItem(AUTH_USER)),
            }
        }


        componentDidMount() {
            this.listener = this.props.firebase
            .onAuthUserListener(authUser => {
                localStorage.setItem(AUTH_USER, JSON.stringify(authUser));
                this.setState({ authUser });
            }, ()=>{
                localStorage.setItem(AUTH_USER, null);
                this.setState({authUser:null})
            })
        }

        componentWillUnmount() {
            this.listener();
        }


        render() {
            return (
                <AuthUserContext.Provider value={this.state.authUser}>
                    <Component {...this.props} />
                </AuthUserContext.Provider>
            );
        }
    }

    return withFirebase(WithAuthentication);
};

export default withAuthentication;