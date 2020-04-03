import { ProviderFactory } from '@atlaskit/editor-common';
import { Comment as CommentType, User } from '../model';
import { Editor as AkEditor, EditorProps } from '@atlaskit/editor-core';
import { CommentAction as AkCommentAction } from '@atlaskit/comment';
import { SuccessHandler } from '../internal/actions';
import { EventData } from '../internal/analytics';

export type SendAnalyticsEvent = (eventData: EventData) => void;

export type RenderEditorWithComments = (
  Editor: typeof AkEditor,
  props: EditorProps,
  comment?: CommentType,
) => JSX.Element;

/**
 * Props which are passed down from the parent Conversation/Comment
 */
export interface SharedProps {
  user?: User;
  comments?: CommentType[];
  /* Optionally restricts visual nesting of comments to a maximum level. */
  maxCommentNesting?: number;

  // Dispatch
  onAddComment?: (
    conversationId: string,
    parentId: string,
    value: any,
    localId?: string,
    onSuccess?: SuccessHandler,
  ) => void;
  onUpdateComment?: (
    conversationId: string,
    commentId: string,
    value: any,
    onSuccess?: SuccessHandler,
  ) => void;
  onDeleteComment?: (
    conversationId: string,
    commentId: string,
    onSuccess?: SuccessHandler,
  ) => void;
  onRevertComment?: (conversationId: string, commentId: string) => void;
  onCancelComment?: (conversationId: string, commentId: string) => void;
  onCancel?: () => void;
  onHighlightComment?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    commentId: string,
  ) => void;
  onEditorOpen?: () => void;
  onEditorClose?: () => void;
  onEditorChange?: (
    isLocal: boolean,
    value: any,
    conversationId: string,
    commentId: string | undefined,
    meta: any,
    objectId: string,
    containerId?: string,
  ) => void;

  // Provider
  dataProviders?: ProviderFactory;

  // Event Hooks
  onUserClick?: (user: User) => void;
  onRetry?: (localId?: string) => void;
  onCommentPermalinkClick?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    commentId: string,
  ) => void;

  // Editor
  renderEditor?: RenderEditorWithComments;

  objectId?: string;
  containerId?: string;

  isHighlighted?: boolean;
  placeholder?: string;
  disableScrollTo?: boolean;
  allowFeedbackAndHelpButtons?: boolean;
  sendAnalyticsEvent: SendAnalyticsEvent;

  portal?: HTMLElement;

  renderAdditionalCommentActions?: (
    CommentAction: typeof AkCommentAction,
    comment: CommentType,
  ) => JSX.Element[];
  renderAfterComment?: (comment: CommentType) => JSX.Element;
}
