/* eslint-disable no-undef */
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

class WriteComment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            commentText: '',
            errorText: null,
            loading: false,
        };

        this.inputRef = React.createRef();
    }

    componentDidMount() {
        this.inputRef.current.focus();
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { parent, proposal, getComments, handleReply } = this.props;

        this.setState({ loading: true });

        API.submitComment(proposal.id, {
            comment: this.state.commentText,
            parent_id: parent
        }).then((res) => {
            if (res?.response?.status === 422) {
                this.setState({
                    loading: false,
                    errorText: res.response.data.errors.comment[0],
                });

                return;
            }

            getComments().then(() => {
                this.setState({
                    commentText: '',
                    errorText: '',
                    loading: false,
                });

                handleReply && handleReply();
            });
        });
    }

    handleChange = (e) => {
        this.setState({
            commentText: e.target.value,
        });
    }

    render() {
        const { loading, commentText, errorText } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <textarea
                    ref={this.inputRef}
                    className="comment-input"
                    value={commentText}
                    onChange={this.handleChange}
                    placeholder="Reply"
                ></textarea>
                <div className="comment-footer">
                    <button className="comment-btn" type="submit" disabled={loading}>
                        {loading ? <BeatLoader size={8} color="#fff" /> : 'Reply'}
                    </button>
                    {errorText && <span className="error-text">{errorText}</span>}
                </div>
            </form>
        );
    }
}

export default connect(mapStateToProps)(withRouter(WriteComment));
