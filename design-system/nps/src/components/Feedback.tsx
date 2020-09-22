import React, { ReactNode } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import FieldTextArea from '@atlaskit/field-text-area';

import { Description, Header } from './common';
import { Comment, Rating } from './NPS';
import { ButtonWrapper, Wrapper } from './styled/common';
import {
  Scale,
  ScoreContainer,
  Comment as StyledComment,
} from './styled/feedback';

export const CommentBox = ({
  placeholder,
  onCommentChange,
}: {
  placeholder: string;
  onCommentChange: (comment: Comment) => void;
}) => {
  return (
    <StyledComment>
      <FieldTextArea
        autoFocus
        shouldFitContainer
        placeholder={placeholder}
        isLabelHidden
        minimumRows={3}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onCommentChange(e.target.value)
        }
      />
    </StyledComment>
  );
};

export const SendButton = ({
  onClick,
  sendLabel,
}: {
  onClick: () => void;
  sendLabel: ReactNode;
}) => {
  return (
    <ButtonWrapper>
      <Button appearance="primary" onClick={onClick}>
        {sendLabel}
      </Button>
    </ButtonWrapper>
  );
};

export const RatingsButtons = ({
  selected,
  onRatingSelect,
}: {
  selected: Rating | null;
  onRatingSelect: (Rating: Rating) => void;
}) => {
  return (
    <ButtonGroup>
      {Array.from(Array(11), (_, i) => {
        return (
          <Button
            key={`nps-button-rating-${i}`}
            isSelected={selected === i}
            onClick={() => {
              onRatingSelect(i);
            }}
          >
            {i.toString()}
          </Button>
        );
      })}
    </ButtonGroup>
  );
};

export interface FeedbackProps {
  messages: {
    title: ReactNode;
    description: ReactNode;
    optOut: ReactNode;
    scaleLow: ReactNode;
    scaleHigh: ReactNode;
    // Comment placeholder is a string because it gets passed down
    // as a prop to the FieldTextArea placeholder prop, which only accepts a string
    commentPlaceholder: string;
    done: ReactNode;
  };
  canClose: boolean;
  onClose: () => void;
  canOptOut: boolean;
  onOptOut: () => void;
  onRatingSelect: (rating: Rating) => void;
  onCommentChange: (comment: Comment) => void;
  onSubmit: ({
    rating,
    comment,
  }: {
    rating: Rating | null;
    comment: Comment;
  }) => void;
}

interface State {
  rating: Rating | null;
  comment: Comment;
}

export default class Feedback extends React.Component<FeedbackProps, State> {
  constructor(props: FeedbackProps) {
    super(props);
    this.state = {
      rating: null,
      comment: '',
    };
  }

  static defaultProps = {
    onRatingSelect: () => {},
    onCommentChange: () => {},
  };

  onRatingSelect = (rating: Rating) => {
    this.setState({ rating });
    this.props.onRatingSelect(rating);
  };

  onCommentChange = (comment: Comment) => {
    this.setState({ comment });
    this.props.onCommentChange(comment);
  };

  onSubmit = () => {
    const { rating, comment } = this.state;
    this.props.onSubmit({ rating, comment });
  };

  render() {
    const { messages, canClose, onClose, canOptOut, onOptOut } = this.props;
    return (
      <div>
        <Header
          title={messages.title}
          canClose={canClose}
          onClose={onClose}
          canOptOut={canOptOut}
          onOptOut={onOptOut}
          optOutLabel={messages.optOut}
        />
        <Description>{messages.description}</Description>
        <Wrapper>
          <ScoreContainer>
            <Scale>{messages.scaleLow}</Scale>
            <RatingsButtons
              selected={this.state.rating}
              onRatingSelect={this.onRatingSelect}
            />
            <Scale>{messages.scaleHigh}</Scale>
          </ScoreContainer>
        </Wrapper>
        {this.state.rating !== null ? (
          <Wrapper>
            <CommentBox
              placeholder={messages.commentPlaceholder}
              onCommentChange={this.onCommentChange}
            />
            <SendButton onClick={this.onSubmit} sendLabel={messages.done} />
          </Wrapper>
        ) : null}
      </div>
    );
  }
}
