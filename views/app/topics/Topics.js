import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Fade } from "react-reveal";
import TopicsView from "../shared/topics/Topics";
import "./topics.scss";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Topics extends Component {
  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <div id="app-topics-page">
        <Fade distance={"20px"} bottom duration={400} delay={600}>
          <div className="mb-3">
            <button className="btn btn-primary small">New Topic</button>
          </div>
        </Fade>
        <TopicsView />
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Topics));
