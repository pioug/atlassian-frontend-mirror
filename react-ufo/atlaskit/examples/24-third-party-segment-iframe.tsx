/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag Fragment
 */
import { useEffect, useLayoutEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { bind, type UnbindFn } from 'bind-event-listener';

import { useInteractionContext } from '@atlaskit/react-ufo/interaction-context';
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
		.loading {
			opacity: 0;
			transition: opacity 0.5s ease;
		}
		.loaded {
			opacity: 1;
		}
	</style>
</head>
<body>
	<h3>Simple Iframe Test</h3>
	<p>This is basic static content in an iframe.</p>
	<div id="content" class="loading" style="background: #e0e0e0; padding: 15px; border: 1px solid #ccc;">
		<p>If you can see this, the iframe is working!</p>
	</div>

	<script>
		// Send start rendering message immediately
		window.parent.postMessage({ type: 'iframe-render-start' }, '*');

		// Store the end message function globally to prevent it from being cleared
		window.sendEndMessage = function() {
			window.parent.postMessage({ type: 'iframe-render-end' }, '*');
		};
		// Try to start timing immediately
		setTimeout(() => {
			if (window.sendEndMessage) {
				window.sendEndMessage();
			}
		}, 200);
	</script>
</body>
</html>
`;

const ThirdPartyContent = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isRendering, setIsRendering] = useState(false);
	const [content, setContent] = useState<string>('');
	const ufoContext = useInteractionContext();

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			// Listen for iframe messages
			if (event.data?.type === 'iframe-render-start') {
				setIsRendering(true);
			} else if (event.data?.type === 'iframe-render-end') {
				setIsRendering(false);
			}
		};
		const unbind: UnbindFn = bind(window, {
			type: 'message',
			listener: handleMessage,
		});

		return unbind;
	}, [ufoContext]);

	useEffect(() => {
		// Simulate async loading of iframe content
		const loadContent = async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			setContent(SIMPLE_IFRAME_CONTENT);
			setIsLoading(false);
		};

		loadContent();
	}, []);

	useLayoutEffect(() => {
		if (isRendering) {
			return ufoContext?.hold('iframe-rendering');
		}
	}, [isRendering, ufoContext]);

	if (isLoading) {
		return (
			<UFOLoadHold name="iframe-content-loading">
				<div css={loadingContainerStyle}>
					<p>Loading iframe content...</p>
				</div>
			</UFOLoadHold>
		);
	}

	return <iframe css={iframeStyle} srcDoc={content} title="Async loaded iframe" />;
};

// Main App component
export default function Example(): JSX.Element {
	return (
		<UFOSegment name="iframe-example-root">
			<UFOThirdPartySegment name="third-party-widget">
				<div css={containerStyle}>
					<h1>UFO Third-Party Segment with Iframe Example</h1>
					<div css={[sectionStyle, thirdPartyStyle]}>
						<h3>Async Loading Iframe Widget</h3>
						<p>This iframe content loads asynchronously after a 1.5s delay:</p>
						<ThirdPartyContent />
					</div>
				</div>
			</UFOThirdPartySegment>
		</UFOSegment>
	);
}
