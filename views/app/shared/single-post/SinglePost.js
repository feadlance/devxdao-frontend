/* eslint-disable no-undef */
import moment from "moment";
import React, { Component } from "react";
import { Edit, Heart, Trash } from "react-feather";
import BeatLoader from "react-spinners/BeatLoader";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import API from "../../../../utils/API";
import WritePost from "../write-post/WritePost";
import EditPost from "../edit-post/EditPost";
import ReactMarkdown from "react-markdown";
import ReactLinkify from "react-linkify";
import { Reply } from "@material-ui/icons";
import remarkBreaks from "remark-breaks";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class SinglePost extends Component {
  constructor(props) {
    super(props);

    const { proposal, post } = this.props;

    this.state = {
      proposal,
      post,
      displayReply: false,
      displayEdit: false,
      loading: false,
      deleteConfirmation: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post !== this.props.post) {
      this.setState({ post: this.props.post });
    }
  }

  handleReact = () => {
    this.setState({ loading: true });

    API.reactPost(this.props.post.id)
      .then((res) => {
        if (res.success === false) {
          alert(res.message);
          return;
        }

        this.setState((prev) => ({
          post: {
            ...prev.post,
            ...res,
          },
        }));
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleConfirmDestroy = () => {
    this.setState({ loading: true });

    API.destroyPost(this.props.post.id).then((res) => {
      console.log(res);
      if (res.success === false) {
        alert(res.message);
        return;
      }

      this.setState((prev) => ({
        loading: false,
        deleteConfirmation: false,
        post: {
          ...prev.post,
          cooked: res.cooked,
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
    const { displayEdit, post } = this.state;

    if (displayEdit) {
      this.setState({ displayEdit: false });
      return;
    }

    this.setState({ loading: true });

    API.showPost(post.id)
      .then((res) => {
        this.setState({
          post: {
            ...post,
            raw: res.raw,
          },
          displayEdit: true,
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  updateEdit = (post) => {
    this.handleEdit();

    this.setState({
      post: {
        ...this.state.post,
        ...post,
      },
    });
  };

  renderContent() {
    const { proposal, getPosts } = this.props;

    const {
      post,
      displayReply,
      displayEdit,
      loading,
      deleteConfirmation,
    } = this.state;

    const likes = post.actions_summary?.find((action) => action.id === 2) || {};

    return (
      <div className="post-wrapper">
        <div className={`post-container ${loading ? "post-loading" : ""}`}>
          <div className="post-loader">
            {loading && <BeatLoader color="#fff" />}
          </div>
          <div className="post-header">
            <div className="post-header-start">
              <div className="post-image">
                <img width="40" src="/user.png" alt="User avatar" />
              </div>
              <div className="post-meta">
                <div className="post-author">
                  <div className="post-writer">{post.username}</div>
                  {post.devxdao_user?.reputation > 0 && (
                    <div className="user-reputation">
                      {post.devxdao_user.reputation}
                    </div>
                  )}
                </div>
                <div className="post-date">
                  {moment(post.created_at).format("MM/DD/YYYY HH:mm")}
                </div>
              </div>
            </div>
            <div className="post-actions">
              <button
                onClick={this.handleReact}
                className={`post-action ${likes.acted ? "active" : ""}`}
                disabled={!likes.can_act && !likes.can_undo}
              >
                <Heart />
                {likes.count > 0 && (
                  <span className="post-action-value">{likes.count}</span>
                )}
              </button>
              <button
                onClick={this.handleReply}
                className={`post-action display-on-hover ${
                  displayReply ? "active" : ""
                }`}
              >
                <Reply />
                <span>Reply</span>
              </button>
              {post.can_edit && (
                <button
                  onClick={this.handleEdit}
                  className={`post-action display-on-hover ${
                    displayEdit ? "active" : ""
                  }`}
                >
                  <Edit />
                  <span>Edit</span>
                </button>
              )}
              {post.can_delete && (
                <button
                  onClick={this.handleDestroy}
                  className={`post-action display-on-hover ${
                    deleteConfirmation ? "action-confirm" : ""
                  }`}
                >
                  <Trash />
                  <span>{deleteConfirmation ? "Confirm" : "Delete"}</span>
                </button>
              )}
            </div>
          </div>
          {displayEdit ? (
            <EditPost
              postId={post.id}
              postText={post.raw}
              handleEdit={this.updateEdit}
            />
          ) : (
            <div className="post-content">
              <div
                className="post-text"
                dangerouslySetInnerHTML={{ __html: post.cooked }}
              />
              {post.created_at !== post.updated_at && (
                <div className="post-updated">
                  <span>edited on</span>
                  {moment(post.updated_at).format("MM/DD/YYYY HH:mm")}
                </div>
              )}
            </div>
          )}
        </div>
        {displayReply && (
          <WritePost
            proposal={proposal}
            parent={post.post_number}
            getPosts={getPosts}
            handleReply={this.handleReply}
          />
        )}
        {/* {post.children.length > 0 && (
          <div className="post-replies">
            {post.children.map((child) => (
              <SinglePost
                key={child.id}
                post={child}
                proposal={proposal}
                authUser={authUser}
                getPosts={getPosts}
              />
            ))}
          </div>
        )} */}
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

export default connect(mapStateToProps)(withRouter(SinglePost));
