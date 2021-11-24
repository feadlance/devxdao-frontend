/* eslint-disable no-undef */
import moment from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import API from "../../../../utils/API";
import WriteComment from "../write-comment/WriteComment";

const mapStateToProps = (state) => {
    return {
        authUser: state.global.authUser,
        settings: state.global.settings,
        editMode: state.admin.editMode,
    };
};

class SingleComment extends Component {
    constructor(props) {
        super(props);

        const { proposal } = this.props;

        this.state = {
            proposal,
            displayReply: false,
        };
    }

    handleUpVote = () => {
        API.upVoteComment(this.props.comment.id).then((res) => {
            if (res.success === false) {
                alert(res.message);
                return;
            }

            this.props.getComments();
        });
    }

    handleDownVote = () => {
        API.downVoteComment(this.props.comment.id).then((res) => {
            if (res.success === false) {
                alert(res.message);
                return;
            }

            this.props.getComments();
        });
    }

    handleReply = () => {
        this.setState({ displayReply: !this.state.displayReply });
    }

    renderContent() {
        const { comment, proposal, getComments } = this.props;
        const { displayReply } = this.state;

        return (
            <div className="comment">
                <div className="comment-heading">
                    <div className="comment-voting">
                        {/* <img className="avatar-img" src="../Home/images/avatars/@commentItem.ProfileImage" alt="somebody1"> */}
                    </div>
                    <div className="comment-info">
                        <a href="#" className="comment-author">{comment.user.first_name}</a>
                        <p className="m-0">{comment.created_at}</p>
                    </div>
                </div>
                <div className="comment-body">
                    <p>{comment.comment}</p>
                    <button onClick={this.handleUpVote}>Up ({comment.up_vote})</button>
                    <button onClick={this.handleDownVote}>Down ({comment.down_vote})</button>
                    <button onClick={this.handleReply}>Reply</button>
                </div>
                {displayReply && (
                    <WriteComment proposal={proposal} parent={comment.id} getComments={getComments} handleReply={this.handleReply} />
                )}
                <div className="replies">
                    {comment.children.map((child) => (
                        <SingleComment key={child.id} comment={child} proposal={proposal} getComments={getComments} />
                    ))}
                </div>
            </div>
        );
    }

    render() {
        const { proposal } = this.state;
        if (!proposal || !proposal.id) return null;

        return this.renderContent();
    }
}

export default connect(mapStateToProps)(withRouter(SingleComment));
