import React, { Component } from 'react';

import { withAuthorization, AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

const Home = () => (
    <div>
        <h1>Home</h1>

        <Messages />
    </div>
);

class MessagesBase extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            loading: false,
            messages: [],
        };
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.props.firebase.messages().on('value', snapshot => {

            const messageObject = snapshot.val();

            if (messageObject) {
                // convert messages list from snapshot

                const messageList = Object.keys(messageObject).map(key => ({
                    ...messageObject[key],
                    uid: key,
                }));



                this.setState({
                    messages: messageList,
                    loading: false
                });
            } else {
                this.setState({ messages: null, loading: false });
            }
        });
    }

    componentWillUnmount() {
        this.props.firebase.messages().off();
    }

    onChangeText = event => {
        this.setState({ text: event.target.value });
    };

    onCreateMessage = (event, authUser) => {
        this.props.firebase.messages().push({
            text: this.state.text,
            userId: authUser.uid,
        });

        this.setState({ text: '' });

        event.preventDefault();
    };

    render() {
        const { text, messages, loading } = this.state;

        return (
            <AuthUserContext.Consumer>

                {
                    authUser => (
                        <div>
                            {loading && <div>Loading ...</div>}
                            {messages ? (
                                <MessageList messages={messages} />
                            ) : (
                                    <div> There are no messages</div>
                                )}

                            <form onSubmit={event => this.onCreateMessage(event, authUser)}>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={this.onChangeText}
                                />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    )
                }
            </AuthUserContext.Consumer>
        );
    }

}

const Messages = withFirebase(MessagesBase);


const MessageList = ({ messages }) => (
    <ul>
        {messages.map(message => (
            <MessageItem key={message.uid} message={message} />
        ))}
    </ul>
);

const MessageItem = ({ message }) => (
    <li>
        <strong>{message.userId}</strong> {message.text}
    </li>
);

const condition = (authUser) => !!authUser;

export default withAuthorization(condition)(Home);