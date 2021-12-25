/* eslint-disable no-undef */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as Icon from "react-feather";
import "./proposal-posts.scss";
import { Card, CardHeader, CardBody } from "../../../../components/card";
import API from "../../../../utils/API";
import SinglePost from "../single-post/SinglePost";
import WritePost from "../write-post/WritePost";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    settings: state.global.settings,
    editMode: state.admin.editMode,
  };
};

class ProposalPosts extends Component {
  constructor(props) {
    super(props);
    const { proposal } = this.props;
    this.state = {
      expanded: false,
      posts: [],
      proposal,
    };
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    return API.getPosts(this.props.proposal.discourse_topic_id).then((res) => {
      if (res.posts) {
        this.setState({ posts: res.posts });
      }
    });
  };

  render() {
    const { expanded, posts, proposal } = this.state;
    const { isAutoExpand } = this.props;

    if (!proposal || !proposal.id) return null;

    return (
      <section id="app-proposal-posts-section">
        <Fragment>
          <div>
            <Card isAutoExpand={isAutoExpand} extraAction={this.toggle}>
              <CardHeader>
                <>
                  {!expanded && (
                    <div
                      className="app-simple-section__titleInner w-100"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <label>Posts</label>
                        <Icon.Info size={16} className="ml-3" />
                      </div>
                    </div>
                  )}
                </>
              </CardHeader>
              {posts.length > 0 && (
                <div className="mt-3">
                  <SinglePost
                    key={posts[0].id}
                    post={posts[0]}
                    proposal={proposal}
                    getPosts={this.getPosts}
                  />
                </div>
              )}
              <CardBody>
                <div className="write-post">
                  <WritePost proposal={proposal} getPosts={this.getPosts} />
                </div>
                <div className="posts">
                  {posts.map((post) => (
                    <SinglePost
                      key={post.id}
                      post={post}
                      proposal={proposal}
                      getPosts={this.getPosts}
                    />
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </Fragment>
      </section>
    );
  }
}

export default connect(mapStateToProps)(withRouter(ProposalPosts));
