import React, { Component } from 'react';
import { Link, withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import { withFirebase } from '../Firebase'
import {SignInLink} from '../SignIn'
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => (
    <div>
        <h1>SignUp</h1>
        <SignUpForm />
        <SignInLink />
    </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};



class SignUpFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        event.preventDefault();
        const { username, email, passwordOne } = this.state;
        const firebase = this.props.firebase
        firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
               return firebase.user(authUser.user.uid)
                        .set({
                            username,
                            email,
                        })
            }).then(()=>{
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            })
    }

    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name='username'
                    value={username}
                    onChange={this.onChange}
                    type='text'
                    placeholder="Full Name"
                />
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password"
                />
                <button type="submit" disabled={isInvalid}>
                    Sign Up
                </button>
                {error && <p>{error.message}</p>}
            </form>
        )
    }
}

const SignUpForm = compose(withRouter,withFirebase)(SignUpFormBase);

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };