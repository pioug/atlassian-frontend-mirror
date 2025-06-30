/* eslint-disable @compiled/no-exported-css */
/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

const containerStyle = css({
	padding: '20px',
	fontFamily: 'Arial, sans-serif',
});

const attachmentStyle = css({
	borderColor: '#ccc',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderRadius: '8px',
	padding: '10px',
	margin: '10px 0',
	backgroundColor: '#f9f9f9',
	minHeight: '100px',
});

const loadingStyle = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	minHeight: '100px',
	color: '#666',
});

const imagePlaceholderStyle = css({
	width: '100%',
	height: '60px',
	backgroundColor: '#e3f2fd',
	borderColor: '#2196f3',
	borderStyle: 'dashed',
	borderWidth: '2px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: '#1976d2',
});

const commentContentStyle = css({
	backgroundColor: '#f5f5f5',
	padding: '10px',
	borderRadius: '4px',
});

const infoBoxStyle = css({
	marginTop: '20px',
	padding: '15px',
	backgroundColor: '#e8f5e8',
	borderRadius: '8px',
});

// Simulate different loading times for attachments
const useAttachmentLoader = (attachmentId: string, delay: number) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [loadedAt, setLoadedAt] = useState<number>(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadedAt(performance.now());
			setIsLoaded(true);
		}, delay);
		return () => clearTimeout(timer);
	}, [delay]);

	return { isLoaded, loadedAt };
};

const ImageAttachment = ({ attachmentId, delay }: { attachmentId: string; delay: number }) => {
	const { isLoaded, loadedAt } = useAttachmentLoader(attachmentId, delay);

	return (
		<UFOSegment name="ImageAttachment" mode="single">
			<div css={attachmentStyle}>
				{!isLoaded ? (
					<div css={loadingStyle}>
						<UFOLoadHold name={`ImageAttachment-${attachmentId}`}>
							Loading image attachment {attachmentId}...
						</UFOLoadHold>
					</div>
				) : (
					<div data-testid={`image-attachment-${attachmentId}`}>
						<h3>📷 Image Attachment {attachmentId}</h3>
						<p>Loaded at: {loadedAt.toFixed(2)} ms</p>
						<div css={imagePlaceholderStyle}>[Image Placeholder {attachmentId}]</div>
					</div>
				)}
			</div>
		</UFOSegment>
	);
};

const CommentBox = ({ delay }: { delay: number }) => {
	const { isLoaded, loadedAt } = useAttachmentLoader('comment', delay);

	return (
		<UFOSegment name="CommentBox">
			<div css={attachmentStyle}>
				{!isLoaded ? (
					<div css={loadingStyle}>
						<UFOLoadHold name="CommentBox">Loading comments...</UFOLoadHold>
					</div>
				) : (
					<div data-testid="comment-box">
						<h3>💬 Comment Section</h3>
						<p>Loaded at: {loadedAt.toFixed(2)} ms</p>
						<div css={commentContentStyle}>
							<p>This is a sample comment. Comments loaded successfully!</p>
						</div>
					</div>
				)}
			</div>
		</UFOSegment>
	);
};

export default function Example() {
	const [appCreatedAt] = useState(performance.now());

	return (
		<div css={containerStyle}>
			<UFOSegment name="IssueView">
				<h1 data-testid="title">🔍 Multiple Segments with Same Name Example</h1>
				<p>
					This example demonstrates how React UFO handles multiple segments with the same name. Each
					ImageAttachment segment has the same name but different content and loading times. React
					UFO will create only one critical metrics payload per segment name, selecting the first
					segment that mounts to represent all instances.
				</p>

				<div>
					<h2>📎 Attachments Section</h2>
					<p>The following ImageAttachment segments all have the same name:</p>

					{/* Multiple ImageAttachment segments - all with the same name */}
					<ImageAttachment attachmentId="1" delay={500} />
					<ImageAttachment attachmentId="2" delay={800} />
					<ImageAttachment attachmentId="3" delay={300} />
					<ImageAttachment attachmentId="4" delay={1000} />

					{/* Different segment name for comparison */}
					<CommentBox delay={600} />
				</div>

				<div css={infoBoxStyle}>
					<h3>📊 What happens with Critical Metrics:</h3>
					<ul>
						<li>
							✅ Only <strong>one</strong> critical metrics payload will be created for
							"ImageAttachment"
						</li>
						<li>
							✅ The payload will represent the <strong>first</strong> ImageAttachment segment to
							mount (based on timing)
						</li>
						<li>
							✅ One separate payload will be created for "CommentBox" as it has a unique name
						</li>
						<li>ℹ️ App created at: {appCreatedAt.toFixed(2)} ms</li>
					</ul>
				</div>
			</UFOSegment>
		</div>
	);
}
