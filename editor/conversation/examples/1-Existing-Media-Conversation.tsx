import React from 'react';
import { MOCK_USERS } from '../example-helpers/MockData';
import {
	getDataProviderFactory,
	MockProvider as ConversationResource,
} from '../example-helpers/MockProvider';
import { Conversation } from '../src';

const provider = new ConversationResource({
	url: 'http://mockservice/',
	user: MOCK_USERS[3],
});

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class ExistingConversation extends React.Component<{}, { conversationId?: string }> {
	state = {
		conversationId: undefined,
	};

	async componentDidMount() {
		const conversations = await provider.getConversations();

		this.setState({
			conversationId: conversations[2].conversationId,
		});
	}

	render() {
		const { conversationId } = this.state;
		if (!conversationId) {
			return null;
		}

		return (
			<Conversation
				id={conversationId}
				objectId="ari:cloud:platform::conversation/demo"
				provider={provider}
				dataProviders={getDataProviderFactory()}
			/>
		);
	}
}
