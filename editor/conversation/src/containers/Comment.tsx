import React from 'react';
import { connect } from 'react-redux';
import { SharedProps } from '../components/types';
import { Comment as CommentType } from '../model';
import { getComments, getHighlighted } from '../internal/selectors';
import { State } from '../internal/store';

export interface Props extends SharedProps {
  comment: CommentType;
  conversationId: string;
  objectId?: string;
  containerId?: string;
  renderComment: (props: any) => JSX.Element;
}

const mapStateToProps = (state: State, ownProps: Props) => {
  const comments = getComments(
    state,
    ownProps.conversationId,
    ownProps.comment.commentId,
  );

  const isHighlighted =
    getHighlighted(state) === ownProps.comment.commentId.toString();

  return {
    ...ownProps,
    comments,
    isHighlighted,
  };
};

class CommentContainer extends React.Component<
  Props & { comments: CommentType[] },
  {}
> {
  render() {
    const { renderComment, ...props } = this.props;
    return renderComment(props);
  }
}

export default connect(mapStateToProps)(CommentContainer as any);
