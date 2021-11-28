/* eslint-disable no-undef */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import API from "../../../../utils/API";
import './write-comment.scss';

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
            comment: "",
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
            comment: this.state.comment,
            parent_id: parent
        }).then(() => {
            getComments().then(() => {
                this.setState({
                    comment: "",
                    loading: false,
                });

                handleReply && handleReply();
            });
        });
    }

    handleChange = (e) => {
        this.setState({
            comment: e.target.value,
        });
    }

    render() {
        const { loading, comment } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <textarea ref={this.inputRef} className="comment-input" value={comment} onChange={this.handleChange} placeholder="Reply"></textarea>
                <button className="comment-btn" type="submit" disabled={loading}>
                    {loading ? <BeatLoader size={8} color="#fff" /> : 'Reply'}
                </button>
            </form>
        );
    }
}

export default connect(mapStateToProps)(withRouter(WriteComment));
