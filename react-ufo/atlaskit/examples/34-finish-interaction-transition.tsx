/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type MouseEvent as ReactMouseEvent, useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';
import traceUFOInteraction from '@atlaskit/react-ufo/trace-interaction';
import traceUFOTransition from '@atlaskit/react-ufo/trace-transition';

const mainStyles = css({
	minWidth: '100vw',
	minHeight: '100vh',
	maxHeight: '100vh',
	backgroundColor: '#c0c2c23d',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
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

// Main App component
export default function Example(): JSX.Element {
	const [waiting, setWaiting] = useState(false);
	const handleClick = useCallback(
		(event: ReactMouseEvent<HTMLButtonElement>) => {
			if (waiting) {
				return;
			}
			traceUFOInteraction('press-finish-on-transition', event.nativeEvent);
			setWaiting(true);
			// Simulate a transition to represents a user navigating to a different page after some time
			setTimeout(() => {
				traceUFOTransition('test-transition');
				setTimeout(() => {
					setWaiting(false);
				}, 500);
			}, 2000);
		},
		[waiting, setWaiting],
	);

	return (
		<UFOSegment name="app-root">
			<main id="app-main" css={mainStyles}>
				<button
					css={buttonStyle}
					onClick={handleClick}
					data-interaction-name="press-finish-on-transition"
				>
					new interaction button
				</button>
			</main>
			{waiting && <UFOLoadHold name="holding-transition">HOLD ACTIVE </UFOLoadHold>}
		</UFOSegment>
	);
}
