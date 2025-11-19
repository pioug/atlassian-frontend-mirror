/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';
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

// Main App component
export default function Example(): JSX.Element {
	const [waiting, setWaiting] = useState(false);
	const handleClick = useCallback(() => {
		if (waiting) {
			return;
		}
		setWaiting(true);
		// Simulate a transition to represents a user navigating to a different page after some time
		setTimeout(() => {
			traceUFOTransition('test-transition');
			setTimeout(() => {
				setWaiting(false);
			}, 500);
		}, 2000);
	}, [waiting, setWaiting]);

	return (
		<UFOSegment name="app-root">
			<main id="app-main" css={mainStyles}>
				<Button onClick={handleClick} interactionName="press-finish-on-transition">
					new interaction button
				</Button>
			</main>
			{waiting && <UFOLoadHold name="holding-transition">HOLD ACTIVE </UFOLoadHold>}
		</UFOSegment>
	);
}
