import { type ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { type EditorProps } from '@atlaskit/editor-core';
import { type ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { type CommentAction as AkCommentAction } from '@atlaskit/comment';
import { type SuccessHandler } from '../internal/actions';
import { type EventData } from '../internal/analytics';
import { type Comment as CommentType } from '../model/Comment';
import { type User } from '../model/User';

export type SendAnalyticsEvent = (eventData: EventData) => void;

export type RenderEditorWithComments = (
	Editor: typeof ComposableEditor,
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
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
		localId?: string,
		onSuccess?: SuccessHandler,
	) => void;
	onUpdateComment?: (
		conversationId: string,
		commentId: string,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
		onSuccess?: SuccessHandler,
	) => void;
	onDeleteComment?: (conversationId: string, commentId: string, onSuccess?: SuccessHandler) => void;
	onRevertComment?: (conversationId: string, commentId: string) => void;
	onCancelComment?: (conversationId: string, commentId: string) => void;
	onCancel?: () => void;
	onHighlightComment?: (event: React.MouseEvent<HTMLAnchorElement>, commentId: string) => void;
	onEditorOpen?: () => void;
	onEditorClose?: () => void;
	onEditorChange?: (
		isLocal: boolean,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
		conversationId: string,
		commentId: string | undefined,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		meta: any,
		objectId: string,
		containerId?: string,
	) => void;

	// Provider
	dataProviders?: ProviderFactory;

	// Event Hooks
	onUserClick?: (user: User) => void;
	onRetry?: (localId?: string) => void;
	onCommentPermalinkClick?: (event: React.MouseEvent<HTMLAnchorElement>, commentId: string) => void;

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
