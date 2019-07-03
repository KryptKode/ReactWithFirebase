import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {compose} from 'recompose';

import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes'; 

const SignIn  = () =>(
    <div>
        <h1>SignIn</h1>
    </div>
);

export default SignIn;