import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {AUTH_USER_SET} from '../../reducers'

import {withFirebase} from '../Firebase';

const AUTH_USER = 'authUser';
const withAuthentication = Component => {
    class WithAuthentication extends React.Component {
        constructor(props) {
            super(props);
            const authUser = JSON.parse(localStorage.getItem(AUTH_USER))
            
            this.props.onSetAuthUser(
                authUser
            )
        }


        componentDidMount() {
            this.listener = this.props.firebase
            .onAuthUserListener(authUser => {
                
                localStorage.setItem(AUTH_USER, JSON.stringify(authUser));
                this.props.onSetAuthUser(authUser);
            }, ()=>{
                localStorage.setItem(AUTH_USER, null);
                this.props.onSetAuthUser(null)
            })
        }

        componentWillUnmount() {
            this.listener();
        }


        render() {
            return (
                    <Component {...this.props} />
            );
        }
    }

    const mapDispatchToProps = dispatch => ({
        onSetAuthUser: authUser =>{
            
            return dispatch({type:AUTH_USER_SET, authUser})
        },
    })

    return compose(
        withFirebase,
        connect(
            null,
            mapDispatchToProps,
        ),
        )(WithAuthentication);
};

export default withAuthentication;