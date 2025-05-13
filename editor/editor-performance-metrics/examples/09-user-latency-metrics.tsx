/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useLayoutEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { onUserLatency } from '@atlaskit/editor-performance-metrics/user-latency';

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
	borderRadius: '4px',
	padding: '10px',
	marginBottom: '5px',
	cursor: 'pointer',
	borderColor: '#D496A7',
	borderStyle: 'solid',
	borderWidth: '2px',
	width: '80%',
	fontSize: '3rem',
});

const niceBorderStyle = css({
	backgroundColor: '#e0f7fa',
	borderColor: '#00796b',
	borderStyle: 'solid',
	borderWidth: '2px',
});

function blockFor500Milliseconds() {
	const start = performance.now();
	let now = start;
	while (now - start < 500) {
		now = performance.now();
	}
}

const SectionContentOne = () => {
	const [showNiceBorder, setShowNiceBorder] = useState(false);
	const [counter, setCounter] = useState(0);

	const onClick = useCallback(() => {
		blockFor500Milliseconds();

		setCounter(counter + 1);
		setShowNiceBorder(!showNiceBorder);
	}, [counter, showNiceBorder]);

	useLayoutEffect(() => {
		if (counter === 0) {
			return;
		}

		// Simulate slow async tasks running on the main thread
		requestAnimationFrame(() => {
			blockFor500Milliseconds();
		});
	}, [counter]);

	return (
		<button
			data-testid={`click-me-button`}
			onMouseOver={onClick}
			onFocus={() => {}}
			css={[buttonStyle, showNiceBorder && niceBorderStyle]}
		>
			Click me, mate! {counter}x
		</button>
	);
};

export default function Example() {
	onUserLatency(() => {});

	return (
		<main id="app-main" css={mainStyles}>
			<SectionContentOne />
		</main>
	);
}
