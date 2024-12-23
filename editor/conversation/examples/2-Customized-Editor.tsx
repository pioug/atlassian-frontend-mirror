import React from 'react';
import { type EditorProps } from '@atlaskit/editor-core';
import { type ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
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
		const [conversation] = await provider.getConversations();

		this.setState({
			conversationId: conversation.conversationId,
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
				renderEditor={(Editor, props) => (
					<ComposableEditorWrapper {...props} saveOnEnter={true} Editor={Editor} />
				)}
			/>
		);
	}
}

const ComposableEditorWrapper = ({
	Editor,
	...props
}: EditorProps & { Editor: typeof ComposableEditor }) => {
	const universalPreset = useUniversalPreset({ props });
	return <Editor preset={universalPreset} {...props} />;
};
