import React from 'react';
import { connect } from 'react-redux';
import { type SharedProps } from '../components/types';
import { type Comment as CommentType } from '../model/Comment';
import { getComments, getHighlighted } from '../internal/selectors';
import { type State } from '../internal/store';

export interface Props extends SharedProps {
	comment: CommentType;
	containerId?: string;
	conversationId: string;
	objectId?: string;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	renderComment: (props: any) => JSX.Element;
}

const mapStateToProps = (state: State, ownProps: Props) => {
	const comments = getComments(state, ownProps.conversationId, ownProps.comment.commentId);

	const isHighlighted = getHighlighted(state) === ownProps.comment.commentId.toString();

	return {
		...ownProps,
		comments,
		isHighlighted,
	};
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class CommentContainer extends React.Component<Props & { comments: CommentType[] }, Object> {
	render() {
		const { renderComment, ...props } = this.props;
		return renderComment(props);
	}
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default connect(mapStateToProps)(CommentContainer as any);
