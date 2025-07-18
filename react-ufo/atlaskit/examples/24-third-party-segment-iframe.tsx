/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment, { UFOThirdPartySegment } from '@atlaskit/react-ufo/segment';

const containerStyle = css({
	display: 'flex',
	flexDirection: 'column',
	gap: '20px',
	padding: '20px',
	fontFamily: 'Arial, sans-serif',
});

const sectionStyle = css({
	borderColor: '#dddddd',
	borderStyle: 'solid',
	borderWidth: '2px',
	borderRadius: '8px',
	padding: '20px',
	backgroundColor: '#f9f9f9',
});

const thirdPartyStyle = css({
	backgroundColor: '#f5f5f5',
	borderColor: '#666666',
	borderStyle: 'dashed',
	borderWidth: '2px',
});

const iframeStyle = css({
	width: '100%',
	height: '200px',
	borderColor: '#cccccc',
	borderStyle: 'solid',
	borderWidth: '1px',
	borderRadius: '4px',
	transition: 'height 0.3s ease',
});

const loadingContainerStyle = css({
	padding: '20px',
	textAlign: 'center',
	borderColor: '#cccccc',
	borderStyle: 'dashed',
	borderWidth: '2px',
	borderRadius: '4px',
	background: '#f9f9f9',
	color: '#666666',
	fontStyle: 'italic',
});

const SIMPLE_IFRAME_CONTENT = `
<!DOCTYPE html>
<html>
<head>
	<style>
		body {
			margin: 0;
			padding: 20px;
			font-family: Arial, sans-serif;
			background: #f0f0f0;
		}
	</style>
</head>
<body>
	<h3>Simple Iframe Test</h3>
	<p>This is basic static content in an iframe.</p>
	<div style="background: #e0e0e0; padding: 15px; border: 1px solid #ccc;">
		<p>If you can see this, the iframe is working!</p>
	</div>
</body>
</html>
`;

const ThirdPartyContent = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [content, setContent] = useState<string>('');

	useEffect(() => {
		// Simulate async loading of iframe content
		const loadContent = async () => {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setContent(SIMPLE_IFRAME_CONTENT);
			setIsLoading(false);
		};

		loadContent();
	}, []);

	if (isLoading) {
		return (
			<UFOLoadHold name="content-loading">
				<div css={loadingContainerStyle}>
					<p>Loading iframe content...</p>
				</div>
			</UFOLoadHold>
		);
	}

	return (
		<UFOThirdPartySegment name="third-party-widget">
			<iframe css={iframeStyle} srcDoc={content} title="Async loaded iframe" />
		</UFOThirdPartySegment>
	);
};

// Main App component
export default function Example() {
	return (
		<UFOSegment name="iframe-example-root">
			<div css={containerStyle}>
				<h1>UFO Third-Party Segment with Iframe Example</h1>
				<div css={[sectionStyle, thirdPartyStyle]}>
					<h3>Async Loading Iframe Widget</h3>
					<p>This iframe content loads asynchronously after a 1.5s delay:</p>
					<ThirdPartyContent />
				</div>
			</div>
		</UFOSegment>
	);
}
