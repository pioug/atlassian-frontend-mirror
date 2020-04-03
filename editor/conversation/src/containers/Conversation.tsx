import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { CommentAction as AkCommentAction } from '@atlaskit/comment';
import { Provider, connect } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';

import Conversation, { Props as BaseProps } from '../components/Conversation';
import { ResourceProvider } from '../api/ConversationResource';
import { Comment as CommentType } from '../model/Comment';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import {
  addComment,
  updateComment,
  deleteComment,
  revertComment,
  updateUser,
  createConversation,
  HIGHLIGHT_COMMENT,
  SuccessHandler,
  saveDraft,
} from '../internal/actions';
import { getComments, getConversation, getUser } from '../internal/selectors';
import { uuid } from '../internal/uuid';
import { State } from '../internal/store';
import { User } from '../model';
import { RenderEditorWithComments } from '../components/types';

export interface Props extends BaseProps {
  localId: string;
  objectId: string;
  containerId?: string;
  dataProviders?: ProviderFactory;
  meta?: {
    [key: string]: any;
  };
  isExpanded?: boolean;
  onCancel?: () => void;
  provider: ResourceProvider;
}

const mapStateToProps = (state: State, ownProps: Props) => {
  const { id, localId, objectId, containerId } = ownProps;
  const conversation = getConversation(state, id || localId);
  const comments = getComments(state, id || localId);
  const user = getUser(state);

  return {
    ...ownProps,
    conversation,
    comments,
    objectId,
    containerId,
    user,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<State, any, any>,
  { provider }: Props,
) => ({
  onAddComment(
    conversationId: string,
    parentId: string,
    value: any,
    localId?: string,
    onSuccess?: SuccessHandler,
  ) {
    dispatch(
      addComment(conversationId, parentId, value, localId, provider, onSuccess),
    );
  },

  onUpdateComment(
    conversationId: string,
    commentId: string,
    value: any,
    onSuccess?: SuccessHandler,
  ) {
    dispatch(
      updateComment(conversationId, commentId, value, provider, onSuccess),
    );
  },

  onDeleteComment(
    conversationId: string,
    commentId: string,
    onSuccess?: SuccessHandler,
  ) {
    dispatch(deleteComment(conversationId, commentId, provider, onSuccess));
  },

  onRevertComment(conversationId: string, commentId: string) {
    dispatch(revertComment(conversationId, commentId, provider));
  },

  onHighlightComment(
    _event: React.MouseEvent<HTMLAnchorElement>,
    commentId: string,
  ) {
    dispatch({ type: HIGHLIGHT_COMMENT, payload: { commentId } });
  },

  onUpdateUser(user: User) {
    dispatch(updateUser(user, provider));
  },

  onCreateConversation(
    localId: string,
    value: any,
    meta: any,
    objectId: string,
    containerId?: string,
    onSuccess?: SuccessHandler,
  ) {
    dispatch(
      createConversation(
        localId,
        value,
        meta,
        provider,
        objectId,
        containerId,
        onSuccess,
      ),
    );
  },

  onEditorChange(
    isLocal: boolean,
    value: any,
    conversationId: string,
    commentId: string | undefined,
    meta: any,
    objectId: string,
    containerId?: string,
  ) {
    dispatch(
      saveDraft(
        isLocal,
        value,
        conversationId,
        commentId,
        meta,
        provider,
        objectId,
        containerId,
      ),
    );
  },
});

const ResourcedConversation = withAnalyticsEvents()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    // @ts-ignore connect generic types to be provided
  )(Conversation),
);

export interface ContainerProps {
  id?: string;
  objectId: string;
  containerId?: string;
  provider: ResourceProvider;
  dataProviders?: ProviderFactory;
  meta?: {
    [key: string]: any;
  };
  isExpanded?: boolean;
  onCancel?: () => void;
  showBeforeUnloadWarning?: boolean;
  onEditorOpen?: () => void;
  onEditorClose?: () => void;
  onEditorChange?: () => void;
  renderEditor?: RenderEditorWithComments;
  placeholder?: string;
  disableScrollTo?: boolean;
  allowFeedbackAndHelpButtons?: boolean;

  portal?: HTMLElement;
  renderAdditionalCommentActions?: (
    CommentAction: typeof AkCommentAction,
    comment: CommentType,
  ) => JSX.Element[];
  renderAfterComment?: (comment: CommentType) => JSX.Element;
  maxCommentNesting?: number;
}

class ConversationContainer extends React.Component<ContainerProps, any> {
  constructor(props: ContainerProps) {
    super(props);
    this.state = {
      localId: props.id || uuid.generate(),
    };
  }

  render() {
    const {
      props,
      state: { localId },
    } = this;
    const { store } = props.provider;

    return (
      <Provider store={store}>
        <ResourcedConversation {...(props as any)} localId={localId} />
      </Provider>
    );
  }
}

export default ConversationContainer;
