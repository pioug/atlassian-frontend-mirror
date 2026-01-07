import AkAvatar from '@atlaskit/avatar';
import AkComment, { CommentAction, CommentAuthor, CommentTime } from '@atlaskit/comment';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type { EditorProps } from '@atlaskit/editor-core';
import { type ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { ConnectedReactionsView } from '@atlaskit/reactions';
import { ReactRenderer } from '@atlaskit/renderer';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from 'styled-components';
import type { HttpError } from '../api/HttpError';
import CommentContainer from '../containers/Comment';
import { actionSubjectIds, eventTypes, fireEvent, trackEventActions } from '../internal/analytics';
import type { Comment as CommentType } from '../model/Comment';
import type { User } from '../model/User';
import Editor from './Editor';
import type { SharedProps, RenderEditorWithComments } from './types';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import isEqual from 'lodash/isEqual';

export interface Props extends SharedProps {
	canModerateComment?: boolean;
	comment: CommentType;
	conversationId: string;
	showBeforeUnloadWarning?: boolean;
}

export interface State {
	isEditing?: boolean;
	isReplying?: boolean;
	lastDispatch?: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		args: any[];
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		handler: any;
	};
}

export const DeletedMessage = ({ isAuthor }: { isAuthor?: boolean }): React.JSX.Element => {
	// eslint-disable-next-line @atlaskit/design-system/use-primitives-text, @atlassian/i18n/no-literal-string-in-jsx
	return isAuthor ? <em>Comment deleted by the author</em> : <em>Comment deleted by admin</em>;
};

const commentChanged = (oldComment: CommentType, newComment: CommentType) => {
	if (oldComment.state !== newComment.state) {
		return true;
	}

	if (oldComment.deleted !== newComment.deleted) {
		return true;
	}

	return false;
};

