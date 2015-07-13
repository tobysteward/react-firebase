'use strict';

var Firebase,
    marked,
    React;

var Comment = React.createClass({
    render: function () {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});

        return (
            <div className="comment">
                <h2 class="commentAuthor">{ this.props.author }</h2>
                <span dangerouslySetInnerHTML={ {__html: rawMarkup} } />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function () {
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={ comment.author }>{ comment.text }</Comment>
            );
        });

        return (
            <div className="commentList">
                { commentNodes }
            </div>
        );
    }
});

var CommentForm = React.createClass({
    handleSubmit: function (e) {
        e.preventDefault();

        var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();

        if (!text || !author) {
            return;
        }

        this.props.onCommentSubmit({author: author, text: text});

        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.text).value = '';

        return;
    },
    render: function () {
        return (
            <form className="commentForm" onSubmit={ this.handleSubmit }>
                <input type="text" placeholder="Your name" ref="author" />
                <input type="text" placeholder="Say something..." ref="text" />
                <input type="submit" value="Post" />
            </form>
        );
    }
});

var CommentBox = React.createClass({displayName: 'CommentBox',
    handleCommentSubmit: function (comment) {
        var comments = this.state.data;
        var newComments = comments.concat([comment]);

        this.setState({data: newComments});
        this.firebaseRef.push(comment);
    },
    getInitialState: function () {
        return {
            data: []
        };
    },
    componentWillMount: function () {
        this.firebaseRef = new Firebase(this.props.url);
        this.firebaseRef.on('value', function (dataSnapshot) {
            var data = [];

            dataSnapshot.forEach(function (item) {
                data.push(item.val());
            });

            this.setState({data: data});
        }.bind(this), function (err) {
            console.log(err);
        }.bind(this));
    },
    componentWillUnmount: function () {
        this.firebaseRef.off();
    },
    render: function () {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={ this.state.data } />
                <CommentForm onCommentSubmit={ this.handleCommentSubmit } />
            </div>
        );
    }
});

React.render(
    <CommentBox url="https://reactfb.firebaseio.com/" />,
    document.getElementById('content')
);
