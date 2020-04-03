import React, { ReactNode } from 'react';
import { NPSWrapper, PageWrapper } from './styled/nps';

export type Rating = number;
export type Comment = string | null;
export type Role = string;
export type AllowContact = boolean;

export interface RenderThankYouProps {
  canClose: boolean;
  canOptOut: boolean;
  onClose: () => void;
  onOptOut: () => void;
}

export interface FeedbackNPS extends RenderThankYouProps {
  onRatingSelect: (Rating: Rating) => void;
  onCommentChange: (Comment: Comment) => void;
  onSubmit: ({
    rating,
    comment,
  }: {
    rating: Rating | null;
    comment: Comment;
  }) => void;
}

export interface FollowUpProps extends RenderThankYouProps {
  onRoleSelect: (role: Role) => void;
  onAllowContactChange: (allowContact: AllowContact) => void;
  onSubmit: ({
    role,
    allowContact,
  }: {
    role: Role | null;
    allowContact: AllowContact;
  }) => void;
}

const Pages = {
  FEEDBACK: 'feedback',
  FOLLOWUP: 'followup',
  THANKYOU: 'thankyou',
};

export interface NPSResult {
  rating: Rating;
  comment?: Comment | null;
  role?: Role | null;
  allowContact?: AllowContact;
}

export interface Props {
  /** Can the survey be dismissed */
  canClose: boolean;

  /** Should the user be given the option to opt out of all future surveys */
  canOptOut: boolean;

  /** Callback called when the user dismisses a survey */
  onClose?: () => void;

  /** Callback called when the user opts out of all future surveys */
  onOptOut?: () => void;

  /** Callback called when the user selects a rating */
  onRatingSelect?: (rating: Rating) => void;

  /** Callback called when the user updates the comment */
  onCommentChange?: (comment: Comment) => void;

  /** Callback called when user selects a role */
  onRoleSelect?: (role: Role) => void;

  /** Callback called when the user updates the allowContact field */
  onAllowContactChange?: (allowContact: AllowContact) => void;

  /** Callback called when the user submits the score/comment portion of the survey */
  onFeedbackSubmit?: (onSubmitFollowUp: NPSResult) => void;

  /** Callback called when the user submits the followup portion of the survey */
  onFollowupSubmit?: (npsResult: NPSResult) => void;

  /** Callback called when the user finishes the survey */
  onFinish?: (npsResult: NPSResult) => void;

  /** Render the feedback page */
  renderFeedback: (feedbackProps: FeedbackNPS) => ReactNode;

  /** Render the followup page */
  renderFollowup: (followUpProps: FollowUpProps) => ReactNode;

  /** Render the thank you page */
  renderThankyou: (renderThankyouProps: RenderThankYouProps) => ReactNode;
}

interface State {
  page: string;
  rating: number | null;
  comment: string | null;
  role: string | null;
  allowContact: boolean;
}

export default class NPS extends React.Component<Props, State> {
  static defaultProps = {
    onClose: () => {},
    onOptOut: () => {},
    onFinish: () => {},
    onRatingSelect: () => {},
    onCommentChange: () => {},
    onRoleSelect: () => {},
    onAllowContactChange: () => {},
    onFeedbackSubmit: () => {},
    onFollowupSubmit: () => {},
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      page: Pages.FEEDBACK,
      rating: null,
      comment: '',
      role: null,
      allowContact: false,
    };
  }

  _getNPSResult(): NPSResult {
    if (this.state.rating === null) {
      throw new Error(
        'Could get create NPSResult from form values, rating is missing',
      );
    }
    const { rating, comment, role, allowContact } = this.state;
    return {
      comment,
      role,
      allowContact,
      rating,
    };
  }

  getPage() {
    const { page } = this.state;
    const { canClose, canOptOut } = this.props;
    switch (page) {
      case Pages.FEEDBACK: {
        const { renderFeedback } = this.props;
        return renderFeedback({
          canClose,
          canOptOut,
          onClose: this.onClose,
          onOptOut: this.onOptOut,
          onRatingSelect: this.onRatingSelect,
          onCommentChange: this.onCommentChange,
          onSubmit: this.onFeedbackSubmit,
        });
      }
      case Pages.FOLLOWUP: {
        const { renderFollowup } = this.props;
        return renderFollowup({
          canClose,
          canOptOut,
          onClose: this.onClose,
          onOptOut: this.onOptOut,
          onRoleSelect: this.onRoleSelect,
          onAllowContactChange: this.onAllowContactChange,
          onSubmit: this.onFollowupSubmit,
        });
      }
      case Pages.THANKYOU: {
        const { renderThankyou } = this.props;
        return renderThankyou({
          canClose,
          canOptOut,
          onClose: this.onClose,
          onOptOut: this.onOptOut,
        });
      }
      default: {
        throw new Error(`Page ${page} not found`);
      }
    }
  }

  onClose = () => {
    this.props.onClose!();
  };

  onOptOut = () => {
    this.props.onOptOut!();
  };

  onRatingSelect = (rating: Rating) => {
    this.setState({ rating });
    this.props.onRatingSelect!(rating);
  };

  onCommentChange = (comment: Comment) => {
    this.setState({ comment });
    this.props.onCommentChange!(comment);
  };

  onFeedbackSubmit = ({
    rating,
    comment,
  }: {
    rating: Rating | null;
    comment: Comment;
  }) => {
    try {
      this.setState({
        rating,
        comment,
        page: Pages.FOLLOWUP,
      });
      const result = this._getNPSResult();
      this.props.onFeedbackSubmit!(result);
    } catch (error) {
      /* Form submitted in invalid state, do nothing */
    }
  };

  onFollowupSubmit = ({
    role,
    allowContact,
  }: {
    role: Role | null;
    allowContact: AllowContact;
  }) => {
    try {
      this.setState({ page: Pages.THANKYOU, role, allowContact });
      const result = this._getNPSResult();
      this.props.onFollowupSubmit!(result);
      this.onFinish();
    } catch (error) {
      /* Form submitted in invalid state, do nothing */
    }
  };

  onRoleSelect = (role: Role) => {
    this.setState({ role });
    this.props.onRoleSelect!(role);
  };

  onAllowContactChange = (allowContact: AllowContact) => {
    this.setState({ allowContact });
    this.props.onAllowContactChange!(allowContact);
  };

  onFinish = () => {
    try {
      const result = this._getNPSResult();
      this.props.onFinish!(result);
    } catch (error) {
      /* Form submitted in invalid state, do nothing */
    }
  };

  render() {
    return (
      <NPSWrapper>
        <PageWrapper>{this.getPage()}</PageWrapper>
      </NPSWrapper>
    );
  }
}
