import React, { Component } from 'react';
import {compose} from 'recompose';

import { withAuthorization } from '../Session'
import { withFirebase } from '../Firebase'
import * as ROLES from '../../constants/roles';

const INITIAL_STATE = {
    loading:false,
    users:[],
};

class AdminPage extends Component {

    constructor(props){
        super(props);

        this.state = {
            ...INITIAL_STATE,
        };
    }

    componentDidMount(){
        this.setState({ loading: true });
        this.props.firebase.users().on('value', snapshot => {

            if(snapshot.hasChildren()){
                const userObjects = snapshot.val();
                const userList  = Object.keys(userObjects).map(key => ({
                    ...userObjects[key],
                    uid:key,
                }));
                this.setState({
                    users: userList,
                    loading: false,
                  });
            }else{
                this.setState({
                    ...INITIAL_STATE,
                });
            }
            
        })
    }

    componentWillUnmount() {
        this.props.firebase.users().off();
      }

    render(){
        const { users, loading } = this.state;

        return (
            <div>
              <h1>Admin</h1>

              {loading && <div>Loading ...</div>}

            {(users.length > 0) ?
              <UserList users={users} /> :
              <h2>No users!</h2>}
            </div>
          );
    }

}

const UserList = ({ users }) => (
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
        </li>
      ))}
    </ul>
  );

const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(withAuthorization(condition),  withFirebase)(AdminPage);