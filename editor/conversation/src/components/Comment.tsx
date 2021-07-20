import AkAvatar from '@atlaskit/avatar';
import AkComment, {
  CommentAction,
  CommentAuthor,
  CommentTime,
} from '@atlaskit/comment';
import { WithProviders } from '@atlaskit/editor-common';
import { Editor as AkEditor, EditorProps } from '@atlaskit/editor-core';
import { ConnectedReactionsView } from '@atlaskit/reactions';
import { ReactRenderer } from '@atlaskit/renderer';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import React from 'react';
import styled from 'styled-components';
import { HttpError } from '../api/HttpError';
import CommentContainer from '../containers/Comment';
import {
  actionSubjectIds,
  eventTypes,
  fireEvent,
  trackEventActions,
} from '../internal/analytics';
import { Comment as CommentType, User } from '../model';
import Editor from './Editor';
import { SharedProps, RenderEditorWithComments } from './types';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import isEqual from 'lodash/isEqual';

export interface Props extends SharedProps {
  conversationId: string;
  canModerateComment?: boolean;
  comment: CommentType;
  showBeforeUnloadWarning?: boolean;
}

export interface State {
  isEditing?: boolean;
  isReplying?: boolean;
  lastDispatch?: {
    handler: any;
    args: any[];
  };
}

export const DeletedMessage = ({ isAuthor }: { isAuthor?: boolean }) => {
  return isAuthor ? (
    <em>Comment deleted by the author</em>
  ) : (
    <em>Comment deleted by admin</em>
  );
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

const userChanged = (
  oldUser: User = { id: '' },
  newUser: User = { id: '' },
) => {
  return oldUser.id !== newUser.id;
};

const Reactions: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  height: 20px;
  & > div {
    height: 20px;
  }
`;

export default class Comment extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isEditing: false,
    };

    const { comment, renderAdditionalCommentActions } = this.props;
    if (typeof renderAdditionalCommentActions === 'function') {
      this.additionalCommentActions =
        renderAdditionalCommentActions(CommentAction, comment) || [];
    }
  }

  private additionalCommentActions: JSX.Element[] = [];

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const { isEditing, isReplying } = this.state;
    const {
      isHighlighted,
      portal,
      comment,
      maxCommentNesting,
      renderEditor,
    } = this.props;

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
        nextProps.renderAdditionalCommentActions(
          CommentAction,
          nextProps.comment || comment,
        ) || [];
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

  private dispatch = (dispatch: string, ...args: any[]) => {
    const handler = (this.props as any)[dispatch];

    if (handler) {
      handler.apply(handler, args);

      this.setState({
        lastDispatch: { handler: dispatch, args },
      });
    }
  };

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

  private onSaveReply = async (value: any) => {
    const {
      conversationId,
      comment: parentComment,
      sendAnalyticsEvent,
    } = this.props;

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

    this.dispatch(
      'onDeleteComment',
      conversationId,
      commentId,
      (id: string) => {
        sendAnalyticsEvent({
          actionSubjectId: id,
          action: trackEventActions.deleted,
          eventType: eventTypes.TRACK,
          actionSubject: 'comment',
          attributes: {
            nestedDepth: nestedDepth || 0,
          },
        });
      },
    );
  };

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

  private handleCommentEditorChange = (value: any) => {
    const { comment } = this.props;

    this.dispatch('onEditorChange', value, comment.commentId);
  };

  private onSaveEdit = async (value: any) => {
    const { conversationId, comment, sendAnalyticsEvent } = this.props;

    sendAnalyticsEvent({
      actionSubjectId: actionSubjectIds.saveButton,
    });

    this.dispatch(
      'onUpdateComment',
      conversationId,
      comment.commentId,
      value,
      (id: string) => {
        sendAnalyticsEvent({
          actionSubjectId: id,
          action: trackEventActions.updated,
          eventType: eventTypes.TRACK,
          actionSubject: 'comment',
          attributes: {
            nestedDepth: comment.nestedDepth || 0,
          },
        });
      },
    );

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

  private onRequestCancel = (
    _value: any,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
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

    return typeof renderAfterComment === 'function'
      ? renderAfterComment(comment)
      : null;
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
        renderComment={(props) => <Comment {...props} />}
        {...otherCommentProps}
      />
    ));
  }

  private renderEditorWithComment = (
    Editor: typeof AkEditor,
    editorProps: EditorProps,
  ) => {
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
    const {
      comment,
      user,
      dataProviders,
      objectId,
      canModerateComment,
    } = this.props;
    const { isEditing } = this.state;
    const canReply = !!user && !isEditing && !comment.deleted;

    if (!canReply) {
      return undefined;
    }

    const { createdBy, commentAri } = comment;
    let actions = [
      <CommentAction key="reply" onClick={this.onReply}>
        Reply
      </CommentAction>,
    ];
    const editAction = (
      <CommentAction key="edit" onClick={this.onEdit}>
        Edit
      </CommentAction>
    );
    const deleteAction = (
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
            if (
              typeof emojiProvider === 'undefined' ||
              typeof reactionsStore === 'undefined'
            ) {
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

  render() {
    const {
      comment,
      isHighlighted,
      disableScrollTo,
      maxCommentNesting,
    } = this.props;
    const { createdBy, state: commentState, error } = comment;
    const errorProps: {
      actions?: any[];
      message?: string;
    } = {};

    if (error) {
      errorProps.actions = [];

      if ((error as HttpError).canRetry) {
        errorProps.actions = [
          <CommentAction key="retry" onClick={this.onRequestRetry}>
            Retry
          </CommentAction>,
        ];
      }

      errorProps.actions = [
        ...errorProps.actions,
        <CommentAction key="cancel" onClick={this.onRequestCancel}>
          Cancel
        </CommentAction>,
      ];

      errorProps.message = error.message;
    }

    const comments = this.renderComments();
    const editor = this.renderEditor();
    const commentId = disableScrollTo
      ? undefined
      : `comment-${comment.commentId}`;

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
