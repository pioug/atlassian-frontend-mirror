import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Label } from '@atlaskit/form';
import { Box } from '@atlaskit/primitives';
import TextArea from '@atlaskit/textarea';

import AISummary from '../src/view/common/ai-summary';

import ExampleContainer from './utils/example-container';
import InternalMessage from './utils/internal-message';

const markdownBulletList = `- Item 1
- Item 2
  - Item 2.1
  - Item 2.2
- Item 3
`;

function wait(milliseconds: number) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const MarkdownTextRenderer = () => {
	const [markdownText, setMarkdownText] = useState(markdownBulletList);
	return (
		<Box>
			<Label htmlFor="markdownInput">Markdown Text</Label>
			<TextArea
				id="markdownInput"
				onChange={(e) => setMarkdownText(e.target.value)}
				defaultValue={markdownBulletList}
			/>
			<h4>Message Renderer</h4>
			<Box paddingBlock="space.200">
				<AISummary content={markdownText} />
			</Box>
		</Box>
	);
};

const MarkdownStreamRenderer = () => {
	const [content, setContent] = useState('');
	const [isStreaming, setIsStreaming] = useState(false);

	const streamMessage = async () => {
		if (content) {
			setContent('');
		}

		const stream = await new ReadableStream({
			async start(controller) {
				await wait(1000);
				controller.enqueue(`- Import a HTML file and watch
        `);
				await wait(500);
				controller.enqueue(`it magically convert to Markdown`);
				await wait(250);
				controller.enqueue(`
        - Drag and drop images (requires your Dropbox account be linked)
        `);
				await wait(250);
				controller.enqueue(`
        - Import and save files from GitHub, Dropbox, Google Drive and One Drive
        - Drag `);
				await wait(250);
				controller.enqueue(`
        and drop markdown and HTML files
        - Export documents as Markdown, HTML and PDF
        `);
				controller.close();
			},
		});

		const reader = stream.getReader();
		setIsStreaming(true);

		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				setIsStreaming(false);
				return;
			}

			setContent((prevState) => {
				return `${prevState}${value}`;
			});
		}
	};
	return (
		<Box>
			<h4>Message Stream Example</h4>
			<Box paddingBlock="space.100">
				<Button isDisabled={isStreaming} onClick={streamMessage}>
					Start message stream
				</Button>
			</Box>
			<AISummary content={content} />
		</Box>
	);
};

const AISummaryExample = () => (
	<ExampleContainer title="AISummary markdown">
		<InternalMessage />
		<MarkdownTextRenderer />
		<MarkdownStreamRenderer />
	</ExampleContainer>
);

export default AISummaryExample;
