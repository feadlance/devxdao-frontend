/* eslint-disable no-undef */
import moment from "moment";
import React, { Component } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  MessageCircle,
  Trash,
} from "react-feather";
import BeatLoader from "react-spinners/BeatLoader";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import API from "../../../../utils/API";
import WriteComment from "../write-comment/WriteComment";
import UpdateComment from "../update-comment/UpdateComment";
import ReactMarkdown from "react-markdown";
import ReactLinkify from "react-linkify";
import { Reply } from "@material-ui/icons";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
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
      displayEdit: false,
      loading: false,
      deleteConfirmation: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.comment !== this.props.comment) {
      this.setState({ comment: this.props.comment });
    }
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
          ...res.data,
        },
      }));
    });
  };

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
          ...res.data,
        },
      }));
    });
  };

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
        },
      }));
    });
  };

  handleDestroy = () => {
    if (this.state.deleteConfirmation === true) {
      return this.handleConfirmDestroy();
    }

    this.setState({ deleteConfirmation: true });

    setTimeout(() => {
      this.setState({ deleteConfirmation: false });
    }, 3000);
  };

  handleReply = () => {
    this.setState({
      displayReply: !this.state.displayReply,
    });
  };

  handleEdit = () => {
    this.setState({
      displayEdit: !this.state.displayEdit,
    });
  };

  updateEdit = (comment) => {
    this.handleEdit();

    this.setState({
      comment: {
        ...this.state.comment,
        ...comment,
      },
    });
  };

  isCommentDeleted = () => {
    const { comment } = this.state;

    return comment.comment === "Comment deleted by the user.";
  };

  renderContent() {
    const { proposal, getComments, authUser, withoutChildren } = this.props;
    const {
      comment,
      displayReply,
      displayEdit,
      loading,
      deleteConfirmation,
    } = this.state;

    return (
      <div className="comment-wrapper">
        <div
          className={`comment-container ${loading ? "comment-loading" : ""}`}
        >
          <div className="comment-loader">
            {loading && <BeatLoader color="#fff" />}
          </div>
          <div className="comment-header">
            <div className="comment-header-start">
              <div className="comment-image">
                <img width="40" src="/user.png" alt="User avatar" />
              </div>
              <div className="comment-meta">
                <div className="comment-author">
                  <div className="comment-writer">
                    {comment.profile.forum_name}
                  </div>
                  {comment.user?.reputations_count > 0 && (
                    <div className="user-reputation">
                      {comment.user.reputations_count}
                    </div>
                  )}
                </div>
                <div className="comment-date">
                  {moment(comment.created_at).format("MM/DD/YYYY HH:mm")}
                </div>
              </div>
            </div>
            <div className="comment-actions">
              <button
                onClick={this.handleUpVote}
                className={`comment-action ${
                  comment.up_voted_by_auth ? "active" : ""
                }`}
              >
                <ChevronUp />
                <span className="comment-action-value">{comment.up_vote}</span>
              </button>
              <button
                onClick={this.handleDownVote}
                className={`comment-action ${
                  comment.down_voted_by_auth ? "active" : ""
                }`}
              >
                <ChevronDown />
                <span className="comment-action-value">
                  {comment.down_vote}
                </span>
              </button>
              <button
                onClick={this.handleReply}
                className={`comment-action display-on-hover ${
                  displayReply ? "active" : ""
                }`}
              >
                <Reply />
                <span>Reply</span>
              </button>
              {authUser?.id === comment.user_id && !this.isCommentDeleted() && (
                <>
                  <button
                    onClick={this.handleEdit}
                    className={`comment-action display-on-hover ${
                      displayEdit ? "active" : ""
                    }`}
                  >
                    <Edit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={this.handleDestroy}
                    className={`comment-action display-on-hover ${
                      deleteConfirmation ? "action-confirm" : ""
                    }`}
                  >
                    <Trash />
                    <span>{deleteConfirmation ? "Confirm" : "Delete"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
          {displayEdit ? (
            <UpdateComment
              commentId={comment.id}
              commentText={comment.comment}
              handleEdit={this.updateEdit}
            />
          ) : (
            <div className="comment-content">
              <ReactMarkdown
                children={comment.comment}
                components={{
                  p: (props) => (
                    <p>
                      <ReactLinkify
                        {...props}
                        componentDecorator={(
                          decoratedHref,
                          decoratedText,
                          key
                        ) => (
                          <a
                            target="blank"
                            rel="nofollow noopener noreferrer"
                            href={decoratedHref}
                            key={key}
                          >
                            {decoratedText}
                          </a>
                        )}
                      />
                    </p>
                  ),
                }}
              />
              {comment.created_at !== comment.updated_at && (
                <div className="comment-updated">
                  <span>edited on</span>
                  {moment(comment.updated_at).format("MM/DD/YYYY HH:mm")}
                </div>
              )}
            </div>
          )}
        </div>
        {displayReply && (
          <WriteComment
            proposal={proposal}
            parent={comment.id}
            getComments={getComments}
            handleReply={this.handleReply}
          />
        )}
        {withoutChildren !== true && comment.children.length > 0 && (
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
