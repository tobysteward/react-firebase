'use strict';

var Firebase,
    marked,
    React;

var Comment = React.createClass({
    render: function () {
        return React.createElement('div', {className: 'comment'},
            React.createElement('h2', {className: 'commentAuthor'}, this.props.author),
            React.createElement('span', {dangerouslySetInnerHTML: { __html: marked(this.props.children.toString(), {sanitize: true})}})
        );
    }
});

var CommentList = React.createClass({
    render: function () {
        var commentNodes = this.props.data.map(function (comment) {
            return React.createElement(Comment, {author: comment.author}, comment.text);
        });

        return React.createElement('div', {className: 'commentList'}, commentNodes);
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
        return React.createElement('form', {className: 'commentForm', onSubmit: this.handleSubmit},
            React.createElement('input', {type: 'text', placeholder: 'Your name', ref: 'author'}),
            React.createElement('input', {type: 'text', placeholder: 'Say something...', ref: 'text'}),
            React.createElement('input', {type: 'submit', value: 'Post'})
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
        return React.createElement('div', {className: 'commentBox'},
            React.createElement('h1', {}, 'Comments'),
            React.createElement(CommentList, {data: this.state.data}),
            React.createElement(CommentForm, {onCommentSubmit: this.handleCommentSubmit})
        );
    }
});

React.render(
    React.createElement(CommentBox, {url: 'https://reactfb.firebaseio.com/'}),
    document.getElementById('content')
);
