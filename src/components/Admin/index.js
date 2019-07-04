import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { compose } from 'recompose';

import { withAuthorization } from '../Session'
import { withFirebase } from '../Firebase'
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
    loading: false,
    users: [],
};

const AdminPage = () => (
    <div>
        <h1>Admin</h1>
        <p>The Admin Page is accessible by every signed in admin user.</p>

        <Switch>
            <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
            <Route exact path={ROUTES.ADMIN} component={UserList} />
        </Switch>
    </div>
);

class UserListBase extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ...INITIAL_STATE,
        };
    }

    componentDidMount() {
        this.setState({ loading: true });
        this.props.firebase.users().on('value', snapshot => {

            if (snapshot.hasChildren()) {
                const userObjects = snapshot.val();
                const userList = Object.keys(userObjects).map(key => ({
                    ...userObjects[key],
                    uid: key,
                }));
                this.setState({
                    users: userList,
                    loading: false,
                });
            } else {
                this.setState({
                    ...INITIAL_STATE,
                });
            }

        })
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
    }

    render() {
        const { users, loading } = this.state;
        console.log(users);
        return (
            <div>
                <h2>Users</h2>

                {loading && <div>Loading ...</div>}

                {(users.length > 0) ?
                    <ul>
                        {users.map(user => (
                            <li key={user.uid}>
                                <span>
                                    <strong>ID:</strong> {user.uid}
                                </span>
                                <span>
                                    <strong>E-Mail:</strong> {user.email}
                                </span>
                                <span>
                                    <strong>Username:</strong> {user.username}
                                </span>

                                <span>
                                    <Link to={`${ROUTES.ADMIN}/${user.uid}`}>
                                        Details
                                    </Link>
                                </span>
                            </li>
                        ))}
                    </ul> :
                    <h2>No users!</h2>}
            </div>
        );
    }

}



class UserItemBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            user: null,
            ...props.location.state,
        };
    }

    componentDidMount() {
        if (this.state.user) {
            return;
        }

        this.setState({ loading: true });

        this.props.firebase
            .user(this.props.match.params.id)
            .on('value', snapshot => {
                this.setState({
                    user: snapshot.val(),
                    loading: false,
                });
            });
    }


    onSendPasswordResetEmail = () => {
        this.props.firebase.doPasswordReset(this.state.user.email);
    };

    render() {
        const { user, loading } = this.state;

        return (
            <div>
                <h2>User ({this.props.match.params.id})</h2>
                {loading && <div>Loading ...</div>}

                {user && (
                    <div>
                        ...
                <span>
                            <strong>Username:</strong> {user.username}
                        </span>
                        <span>
                            <button
                                type="button"
                                onClick={this.onSendPasswordResetEmail}
                            >
                                Send Password Reset
                  </button>
                        </span>
                    </div>
                )}
            </div>
        );
    }

}

const UserList = withFirebase(UserListBase);

const UserItem = withFirebase(UserItemBase);

const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(withAuthorization(condition), withFirebase)(AdminPage);