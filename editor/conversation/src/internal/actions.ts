import { type ResourceProvider } from '../api/ConversationResource';
import { type User } from '../model/User';

export const FETCH_CONVERSATIONS_REQUEST = 'fetchConversationsRequest';
export const FETCH_CONVERSATIONS_SUCCESS = 'fetchConversationsSuccess';

export const ADD_COMMENT_REQUEST = 'addCommentRequest';
export const ADD_COMMENT_SUCCESS = 'addCommentSuccess';
export const ADD_COMMENT_ERROR = 'addCommentError';

export const DELETE_COMMENT_REQUEST = 'deleteCommentRequest';
export const DELETE_COMMENT_SUCCESS = 'deleteCommentSuccess';
export const DELETE_COMMENT_ERROR = 'deleteCommentError';

export const UPDATE_COMMENT_REQUEST = 'updateCommentRequest';
export const UPDATE_COMMENT_SUCCESS = 'updateCommentSuccess';
export const UPDATE_COMMENT_ERROR = 'updateCommentError';

export const HIGHLIGHT_COMMENT = 'highlightComment';
export const REVERT_COMMENT = 'revertComment';

export const UPDATE_USER_SUCCESS = 'updateUserSuccess';

export const CREATE_CONVERSATION_REQUEST = 'createConversationRequest';
export const CREATE_CONVERSATION_SUCCESS = 'createConversationSuccess';
export const CREATE_CONVERSATION_ERROR = 'createConversationError';

export type SuccessHandler = (id: string) => void;

export const addComment =
	(
		conversationId: string,
		parentId: string,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
		localId: string | undefined = undefined,
		provider: ResourceProvider,
		onSuccess?: SuccessHandler,
	) =>
	async (): Promise<void> => {
		const { commentId } = await provider.addComment(conversationId, parentId, value, localId);

		if (typeof onSuccess === 'function') {
			onSuccess(commentId);
		}
	};

export const updateComment =
	(
		conversationId: string,
		commentId: string,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
		provider: ResourceProvider,
		onSuccess?: SuccessHandler,
	) =>
	async (): Promise<void> => {
		await provider.updateComment(conversationId, commentId, value);

		if (typeof onSuccess === 'function') {
			onSuccess(commentId);
		}
	};

export const deleteComment =
	(
		conversationId: string,
		commentId: string,
		provider: ResourceProvider,
		onSuccess?: SuccessHandler,
	) =>
	async (): Promise<void> => {
		await provider.deleteComment(conversationId, commentId);

		if (typeof onSuccess === 'function') {
			onSuccess(commentId);
		}
	};

export const revertComment =
	// Ignored via go/ees005
	// eslint-disable-next-line require-await
	(conversationId: string, commentId: string, provider: ResourceProvider) =>
		async (): Promise<void> => {
			await provider.revertComment(conversationId, commentId);
		};

// Ignored via go/ees005
// eslint-disable-next-line require-await
export const updateUser = (user: User, provider: ResourceProvider) => async (): Promise<void> => {
	provider.updateUser(user);
};

export const createConversation =
	(
		localId: string,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		meta: any,
		provider: ResourceProvider,
		objectId: string,
		containerId?: string,
		onSuccess?: SuccessHandler,
	) =>
	async (): Promise<void> => {
		const { conversationId } = await provider.create(localId, value, meta, objectId, containerId);

		if (typeof onSuccess === 'function') {
			onSuccess(conversationId);
		}
	};

export const saveDraft =
	(
		isLocal: boolean,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
		conversationId: string,
		commentId: string | undefined,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		meta: any,
		provider: ResourceProvider,
		objectId: string,
		containerId?: string,
	) =>
	// Ignored via go/ees005
	// eslint-disable-next-line require-await
	async (): Promise<void> => {
		provider.saveDraft(isLocal, value, conversationId, commentId, meta, objectId, containerId);
	};
