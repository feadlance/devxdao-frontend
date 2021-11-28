/* eslint-disable no-undef */
import moment from "moment";
import React, { Component } from "react";
import { ChevronDown, ChevronUp, MessageCircle, Trash } from "react-feather";
import BeatLoader from "react-spinners/BeatLoader";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import API from "../../../../utils/API";
import WriteComment from "../write-comment/WriteComment";

const mapStateToProps = (state) => {
    return {
        authUser: state.global.authUser
    };
};

class SingleComment extends Component {
    constructor(props) {
        super(props);

        const { proposal, comment } = this.props;

        this.state = {
            proposal,
            comment,
            displayReply: false,
            loading: false,
            deleteConfirmation: false,
        };
    }

    handleUpVote = () => {
        this.setState({ loading: true });

        API.upVoteComment(this.props.comment.id).then((res) => {
            if (res.success === false) {
                alert(res.message);
                return;
            }

            this.setState((prev) => ({
                loading: false,
                comment: {
                    ...prev.comment,
                    ...res.data
                }
            }));
        });
    }

    handleDownVote = () => {
        this.setState({ loading: true });

        API.downVoteComment(this.props.comment.id).then((res) => {
            if (res.success === false) {
                alert(res.message);
                return;
            }

            this.setState((prev) => ({
                loading: false,
                comment: {
                    ...prev.comment,
                    ...res.data
                }
            }));
        });
    }

    handleConfirmDestroy = () => {
        this.setState({ loading: true });

        API.destroyComment(this.props.comment.id).then((res) => {
            if (res.success === false) {
                alert(res.message);
                return;
            }

            this.setState((prev) => ({
                loading: false,
                deleteConfirmation: false,
                comment: {
                    ...prev.comment,
                    comment: res.comment.comment,
                }
            }));
        });
    }

    handleDestroy = () => {
        if (this.state.deleteConfirmation === true) {
            return this.handleConfirmDestroy();
        }

        this.setState({ deleteConfirmation: true });

        setTimeout(() => {
            this.setState({ deleteConfirmation: false });
        }, 3000);
    }

    handleReply = () => {
        this.setState({ displayReply: !this.state.displayReply });
    }

    isCommentDeleted = () => {
        const { comment } = this.state;

        return comment.comment === 'Comment deleted by the user.';
    }

    renderContent() {
        const { proposal, getComments, authUser } = this.props;
        const { comment, displayReply, loading, deleteConfirmation } = this.state;

        return (
            <div className="comment-wrapper">
                <div className={`comment-container ${loading ? 'comment-loading' : ''}`}>
                    <div className="comment-loader">
                        {loading && <BeatLoader color="#fff" />}
                    </div>
                    <div className="comment-header">
                        <div className="comment-header-start">
                            <div className="comment-image">
                                <img width="40" src="/user.png" alt="User avatar" />
                            </div>
                            <div className="comment-meta">
                                <div className="comment-writer">{comment.profile.forum_name}</div>
                                <div className="comment-date">{moment(comment.created_at).format('YYYY-MM-DD')}</div>
                            </div>
                        </div>
                        <div className="comment-actions">
                            <button onClick={this.handleUpVote} className={`comment-action ${comment.up_voted_by_auth ? 'active' : ''}`}>
                                <ChevronUp />
                                <span className="comment-action-value">{comment.up_vote}</span>
                            </button>
                            <button onClick={this.handleDownVote} className={`comment-action ${comment.down_voted_by_auth ? 'active' : ''}`}>
                                <ChevronDown />
                                <span className="comment-action-value">{comment.down_vote}</span>
                            </button>
                            <button onClick={this.handleReply} className={`comment-action display-on-hover ${displayReply ? 'active' : ''}`}>
                                <MessageCircle />
                                <span>Reply</span>
                            </button>
                            {authUser?.id === comment.user_id && !this.isCommentDeleted() && (
                                <button onClick={this.handleDestroy} className={`comment-action display-on-hover ${deleteConfirmation ? 'action-confirm' : ''}`}>
                                    <Trash />
                                    <span>{deleteConfirmation ? 'Confirm' : 'Delete'}</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="comment-content">{comment.comment}</div>
                </div>
                {displayReply && (
                    <WriteComment
                        proposal={proposal}
                        parent={comment.id}
                        getComments={getComments}
                        handleReply={this.handleReply}
                    />
                )}
                {comment.children.length > 0 && (
                    <div className="comment-replies">
                        {comment.children.map((child) => (
                            <SingleComment
                                key={child.id}
                                comment={child}
                                proposal={proposal}
                                authUser={authUser}
                                getComments={getComments}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    render() {
        const { proposal } = this.state;
        const { authUser } = this.props;
        if (!authUser || !authUser.id || !proposal || !proposal.id) return null;

        return this.renderContent();
    }
}

export default connect(mapStateToProps)(withRouter(SingleComment));
