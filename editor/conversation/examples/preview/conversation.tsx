import React from 'react';

import { IntlProvider } from 'react-intl';

import { Conversation } from '@atlaskit/conversation/Conversation';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { MockProvider, getDataProviderFactory } from '../../example-helpers/MockProvider';
import {
	FETCH_CONVERSATIONS_REQUEST,
	FETCH_CONVERSATIONS_SUCCESS,
} from '../../src/internal/actions';
import type { Conversation as ConversationData } from '../../src/model/Conversation';
const styles = cssMap({
	subject: {
		width: '440px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});
const user = { id: 'preview-user', name: 'Alex Chen', avatarUrl: '' };
const conversation: ConversationData = {
	conversationId: 'preview-thread',
	objectId: 'ari:cloud:platform::conversation/preview',
	meta: {},
	comments: [
		{
			commentAri: 'ari:cloud:platform::comment/preview-comment',
			commentId: 'preview-comment',
			conversationId: 'preview-thread',
			parentId: 'preview-thread',
			createdAt: Date.UTC(2026, 5, 14, 9, 30),
			createdBy: user,
			document: {
				adf: {
					type: 'doc',
					version: 1,
					content: [
						{
							type: 'paragraph',
							content: [{ type: 'text', text: 'The roadmap is ready for review.' }],
						},
					],
				},
			},
			comments: [],
			localId: 'preview-comment',
		},
	],
};
class PreviewProvider extends MockProvider {
	async getConversations() {
		this.dispatch({ type: FETCH_CONVERSATIONS_REQUEST });
		this.dispatch({ type: FETCH_CONVERSATIONS_SUCCESS, payload: [conversation] });
		return [conversation];
	}
}
const provider = new PreviewProvider({ url: 'http://mockservice/', user });
const dataProviders = getDataProviderFactory(['reactionsStore']);
function Thread() {
	const [id, setId] = React.useState<string>();
	React.useEffect(() => {
		provider.getConversations().then(([conversation]) => setId(conversation.conversationId));
	}, []);
	return id ? (
		<Conversation
			id={id}
			objectId="ari:cloud:platform::conversation/preview"
			provider={provider}
			dataProviders={dataProviders}
			isExpanded={false}
		/>
	) : null;
}

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Thread />
			</Box>
		</IntlProvider>
	);
}
