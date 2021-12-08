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

class UpdateComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commentId: props.commentId,
      commentText: props.commentText,
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
      this.setState({ commentText: this.editor.value() });
    });

    this.editor.codemirror.focus();
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const { handleEdit } = this.props;
    const { commentId, commentText } = this.state;

    this.setState({ loading: true });

    API.updateComment(commentId, {
      comment: commentText,
    }).then((res) => {
      if (res?.response?.status === 422) {
        this.setState({
          loading: false,
          errorText: res.response.data.errors.comment[0],
        });

        return;
      }

      this.setState({ loading: false });
      this.editor.value("");

      handleEdit &&
        handleEdit({
          comment: commentText,
          updated_at: res.comment.updated_at,
        });
    });
  };

  render() {
    const { loading, commentText, errorText } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <textarea
          ref={this.inputRef}
          defaultValue={commentText}
          placeholder="What are your toughts?"
        ></textarea>
        <div className="comment-footer">
          <button className="comment-btn" type="submit" disabled={loading}>
            {loading ? <BeatLoader size={8} color="#fff" /> : "Update"}
          </button>
          {errorText && <span className="error-text">{errorText}</span>}
        </div>
      </form>
    );
  }
}

export default connect(mapStateToProps)(withRouter(UpdateComment));
