import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  CardBody,
  CardHeader,
  Card,
  PageHeaderComponent,
  GlobalRelativeCanvasComponent,
} from "../../../components";
import "./topic-detail.scss";
import "../shared/proposal-posts/proposal-posts.scss";
import TopicPosts from "../shared/topic-posts/TopicPosts";
import API from "../../../utils/API";

class TopicDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: {},
      loading: true,
    };
  }

  componentDidMount() {
    const { match } = this.props;

    API.getTopic(match.params.topic).then((res) => {
      this.setState({
        loading: false,
        topic: res.data,
      });
    });
  }

  // Render Header
  renderHeader() {
    const { topic } = this.state;
    if (!topic || !topic.id) return null;

    const title = topic.title;

    // Owner
    if (topic.details.can_edit) {
      return (
        <PageHeaderComponent
          title={title}
          buttonData={{
            link: `/app/topics/${topic.id}/edit`,
            text: "Edit Topic",
          }}
        />
      );
    }

    // Not Owner
    return <PageHeaderComponent title={title} />;
  }

  // Render Content
  render() {
    const { loading, topic } = this.state;

    if (loading) return <GlobalRelativeCanvasComponent />;
    if (!topic || !topic.id) return <div>{`We can't find any details`}</div>;

    return (
      <section id="app-topic-detail-page">
        <div id="discourse-posts">
          {this.renderHeader()}
          <Card isAutoExpand={true}>
            <CardHeader>Posts</CardHeader>
            <CardBody>
              <TopicPosts topic={topic} />
            </CardBody>
          </Card>
        </div>
      </section>
    );
  }
}

export default withRouter(TopicDetail);
