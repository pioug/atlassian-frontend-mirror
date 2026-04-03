import React from 'react';
import { connect } from 'react-redux';
import type { Component, ComponentClass, DispatchProp, Omit } from 'react-redux';
import type {
	RenderEditorWithComments,
	SendAnalyticsEvent,
	SharedProps,
} from '../components/types';
import type { Comment as CommentType } from '../model/Comment';
import { getComments, getHighlighted } from '../internal/selectors';
import type { State } from '../internal/store';
import type { CommentActionItemProps } from '@atlaskit/comment';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { SuccessHandler } from '../internal/actions';
import type { User } from '../model/User';

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
const _default_1: ComponentClass<
	Omit<
		{
			allowFeedbackAndHelpButtons?: boolean;
			comment: CommentType;
			comments: CommentType[];
			containerId?: string;
			conversationId: string;
			dataProviders?: ProviderFactory;
			disableScrollTo?: boolean;
			isHighlighted: boolean;
			maxCommentNesting?: number;
			objectId?: string;
			onAddComment?: (
				conversationId: string,
				parentId: string,
				value: unknown,
				localId?: string,
				onSuccess?: SuccessHandler,
			) => void;
			onCancel?: () => void;
			onCancelComment?: (conversationId: string, commentId: string) => void;
			onCommentPermalinkClick?: (
				event: React.MouseEvent<HTMLAnchorElement>,
				commentId: string,
			) => void;
			onDeleteComment?: (
				conversationId: string,
				commentId: string,
				onSuccess?: SuccessHandler,
			) => void;
			onEditorChange?: (
				isLocal: boolean,
				value: unknown,
				conversationId: string,
				commentId: string | undefined,
				meta: unknown,
				objectId: string,
				containerId?: string,
			) => void;
			onEditorClose?: () => void;
			onEditorOpen?: () => void;
			onHighlightComment?: (event: React.MouseEvent<HTMLAnchorElement>, commentId: string) => void;
			onRetry?: (localId?: string) => void;
			onRevertComment?: (conversationId: string, commentId: string) => void;
			onUpdateComment?: (
				conversationId: string,
				commentId: string,
				value: unknown,
				onSuccess?: SuccessHandler,
			) => void;
			onUserClick?: (user: User) => void;
			placeholder?: string;
			portal?: HTMLElement;
			renderAdditionalCommentActions?: (
				CommentAction: React.ForwardRefExoticComponent<
					Omit<CommentActionItemProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
				>,
				comment: CommentType,
			) => JSX.Element[];
			renderAfterComment?: (comment: CommentType) => JSX.Element;
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			renderComment: (props: any) => JSX.Element;
			renderEditor?: RenderEditorWithComments;
			sendAnalyticsEvent: SendAnalyticsEvent;
			user?: User;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Redux connect typings
		} & DispatchProp<any> &
			Props,
		'dispatch' | keyof Props
	> &
		Props
> & {
	WrappedComponent: Component<
		{
			allowFeedbackAndHelpButtons?: boolean;
			comment: CommentType;
			comments: CommentType[];
			containerId?: string;
			conversationId: string;
			dataProviders?: ProviderFactory;
			disableScrollTo?: boolean;
			isHighlighted: boolean;
			maxCommentNesting?: number;
			objectId?: string;
			onAddComment?: (
				conversationId: string,
				parentId: string,
				value: unknown,
				localId?: string,
				onSuccess?: SuccessHandler,
			) => void;
			onCancel?: () => void;
			onCancelComment?: (conversationId: string, commentId: string) => void;
			onCommentPermalinkClick?: (
				event: React.MouseEvent<HTMLAnchorElement>,
				commentId: string,
			) => void;
			onDeleteComment?: (
				conversationId: string,
				commentId: string,
				onSuccess?: SuccessHandler,
			) => void;
			onEditorChange?: (
				isLocal: boolean,
				value: unknown,
				conversationId: string,
				commentId: string | undefined,
				meta: unknown,
				objectId: string,
				containerId?: string,
			) => void;
			onEditorClose?: () => void;
			onEditorOpen?: () => void;
			onHighlightComment?: (event: React.MouseEvent<HTMLAnchorElement>, commentId: string) => void;
			onRetry?: (localId?: string) => void;
			onRevertComment?: (conversationId: string, commentId: string) => void;
			onUpdateComment?: (
				conversationId: string,
				commentId: string,
				value: unknown,
				onSuccess?: SuccessHandler,
			) => void;
			onUserClick?: (user: User) => void;
			placeholder?: string;
			portal?: HTMLElement;
			renderAdditionalCommentActions?: (
				CommentAction: React.ForwardRefExoticComponent<
					Omit<CommentActionItemProps, 'ref'> & React.RefAttributes<HTMLSpanElement>
				>,
				comment: CommentType,
			) => JSX.Element[];
			renderAfterComment?: (comment: CommentType) => JSX.Element;
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			renderComment: (props: any) => JSX.Element;
			renderEditor?: RenderEditorWithComments;
			sendAnalyticsEvent: SendAnalyticsEvent;
			user?: User;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Redux connect typings
		} & DispatchProp<any> &
			Props
	>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Redux connect typings
} = connect(mapStateToProps)(CommentContainer as any);
export default _default_1;
