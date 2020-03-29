import React, { ReactNode } from 'react';
import {
  Rating,
  Comment,
  Role,
  AllowContact,
  NPSResult,
} from './../../src/components/NPS';

interface Props {
  children: (args: {
    onRatingSelect: (rating: Rating) => void;
    onCommentChange: (comment: Comment) => void;
    onFeedbackSubmit: (feedbackSubmission: NPSResult) => void;
    onRoleSelect: (role: Role) => void;
    onAllowContactChange: (allowContact: AllowContact) => void;
    onFollowupSubmit: (followupSubmission: NPSResult) => void;
    onFinish: (finishSubmission: NPSResult) => void;
  }) => ReactNode;
}

interface State extends NPSResult {
  feedbackSubmission: NPSResult | null;
  followupSubmission: NPSResult | null;
  finishSubmission: NPSResult | null;
}

export class WithDataDisplay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      rating: 0,
      comment: null,
      role: null,
      allowContact: false,
      feedbackSubmission: null,
      followupSubmission: null,
      finishSubmission: null,
    };
  }

  onRatingSelect = (rating: Rating) => {
    this.setState({ rating });
  };

  onCommentChange = (comment: Comment) => {
    this.setState({ comment });
  };

  onFeedbackSubmit = (feedbackSubmission: NPSResult) => {
    this.setState({ feedbackSubmission });
  };

  onRoleSelect = (role: Role) => {
    this.setState({ role });
  };

  onAllowContactChange = (allowContact: AllowContact) => {
    this.setState({ allowContact });
  };

  onFollowupSubmit = (followupSubmission: NPSResult) => {
    this.setState({ followupSubmission });
  };

  onFinish = (finishSubmission: NPSResult) => {
    this.setState({ finishSubmission });
  };

  render() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '10px',
            alignItems: 'center',
            backgroundColor: '#DDD',
          }}
        >
          {this.props.children({
            onRatingSelect: this.onRatingSelect,
            onCommentChange: this.onCommentChange,
            onFeedbackSubmit: this.onFeedbackSubmit,
            onRoleSelect: this.onRoleSelect,
            onAllowContactChange: this.onAllowContactChange,
            onFollowupSubmit: this.onFollowupSubmit,
            onFinish: this.onFinish,
          })}
        </div>
        <br /> <br /> <br />
        <h5>Received Values</h5>
        <table>
          <tbody>
            <tr>
              <td>Rating</td>
              {this.state.rating !== null ? (
                <td>{String(this.state.rating)}</td>
              ) : null}
            </tr>
            <tr>
              <td>Comment</td>
              {this.state.comment ? (
                <td>{String(this.state.comment)}</td>
              ) : null}
            </tr>
            <tr>
              <td>Feedback Submission</td>
              {this.state.feedbackSubmission ? (
                <td>{JSON.stringify(this.state.feedbackSubmission)} </td>
              ) : null}
            </tr>
            <tr>
              <td>Role</td>
              {this.state.role ? <td>{String(this.state.role)}</td> : null}
            </tr>
            <tr>
              <td>Allow Contact</td>
              {this.state.allowContact !== null ? (
                <td>{String(this.state.allowContact)}</td>
              ) : null}
            </tr>
            <tr>
              <td>Followup Submission</td>
              {this.state.followupSubmission ? (
                <td>{JSON.stringify(this.state.followupSubmission)} </td>
              ) : null}
            </tr>
            <tr>
              <td>Finish Submission</td>
              {this.state.finishSubmission ? (
                <td>{JSON.stringify(this.state.finishSubmission)} </td>
              ) : null}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
