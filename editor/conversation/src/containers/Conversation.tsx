import React from 'react';
import { type ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { type CommentAction as AkCommentAction } from '@atlaskit/comment';
import { Provider, connect } from 'react-redux';
import { type ThunkDispatch } from 'redux-thunk';

import Conversation, { type Props as BaseProps } from '../components/Conversation';
import { type ResourceProvider } from '../api/ConversationResource';
import { type Comment as CommentType } from '../model/Comment';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

import {
	addComment,
	updateComment,
	deleteComment,
	revertComment,
	updateUser,
	createConversation,
	HIGHLIGHT_COMMENT,
	type SuccessHandler,
	saveDraft,
} from '../internal/actions';
import { getComments, getConversation, getUser } from '../internal/selectors';
import { uuid } from '../internal/uuid';
import { type State } from '../internal/store';
import { type User } from '../model/User';
import { type RenderEditorWithComments } from '../components/types';

export interface Props extends BaseProps {
	containerId?: string;
	dataProviders?: ProviderFactory;
	isExpanded?: boolean;
	localId: string;
	meta?: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	};
	objectId: string;
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

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDispatchToProps = (dispatch: ThunkDispatch<State, any, any>, { provider }: Props) => ({
	onAddComment(
		conversationId: string,
		parentId: string,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
		localId?: string,
		onSuccess?: SuccessHandler,
	) {
		dispatch(addComment(conversationId, parentId, value, localId, provider, onSuccess));
	},

	onUpdateComment(
		conversationId: string,
		commentId: string,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
		onSuccess?: SuccessHandler,
	) {
		dispatch(updateComment(conversationId, commentId, value, provider, onSuccess));
	},

	onDeleteComment(conversationId: string, commentId: string, onSuccess?: SuccessHandler) {
		dispatch(deleteComment(conversationId, commentId, provider, onSuccess));
	},

	onRevertComment(conversationId: string, commentId: string) {
		dispatch(revertComment(conversationId, commentId, provider));
	},

	onHighlightComment(_event: React.MouseEvent<HTMLAnchorElement>, commentId: string) {
		dispatch({ type: HIGHLIGHT_COMMENT, payload: { commentId } });
	},

	onUpdateUser(user: User) {
		dispatch(updateUser(user, provider));
	},

	onCreateConversation(
		localId: string,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		value: any,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		meta: any,
		objectId: string,
		containerId?: string,
		onSuccess?: SuccessHandler,
	) {
		dispatch(createConversation(localId, value, meta, provider, objectId, containerId, onSuccess));
	},

	onEditorChange(
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
	) {
		dispatch(
			saveDraft(isLocal, value, conversationId, commentId, meta, provider, objectId, containerId),
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
	allowFeedbackAndHelpButtons?: boolean;
	containerId?: string;
	dataProviders?: ProviderFactory;
	disableScrollTo?: boolean;
	id?: string;
	isExpanded?: boolean;
	maxCommentNesting?: number;
	meta?: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	};
	objectId: string;
	onCancel?: () => void;
	onEditorChange?: () => void;
	onEditorClose?: () => void;
	onEditorOpen?: () => void;
	placeholder?: string;
	portal?: HTMLElement;
	provider: ResourceProvider;

	renderAdditionalCommentActions?: (
		CommentAction: typeof AkCommentAction,
		comment: CommentType,
	) => JSX.Element[];
	renderAfterComment?: (comment: CommentType) => JSX.Element;
	renderEditor?: RenderEditorWithComments;
	showBeforeUnloadWarning?: boolean;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components, @typescript-eslint/no-explicit-any
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
				<ResourcedConversation
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-explicit-any, react/jsx-props-no-spreading
					{...(props as any)}
					localId={localId}
				/>
			</Provider>
		);
	}
}

export default ConversationContainer;
