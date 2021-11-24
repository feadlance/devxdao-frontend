/* eslint-disable no-undef */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import * as Icon from "react-feather";
import Helper from "../../../../utils/Helper";

import "./proposal-comments.scss";
import {
  Card,
  CardHeader,
  CardBody
} from "../../../../components/card";
import API from "../../../../utils/API";
import SingleComment from "../single-comment/SingleComment";
import WriteComment from "../write-comment/WriteComment";

const proposalParams = (proposal) => {
  return {
    id: proposal.id,
    title: proposal.title.trim(),
    things_delivered: proposal.things_delivered?.trim(),
    delivered_at: proposal.delivered_at,
    short_description: proposal.short_description.trim(),
    explanation_benefit: proposal.explanation_benefit.trim(),
    explanation_goal: proposal.explanation_goal.trim(),
    license: proposal.license,
    license_other: (proposal.license_other || "").trim(),
    total_grant: parseFloat(Helper.unformatNumber(proposal.total_grant)),
    memberRequired: !!proposal.member_required,
    member_required: !!proposal.member_required,
    members: proposal.members,
    grants: proposal.grants,
    bank_name: proposal.bank?.bank_name || "",
    iban_number: proposal.bank?.iban_number || "",
    swift_number: proposal.bank?.swift_number || "",
    holder_name: proposal.bank?.holder_name || "",
    account_number: proposal.bank?.account_number || "",
    bank_address: proposal.bank?.bank_address || "",
    bank_city: proposal.bank?.bank_city || "",
    bank_country: proposal.bank?.bank_country || "",
    bank_zip: proposal.bank?.bank_zip || "",
    holder_address: proposal.bank?.holder_address || "",
    holder_city: proposal.bank?.holder_city || "",
    holder_country: proposal.bank?.holder_country || "",
    holder_zip: proposal.bank?.holder_zip || "",
    crypto_type: proposal.crypto?.type || "",
    crypto_address: proposal.crypto?.public_address || "",
    milestones: proposal.milestones,
    citations: proposal.citations.map((x) => {
      if (x.id) {
        return {
          ...x,
          proposalId: x.rep_proposal_id,
          checked: true,
          validProposal: true,
        };
      } else {
        return x;
      }
    }),
    relationship: proposal.relationship,
    received_grant_before: proposal.received_grant_before,
    grant_id: proposal.grant_id || "",
    has_fulfilled: proposal.has_fulfilled,
    previous_work: proposal.previous_work || "",
    other_work: proposal.other_work || "",
    received_grant: proposal.received_grant,
    foundational_work: proposal.foundational_work,
    include_membership: proposal.include_membership,
    member_reason: proposal.member_reason || "",
    member_benefit: proposal.member_benefit || "",
    linkedin: proposal.linkedin || "",
    github: proposal.github || "",
    tags: proposal.tags ? proposal.tags.split(",") : [],
    // yesNo1: proposal.yesNo1,
    // yesNo1Exp: proposal.yesNo1Exp || "",
    // yesNo2: proposal.yesNo2,
    // yesNo2Exp: proposal.yesNo2Exp || "",
    // yesNo3: proposal.yesNo3,
    // yesNo3Exp: proposal.yesNo3Exp || "",
    // yesNo4: proposal.yesNo4,
    // yesNo4Exp: proposal.yesNo4Exp || "",
    // formField1: proposal.formField1,
    // formField2: proposal.formField2,
    // purpose: proposal.purpose,
    // purposeOther: proposal.purposeOther || "",
    resume: proposal.resume,
    extra_notes: proposal.extra_notes,
    is_company_or_organization: proposal.is_company_or_organization || 0,
    name_entity: proposal.name_entity,
    entity_country: proposal.entity_country,
    have_mentor: proposal.have_mentor || 0,
    name_mentor: proposal.name_mentor,
    check_mentor: true,
    total_hours_mentor: proposal.total_hours_mentor,
  };
};

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
