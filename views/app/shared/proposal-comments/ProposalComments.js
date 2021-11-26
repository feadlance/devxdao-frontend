/* eslint-disable no-undef */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as Icon from "react-feather";
import "./proposal-comments.scss";
import {
  Card,
  CardHeader,
  CardBody
} from "../../../../components/card";
import API from "../../../../utils/API";
import SingleComment from "../single-comment/SingleComment";
import WriteComment from "../write-comment/WriteComment";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    settings: state.global.settings,
    editMode: state.admin.editMode,
  };
};

class ProposalComments extends Component {
  constructor(props) {
    super(props);
    const { proposal } = this.props;
    this.state = {
      expanded: false,
      comments: [],
      proposal
    };
  }

  componentDidMount() {
    this.getComments();
  }

  getComments = () => {
    API.getComments(this.props.proposal.id).then((res) => {
      this.setState({ comments: res.comments });
    });
  }

  render() {
    const { expanded, comments, proposal } = this.state;
    const { isAutoExpand } = this.props;

    if (!proposal || !proposal.id) return null;

    return (
      <section id="app-proposal-comments-section">
        <Fragment>
          <div>
            <Card isAutoExpand={isAutoExpand} extraAction={this.toggle}>
              <CardHeader>
                <>
                  {!expanded && (
                    <div
                      className="app-simple-section__titleInner w-100"
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <div>
                        <label>Comments</label>
                        <Icon.Info size={16} />
                      </div>
                    </div>
                  )}
                </>
              </CardHeader>
              <CardBody>
                <div className="mt-3">
                  <WriteComment proposal={proposal} getComments={this.getComments} />
                </div>
                {comments.map((comment) => (
                  <SingleComment key={comment.id} comment={comment} proposal={proposal} getComments={this.getComments} />
                ))}
              </CardBody>
            </Card>
          </div>
        </Fragment>
      </section>
    );
  }
}

export default connect(mapStateToProps)(withRouter(ProposalComments));