const userChanged = (oldUser: User = { id: '' }, newUser: User = { id: '' }) => {
	return oldUser.id !== newUser.id;
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Reactions: React.ComponentClass<React.HTMLAttributes<Object>> = styled.div({
	height: '20px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div': {
		height: '20px',
	},
});

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class Comment extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			isEditing: false,
		};

		const { comment, renderAdditionalCommentActions } = this.props;
		if (typeof renderAdditionalCommentActions === 'function') {
			this.additionalCommentActions = renderAdditionalCommentActions(CommentAction, comment) || [];
		}
	}

	private additionalCommentActions: JSX.Element[] = [];

	shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
		const { isEditing, isReplying } = this.state;
		const { isHighlighted, portal, comment, maxCommentNesting, renderEditor } = this.props;

		let editorChanged = false;
		if (
			nextProps.maxCommentNesting !== maxCommentNesting ||
			nextProps.renderEditor !== renderEditor
		) {
			editorChanged = true;
		}

		let additionalCommentActions: JSX.Element[] = [];
		let additionalCommentsChanged = false;
		if (typeof nextProps.renderAdditionalCommentActions === 'function') {
			additionalCommentActions =
				nextProps.renderAdditionalCommentActions(CommentAction, nextProps.comment || comment) || [];
		}

		if (!isEqual(additionalCommentActions, this.additionalCommentActions)) {
			this.additionalCommentActions = additionalCommentActions;
			additionalCommentsChanged = true;
		}

		if (
			nextState.isEditing !== isEditing ||
			nextState.isReplying !== isReplying ||
			nextProps.isHighlighted !== isHighlighted ||
			nextProps.portal !== portal ||
			editorChanged ||
			additionalCommentsChanged
		) {
			return true;
		}

		if (commentChanged(this.props.comment, nextProps.comment)) {
			return true;
		}

		if (userChanged(this.props.user, nextProps.user)) {
			return true;
		}

		const { comments: oldComments = [] } = this.props;
		const { comments: newComments = [] } = nextProps;

		if (oldComments.length !== newComments.length) {
			return true;
		}

		if (
			newComments.some((newComment) => {
				const [oldComment] = oldComments.filter(
					(oldComment) =>
						oldComment.commentId === newComment.commentId ||
						oldComment.localId === newComment.localId,
				);
				const isBrandNewComment = !oldComment;
				return isBrandNewComment || commentChanged(oldComment, newComment);
			})
		) {
			return true;
		}

		return false;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private dispatch = (dispatch: string, ...args: any[]) => {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const handler = (this.props as any)[dispatch];

		if (handler) {
			handler.apply(handler, args);

			this.setState({
				lastDispatch: { handler: dispatch, args },
			});
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private onReply = (_event: any, analyticsEvent?: UIAnalyticsEvent) => {
		const { objectId, containerId } = this.props;

		analyticsEvent &&
			fireEvent(analyticsEvent, {
				actionSubjectId: actionSubjectIds.replyButton,
				objectId,
				containerId,
			});

		this.setState({
			isReplying: true,
		});
	};

	// Ignored via go/ees005
	// eslint-disable-next-line require-await, @typescript-eslint/no-explicit-any
	private onSaveReply = async (value: any) => {
		const { conversationId, comment: parentComment, sendAnalyticsEvent } = this.props;

		sendAnalyticsEvent({
			actionSubjectId: actionSubjectIds.saveButton,
		});

		this.dispatch(
			'onAddComment',
			conversationId,
			parentComment.commentId,
			value,
			undefined,
			(id: string) => {
				sendAnalyticsEvent({
					actionSubjectId: id,
					action: trackEventActions.created,
					eventType: eventTypes.TRACK,
					actionSubject: 'comment',
					attributes: {
						nestedDepth: (parentComment.nestedDepth || 0) + 1,
					},
				});
			},
		);

		this.setState({
			isReplying: false,
		});
	};

	private onCancelReply = () => {
		this.props.sendAnalyticsEvent({
			actionSubjectId: actionSubjectIds.cancelButton,
		});

		this.setState({
			isReplying: false,
		});
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private onDelete = (_value: any, analyticsEvent?: UIAnalyticsEvent) => {
		const {
			comment: { nestedDepth, commentId },
			objectId,
			containerId,
			conversationId,
			sendAnalyticsEvent,
		} = this.props;

		analyticsEvent &&
			fireEvent(analyticsEvent, {
				actionSubjectId: actionSubjectIds.deleteButton,
				objectId,
				containerId,
			});

		this.dispatch('onDeleteComment', conversationId, commentId, (id: string) => {
			sendAnalyticsEvent({
				actionSubjectId: id,
				action: trackEventActions.deleted,
				eventType: eventTypes.TRACK,
				actionSubject: 'comment',
				attributes: {
					nestedDepth: nestedDepth || 0,
				},
			});
		});
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private onEdit = (_value: any, analyticsEvent?: UIAnalyticsEvent) => {
		const { objectId, containerId } = this.props;

		analyticsEvent &&
			fireEvent(analyticsEvent, {
				actionSubjectId: actionSubjectIds.editButton,
				objectId,
				containerId,
			});

		this.setState({
			isEditing: true,
		});
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private handleCommentEditorChange = (value: any) => {
		const { comment } = this.props;

		this.dispatch('onEditorChange', value, comment.commentId);
	};

	// Ignored via go/ees005
	// eslint-disable-next-line require-await, @typescript-eslint/no-explicit-any
	private onSaveEdit = async (value: any) => {
		const { conversationId, comment, sendAnalyticsEvent } = this.props;

		sendAnalyticsEvent({
			actionSubjectId: actionSubjectIds.saveButton,
		});

		this.dispatch('onUpdateComment', conversationId, comment.commentId, value, (id: string) => {
			sendAnalyticsEvent({
				actionSubjectId: id,
				action: trackEventActions.updated,
				eventType: eventTypes.TRACK,
				actionSubject: 'comment',
				attributes: {
					nestedDepth: comment.nestedDepth || 0,
				},
			});
		});

		this.setState({
			isEditing: false,
		});
	};

	private onCancelEdit = () => {
		this.props.sendAnalyticsEvent({
			actionSubjectId: actionSubjectIds.cancelButton,
		});

		this.setState({
			isEditing: false,
		});
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private onRequestCancel = (_value: any, analyticsEvent?: UIAnalyticsEvent) => {
		const { comment, onCancel, objectId, containerId } = this.props;

		// Invoke optional onCancel hook
		if (onCancel) {
			onCancel();
		}

		analyticsEvent &&
			fireEvent(analyticsEvent, {
				actionSubjectId: actionSubjectIds.cancelFailedRequestButton,
				objectId,
				containerId,
			});

		this.dispatch('onRevertComment', comment.conversationId, comment.commentId);
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private onRequestRetry = (_value: any, analyticsEvent?: UIAnalyticsEvent) => {
		const { lastDispatch } = this.state;
		const {
			objectId,
			containerId,
			onRetry,
			comment: { localId, isPlaceholder },
		} = this.props;

		if (onRetry && isPlaceholder) {
			return onRetry(localId);
		}

		analyticsEvent &&
			fireEvent(analyticsEvent, {
				actionSubjectId: actionSubjectIds.retryFailedRequestButton,
				objectId,
				containerId,
			});

		if (!lastDispatch) {
			return;
		}

		this.dispatch(lastDispatch.handler, ...lastDispatch.args);
	};

	/**
	 * Username click handler - pass a User object, returns a handler which will invoke onUserClick with it
	 * @param {User} user
	 */
	private handleUserClick = (user: User) => () => {
		const { onUserClick } = this.props;
		if (onUserClick && typeof onUserClick === 'function') {
			onUserClick(user);
		}
	};

	private getContent() {
		const {
			comment,
			dataProviders,
			user,
			renderEditor,
			disableScrollTo,
			allowFeedbackAndHelpButtons,
			onEditorClose,
			onEditorOpen,
			portal,
			showBeforeUnloadWarning,
		} = this.props;
		const { isEditing } = this.state;
		const { createdBy } = comment;
		const isAuthor = user && createdBy && user.id === createdBy.id;

		if (comment.deleted) {
			return <DeletedMessage isAuthor={isAuthor} />;
		}

		if (isEditing) {
			return (
				<Editor
					defaultValue={comment.document.adf}
					isExpanded={true}
					isEditing={isEditing}
					onSave={this.onSaveEdit}
					onCancel={this.onCancelEdit}
					onClose={onEditorClose}
					onOpen={onEditorOpen}
					onChange={this.handleCommentEditorChange}
					dataProviders={dataProviders}
					user={user}
					renderEditor={renderEditor}
					disableScrollTo={disableScrollTo}
					allowFeedbackAndHelpButtons={allowFeedbackAndHelpButtons}
					showBeforeUnloadWarning={showBeforeUnloadWarning}
				/>
			);
		}

		return (
			<ReactRenderer
				document={comment.document.adf}
				dataProviders={dataProviders}
				disableHeadingIDs={true}
				portal={portal}
			/>
		);
	}

	private getAfterContent() {
		const { renderAfterComment, comment } = this.props;

		return typeof renderAfterComment === 'function' ? renderAfterComment(comment) : null;
	}

	private renderComments() {
		const { comment, comments, ...otherCommentProps } = this.props;

		if (!comments || comments.length === 0) {
			return null;
		}

		return comments.map((child) => (
			<CommentContainer
				key={child.localId}
				comment={child}
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				renderComment={(props) => <Comment {...props} />}
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...otherCommentProps}
			/>
		));
	}

	private renderEditorWithComment = (Editor: typeof ComposableEditor, editorProps: EditorProps) => {
		const { comment, renderEditor } = this.props;
		// type overridden here because renderEditorWithComment is only called if props.renderEditor is truthy.
		const renderEditorAlways = renderEditor as RenderEditorWithComments;
		return renderEditorAlways(Editor, editorProps, comment);
	};

	private renderEditor() {
		const { isReplying } = this.state;
		if (!isReplying) {
			return null;
		}

		const {
			dataProviders,
			user,
			renderEditor,
			disableScrollTo,
			allowFeedbackAndHelpButtons,
			onEditorClose,
			onEditorOpen,
			showBeforeUnloadWarning,
		} = this.props;

		return (
			<Editor
				isExpanded={true}
				onCancel={this.onCancelReply}
				onSave={this.onSaveReply}
				dataProviders={dataProviders}
				onOpen={onEditorOpen}
				onClose={onEditorClose}
				onChange={this.handleCommentEditorChange}
				user={user}
				renderEditor={renderEditor ? this.renderEditorWithComment : undefined}
				disableScrollTo={disableScrollTo}
				allowFeedbackAndHelpButtons={allowFeedbackAndHelpButtons}
				showBeforeUnloadWarning={showBeforeUnloadWarning}
			/>
		);
	}

	private getActions() {
		const { comment, user, dataProviders, objectId, canModerateComment } = this.props;
		const { isEditing } = this.state;
		const canReply = !!user && !isEditing && !comment.deleted;

		if (!canReply) {
			return undefined;
		}

		const { createdBy, commentAri } = comment;
		let actions = [
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
			<CommentAction key="reply" onClick={this.onReply}>
				Reply
			</CommentAction>,
		];
		const editAction = (
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
			<CommentAction key="edit" onClick={this.onEdit}>
				Edit
			</CommentAction>
		);
		const deleteAction = (
			// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
			<CommentAction key="delete" onClick={this.onDelete}>
				Delete
			</CommentAction>
		);

		if (createdBy && user && user.id === createdBy.id) {
			actions = [...actions, editAction, deleteAction];
		} else if (user && canModerateComment) {
			actions = [...actions, deleteAction];
		}

		if (this.additionalCommentActions && this.additionalCommentActions.length) {
			actions = [...actions, ...this.additionalCommentActions];
		}

		if (
			objectId &&
			commentAri &&
			dataProviders &&
			dataProviders.hasProvider('reactionsStore') &&
			dataProviders.hasProvider('emojiProvider')
		) {
			actions = [
				...actions,
				<WithProviders
					key="reactions"
					providers={['emojiProvider', 'reactionsStore']}
					providerFactory={dataProviders}
					renderNode={({ emojiProvider, reactionsStore }) => {
						if (typeof emojiProvider === 'undefined' || typeof reactionsStore === 'undefined') {
							return null;
						}
						return (
							<Reactions>
								<ConnectedReactionsView
									store={reactionsStore}
									containerAri={objectId}
									ari={commentAri}
									emojiProvider={emojiProvider}
								/>
							</Reactions>
						);
					}}
				/>,
			];
		}

		return actions;
	}

	private handleTimeClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
		const { comment, onHighlightComment, disableScrollTo } = this.props;

		if (!disableScrollTo && comment && onHighlightComment) {
			onHighlightComment(event, comment.commentId);
		}
	};

	private renderAuthor() {
		const { comment, onUserClick } = this.props;
		const { createdBy } = comment;

		return (
			<CommentAuthor
				onClick={onUserClick && this.handleUserClick(createdBy)}
				href={onUserClick ? '#' : createdBy.profileUrl}
			>
				{createdBy && createdBy.name}
			</CommentAuthor>
		);
	}

	render(): React.JSX.Element {
		const { comment, isHighlighted, disableScrollTo, maxCommentNesting } = this.props;
		const { createdBy, state: commentState, error } = comment;
		const errorProps: {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			actions?: any[];
			message?: string;
		} = {};

		if (error) {
			errorProps.actions = [];

			if ((error as HttpError).canRetry) {
				errorProps.actions = [
					// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
					<CommentAction key="retry" onClick={this.onRequestRetry}>
						Retry
					</CommentAction>,
				];
			}

			errorProps.actions = [
				...errorProps.actions,
				// eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx
				<CommentAction key="cancel" onClick={this.onRequestCancel}>
					Cancel
				</CommentAction>,
			];

			errorProps.message = error.message;
		}

		const comments = this.renderComments();
		const editor = this.renderEditor();
		const commentId = disableScrollTo ? undefined : `comment-${comment.commentId}`;

		return (
			<AkComment
				id={commentId}
				author={this.renderAuthor()}
				avatar={
					<AkAvatar
						src={createdBy && createdBy.avatarUrl}
						href={createdBy && createdBy.profileUrl}
						name={createdBy && createdBy.name}
					/>
				}
				type={createdBy && createdBy.type}
				time={
					<CommentTime
						onClick={this.handleTimeClick}
						href={disableScrollTo ? undefined : `#${commentId}`}
					>
						{formatDistanceToNow(new Date(comment.createdAt), {
							addSuffix: true,
						})}
					</CommentTime>
				}
				shouldRenderNestedCommentsInline={
					maxCommentNesting !== undefined && comment.nestedDepth !== undefined
						? comment.nestedDepth >= maxCommentNesting
						: false
				}
				actions={this.getActions()}
				content={this.getContent()}
				afterContent={this.getAfterContent()}
				isSaving={commentState === 'SAVING'}
				isError={commentState === 'ERROR'}
				errorActions={errorProps.actions}
				errorIconLabel={errorProps.message}
				highlighted={isHighlighted}
			>
				{editor || comments ? (
					<div>
						{comments}
						{editor}
					</div>
				) : null}
			</AkComment>
		);
	}
}
