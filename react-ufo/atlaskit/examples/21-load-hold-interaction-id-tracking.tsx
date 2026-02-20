/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { DefaultInteractionID } from '@atlaskit/react-ufo/interaction-id-context';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';
import traceUFOInteraction from '@atlaskit/react-ufo/trace-interaction';

const containerStyle = css({
	padding: '20px',
	fontFamily: 'Arial, sans-serif',
});

const headerStyle = css({
	color: '#333',
	marginBottom: '20px',
});

const sectionStyle = css({
	borderWidth: '2px',
	borderStyle: 'solid',
	borderColor: '#ddd',
	borderRadius: '8px',
	padding: '15px',
	margin: '10px 0',
	backgroundColor: '#f9f9f9',
});

const buttonContainerStyle = css({
	display: 'flex',
	gap: '10px',
	marginBottom: '20px',
});

const statusStyle = css({
	padding: '10px',
	borderRadius: '4px',
	marginBottom: '10px',
	fontWeight: 'bold',
});

const loadingStatusStyle = css({
	backgroundColor: '#fff3cd',
	color: '#856404',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#ffeaa7',
});

const readyStatusStyle = css({
	backgroundColor: '#d4edda',
	color: '#155724',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#c3e6cb',
});

const infoStyle = css({
	backgroundColor: '#e2e3e5',
	color: '#383d41',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#d6d8db',
	padding: '10px',
	borderRadius: '4px',
	fontSize: '14px',
	lineHeight: '1.4',
});

const interactionIdStyle = css({
	fontFamily: 'monospace',
	backgroundColor: '#f8f9fa',
	padding: '2px 4px',
	borderRadius: '3px',
});

const buttonStyle = css({
	padding: '8px 16px',
	backgroundColor: '#0052CC',
	color: 'white',
	border: 'none',
	borderRadius: '3px',
	cursor: 'pointer',
	fontSize: '14px',
	'&:hover': {
		backgroundColor: '#0052CCCC',
	},
});

// Custom hook for simulating loading states
const useLoadingState = (duration: number) => {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, duration);
		return () => clearTimeout(timer);
	}, [duration]);

	return isLoading;
};

// Component that demonstrates UFOLoadHold behavior
const LoadingSection = ({ name, duration }: { name: string; duration: number }) => {
	const isLoading = useLoadingState(duration);

	if (isLoading) {
		return (
			<UFOLoadHold name={name}>
				<div css={[statusStyle, loadingStatusStyle]}>
					Loading {name}... (will complete in {duration}ms)
				</div>
			</UFOLoadHold>
		);
	}

	return <div css={[statusStyle, readyStatusStyle]}>✓ {name} loaded successfully!</div>;
};

// Component to display current interaction ID
const InteractionIdDisplay = () => {
	const [currentId, setCurrentId] = useState<string | null>(DefaultInteractionID.current);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentId(DefaultInteractionID.current);
		}, 100);
		return () => clearInterval(interval);
	}, []);

	return (
		<div css={infoStyle}>
			<strong>Current Interaction ID:</strong>{' '}
			<span css={interactionIdStyle}>{currentId || 'null'}</span>
		</div>
	);
};

export default function LoadHoldInteractionIdTrackingExample(): JSX.Element {
	const [key, setKey] = useState(0);

	const startNewInteraction = (event: React.MouseEvent) => {
		// Use traceUFOInteraction to properly start a new UFO interaction
		traceUFOInteraction('load-hold-example-interaction', event);
		setKey((prev) => prev + 1);
	};

	return (
		<UFOSegment name="load-hold-interaction-id-tracking-example">
			<div css={containerStyle}>
				<h1 css={headerStyle}>UFOLoadHold Interaction ID Tracking Example</h1>

				<div css={infoStyle}>
					<p>
						This example demonstrates how UFOLoadHold components react to interaction ID changes.
						{/* eslint-disable-next-line @atlaskit/design-system/no-html-code */}
						When a new UFO interaction is started using <code>traceUFOInteraction</code>,
						UFOLoadHold components will automatically call their hold function again, ensuring they
						participate in the new interaction.
					</p>
				</div>

				<InteractionIdDisplay />

				<div css={buttonContainerStyle}>
					<button css={buttonStyle} onClick={startNewInteraction}>
						Start New Interaction
					</button>
				</div>

				<div css={sectionStyle}>
					<h3>Loading Sections (will auto-reload on interaction change)</h3>
					<LoadingSection key={`section1-${key}`} name="Section 1" duration={2000} />
					<LoadingSection key={`section2-${key}`} name="Section 2" duration={3000} />
					<LoadingSection key={`section3-${key}`} name="Section 3" duration={4000} />
				</div>

				<div css={infoStyle}>
					<h4>How to test:</h4>
					<ol>
						<li>
							Click "Start New Interaction" to trigger a new UFO interaction using{' '}
							{/* eslint-disable-next-line @atlaskit/design-system/no-html-code */}
							<code>traceUFOInteraction</code>
						</li>
						<li>Observe how the loading sections restart when the interaction ID changes</li>
						<li>Watch the interaction ID display update in real-time</li>
						<li>
							Notice how UFOLoadHold components automatically participate in the new interaction
						</li>
					</ol>
				</div>
			</div>
		</UFOSegment>
	);
}
