/* eslint-disable no-undef */
import EasyMDE from "easymde";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import API from "../../../../utils/API";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    settings: state.global.settings,
    editMode: state.admin.editMode,
  };
};

class WritePost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postText: "",
      errorText: null,
      loading: false,
    };

    this.editor = React.createRef(null);
    this.inputRef = React.createRef(null);
  }

  componentDidMount() {
    this.editor = new EasyMDE({
      element: this.inputRef.current,
      toolbar: [
        "bold",
        "italic",
        "strikethrough",
        "heading-3",
        "|",
        "unordered-list",
        "ordered-list",
        "|",
        "image",
        "preview",
      ],
      spellChecker: false,
      maxHeight: "100px",
      status: false,
    });

    this.editor.codemirror.on("change", () => {
      this.setState({ postText: this.editor.value() });
    });

    this.editor.codemirror.focus();
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { parent, topicId, promise, callback } = this.props;

    this.setState({ loading: true });

    API.submitPost(topicId, {
      post: this.state.postText,
      reply_to_post_number: parent,
    }).then((res) => {
      if (res?.failed) {
        this.setState({ errorText: res.message, loading: false });
        return;
      }

      promise(res)
        .then((res) => {
          this.setState({
            postText: "",
            errorText: "",
          });

          this.editor.value("");

          callback && callback(res.data);
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    });
  };

  render() {
    const { loading, postText, errorText } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <textarea
          ref={this.inputRef}
          defaultValue={postText}
          placeholder="What are your toughts?"
        ></textarea>
        <div className="post-footer">
          <button className="post-btn" type="submit" disabled={loading}>
            {loading ? <BeatLoader size={8} color="#fff" /> : "Reply"}
          </button>
          {errorText && <span className="error-text">{errorText}</span>}
        </div>
      </form>
    );
  }
}

export default connect(mapStateToProps)(withRouter(WritePost));
