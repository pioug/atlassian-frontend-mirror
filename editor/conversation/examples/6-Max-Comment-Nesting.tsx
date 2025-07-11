import React, { useState, useEffect } from 'react';
import { type EditorProps } from '@atlaskit/editor-core';
import { type ComposableEditor } from '@atlaskit/editor-core/composable-editor';
import { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';
import { MOCK_USERS } from '../example-helpers/MockData';
import {
	getDataProviderFactory,
	MockProvider as ConversationResource,
} from '../example-helpers/MockProvider';
import { Conversation } from '../src';
import { type Comment as CommentType } from '../src/model/Comment';

const provider = new ConversationResource({
	url: 'http://mockservice/',
	user: MOCK_USERS[3],
});

const renderEditorWithAutoMention = (
	Editor: typeof ComposableEditor,
	props: EditorProps,
	comment?: CommentType,
) => {
	const adfMention = comment
		? {
				version: 1,
				type: 'doc',
				content: [
					{
						type: 'paragraph',
						content: [
							{
								type: 'mention',
								attrs: {
									id: comment.createdBy.id,
									text: comment.createdBy.name,
									userType: 'DEFAULT',
								},
							},
							{
								type: 'text',
								text: ' ',
							},
						],
					},
				],
			}
		: undefined;

	return <ComposableEditorWrapper {...props} defaultValue={adfMention} Editor={Editor} />;
};

const ComposableEditorWrapper = ({
	Editor,
	...props
}: EditorProps & { Editor: typeof ComposableEditor }) => {
	const universalPreset = useUniversalPreset({ props });
	return <Editor preset={universalPreset} {...props} />;
};

export default () => {
	const [maxCommentNesting, setMaxCommentNesting] = useState(1);
	const [shouldAutoMention, setShouldAutoMention] = useState(true);
	const [conversationId, setConversationId] = useState<string | undefined>(undefined);
	useEffect(() => {
		provider.getConversations().then(([conversation]) => {
			setConversationId(conversation.conversationId);
		});
	}, []);

	if (!conversationId) {
		return null;
	}

	return (
		<>
			<p>
				Max comment nesting: {maxCommentNesting}{' '}
				<button onClick={() => setMaxCommentNesting(maxCommentNesting - 1)}>-1</button>{' '}
				<button onClick={() => setMaxCommentNesting(maxCommentNesting + 1)}>+1</button>
			</p>
			<p>
				<label>
					{/* eslint-disable-next-line @atlaskit/design-system/no-html-checkbox */}
					<input
						type="checkbox"
						checked={shouldAutoMention}
						onChange={(e) => setShouldAutoMention(e.target.checked)}
					/>{' '}
					Auto mention when replying
				</label>
			</p>
			<Conversation
				id={conversationId}
				objectId="ari:cloud:platform::conversation/demo"
				provider={provider}
				dataProviders={getDataProviderFactory()}
				maxCommentNesting={maxCommentNesting}
				renderEditor={shouldAutoMention ? renderEditorWithAutoMention : undefined}
			/>
		</>
	);
};
