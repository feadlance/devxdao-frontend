/* eslint-disable no-undef */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import API from "../../../../utils/API";
import './write-comment.scss';

const mapStateToProps = (state) => {
    return {
        authUser: state.global.authUser,
        settings: state.global.settings,
        editMode: state.admin.editMode,
    };
};

class WriteComment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: "",
        };
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { parent, proposal, getComments, handleReply } = this.props;

        API.submitComment(proposal.id, {
            comment: this.state.comment,
            parent_id: parent
        }).then(() => {
            getComments();

            this.setState({
                comment: ""
            });

            handleReply && handleReply();
        });
    }

    handleChange = (e) => {
        this.setState({
            comment: e.target.value,
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <textarea className="comment-input" value={this.state.comment} onChange={this.handleChange} placeholder="Reply"></textarea>
                <button className="comment-btn" type="submit">Send</button>
            </form>
        );
    }
}

export default connect(mapStateToProps)(withRouter(WriteComment));
