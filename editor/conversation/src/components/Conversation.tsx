import React from 'react';
import CommentContainer from '../containers/Comment';
import Comment from '../components/Comment';
import Editor from './Editor';
import { Conversation as ConversationType } from '../model';
import { SharedProps, SendAnalyticsEvent } from './types';
import {
  createAnalyticsEvent,
  actionSubjectIds,
  fireEvent,
  trackEventActions,
  eventTypes,
} from '../internal/analytics';
import { SuccessHandler } from '../internal/actions';

export interface Props extends SharedProps {
  id?: string;
  localId?: string;
  conversation?: ConversationType;
  objectId: string;
  containerId?: string;
  showBeforeUnloadWarning?: boolean;

  // Dispatch
  onCreateConversation?: (
    localId: string,
    value: any,
    meta: any,
    objectId: string,
    containerId?: string,
    onSuccess?: SuccessHandler,
  ) => void;

  isExpanded?: boolean;
  meta?: {
    [key: string]: any;
  };
  createAnalyticsEvent: createAnalyticsEvent;

  portal?: HTMLElement;
  canModerateComments?: boolean;
}

export interface State {
  openEditorCount: number;
}

export default class Conversation extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      openEditorCount: 0,
    };
  }

  static defaultProps = {
    placeholder: 'What do you want to say?',
    onEditorOpen: () => {},
    onEditorClose: () => {},
  };

  /*
    TODO: Remove me when editor is instrumented
    Only use this method when instrumenting something that isn't instrumented itself (like Editor)
    Once editor is instrumented use the analyticsEvent passed in by editor instead.

    nestedDepth is always 0 when using the save handlers in this file.
    Because a new comment created on the conversation itself is always going to be the top comment.

    @deprecated
  */
  sendEditorAnalyticsEvent: SendAnalyticsEvent = (eventData) => {
    const { createAnalyticsEvent, objectId, containerId } = this.props;

    const analyticsEvent = createAnalyticsEvent({
      actionSubject: 'editor',
      action: 'clicked',
    });

    fireEvent(analyticsEvent, { objectId, containerId, ...eventData });
  };

  private renderComments() {
    const {
      comments,
      conversation,
      onAddComment,
      onUpdateComment,
      onDeleteComment,
      onRevertComment,
      onUserClick,
      onCancel,
      user,
      dataProviders,
      renderEditor,
      objectId,
      containerId,
      placeholder,
      disableScrollTo,
      allowFeedbackAndHelpButtons,
      portal,
      canModerateComments,
      renderAdditionalCommentActions,
      renderAfterComment,
      maxCommentNesting,
    } = this.props;

    if (!conversation) {
      return;
    }

    const { conversationId } = conversation;

    return (comments || []).map((comment) => (
      <CommentContainer
        key={comment.commentId}
        conversationId={conversationId}
        comment={comment}
        user={user}
        onAddComment={onAddComment}
        onUpdateComment={onUpdateComment}
        onDeleteComment={onDeleteComment}
        onRevertComment={onRevertComment}
        onEditorOpen={this.onEditorOpen}
        onEditorClose={this.onEditorClose}
        onEditorChange={this.handleEditorChange}
        onHighlightComment={this.onHighlightComment}
        onRetry={this.onRetry(comment.document)}
        onCancel={onCancel}
        onUserClick={onUserClick}
        dataProviders={dataProviders}
        renderComment={(props) => (
          <Comment
            {...props}
            canModerateComment={canModerateComments}
            renderAdditionalCommentActions={renderAdditionalCommentActions}
            renderAfterComment={renderAfterComment}
          />
        )}
        maxCommentNesting={maxCommentNesting}
        renderEditor={renderEditor}
        objectId={objectId}
        containerId={containerId}
        placeholder={placeholder}
        disableScrollTo={disableScrollTo}
        sendAnalyticsEvent={this.sendEditorAnalyticsEvent}
        allowFeedbackAndHelpButtons={allowFeedbackAndHelpButtons}
        portal={portal}
      />
    ));
  }

  private onCancel = () => {
    this.sendEditorAnalyticsEvent({
      actionSubjectId: actionSubjectIds.cancelButton,
    });

    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  private renderConversationsEditor() {
    const {
      isExpanded,
      meta,
      dataProviders,
      user,
      conversation,
      renderEditor,
      placeholder,
      disableScrollTo,
      allowFeedbackAndHelpButtons,
      showBeforeUnloadWarning,
    } = this.props;
    const isInline = !!meta;
    const hasConversation = !!conversation;
    const canReply = !!user && (!isInline || (isExpanded && !hasConversation));

    if (canReply) {
      return (
        <Editor
          isExpanded={isExpanded}
          onSave={this.onSave}
          onCancel={this.onCancel}
          onOpen={this.onEditorOpen}
          onClose={this.onEditorClose}
          onChange={this.handleEditorChange}
          dataProviders={dataProviders}
          user={user}
          renderEditor={renderEditor}
          placeholder={placeholder}
          disableScrollTo={disableScrollTo}
          allowFeedbackAndHelpButtons={allowFeedbackAndHelpButtons}
          showBeforeUnloadWarning={showBeforeUnloadWarning}
        />
      );
    }
    return;
  }

  private onRetry = (document: any) => (commentLocalId?: string) => {
    this.sendEditorAnalyticsEvent({
      actionSubjectId: actionSubjectIds.retryFailedRequestButton,
    });
    this.onSave(document, commentLocalId, true);
  };

  private onSave = async (
    value: any,
    commentLocalId?: string,
    retry?: boolean,
  ) => {
    const {
      objectId,
      containerId,
      id,
      localId,
      meta,
      onAddComment,
      onCreateConversation,
      conversation,
    } = this.props;

    if (!retry) {
      this.sendEditorAnalyticsEvent({
        actionSubjectId: actionSubjectIds.saveButton,
      });
    }

    if (!id && !commentLocalId && onCreateConversation) {
      onCreateConversation(
        localId!,
        value,
        meta,
        objectId,
        containerId,
        (id) => {
          this.sendEditorAnalyticsEvent({
            actionSubjectId: id,
            eventType: eventTypes.TRACK,
            attributes: {
              nestedDepth: 0,
            },
            action: trackEventActions.created,
            actionSubject: 'comment',
          });
        },
      );
    } else if (onAddComment) {
      const conversationId = id || conversation!.conversationId;
      onAddComment(
        conversationId,
        conversationId,
        value,
        commentLocalId,
        (id) => {
          this.sendEditorAnalyticsEvent({
            actionSubjectId: id,
            eventType: eventTypes.TRACK,
            attributes: {
              nestedDepth: 0,
            },
            action: trackEventActions.created,
            actionSubject: 'comment',
          });
        },
      );
    }
  };

  private onEditorClose = () => {
    if (this.state.openEditorCount > 0) {
      this.setState({
        openEditorCount: this.state.openEditorCount - 1,
      });
    }

    if (typeof this.props.onEditorClose === 'function') {
      this.props.onEditorClose();
    }
  };

  private onEditorOpen = () => {
    this.sendEditorAnalyticsEvent({
      actionSubjectId: actionSubjectIds.createCommentInput,
    });

    this.setState({
      openEditorCount: this.state.openEditorCount + 1,
    });

    if (typeof this.props.onEditorOpen === 'function') {
      this.props.onEditorOpen();
    }
  };

  private onHighlightComment = (
    event: React.MouseEvent<HTMLAnchorElement>,
    commentId: string,
  ) => {
    if (typeof this.props.onHighlightComment === 'function') {
      this.props.onHighlightComment(event, commentId);
      if (typeof this.props.onCommentPermalinkClick === 'function') {
        this.props.onCommentPermalinkClick(event, commentId);
      }
    }
  };

  private handleEditorChange = (value: any, commentId?: string) => {
    const {
      id,
      localId,
      onEditorChange,
      meta,
      objectId,
      containerId,
    } = this.props;

    if (onEditorChange) {
      const isLocal = !id;
      onEditorChange(
        isLocal,
        value,
        localId!,
        commentId,
        meta,
        objectId,
        containerId,
      );
    }
  };

  render() {
    return (
      <>
        {this.renderComments()}
        {this.renderConversationsEditor()}
      </>
    );
  }
}
