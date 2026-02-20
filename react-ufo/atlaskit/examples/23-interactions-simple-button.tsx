/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type MouseEvent as ReactMouseEvent, useCallback, useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { getConfig, setUFOConfig } from '@atlaskit/react-ufo/config';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';
import traceUFOInteraction from '@atlaskit/react-ufo/trace-interaction';

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
	marginRight: '10px',
	marginBottom: '10px',
});

const SectionContentOne = () => {
	const [showHold, setShowHold] = useState(false);
	const handleClick = useCallback((event: ReactMouseEvent<HTMLButtonElement>) => {
		traceUFOInteraction('test-click', event.nativeEvent);
		setShowHold(true);
		setTimeout(() => {
			setShowHold(false);
		}, 1000);
	}, []);
	const handleUnknownClick = useCallback((event: ReactMouseEvent<HTMLButtonElement>) => {
		traceUFOInteraction('unknown', event.nativeEvent);
		setShowHold(true);
		setTimeout(() => {
			setShowHold(false);
		}, 1000);
	}, []);
	return (
		<div id="test-container">
			<UFOSegment name="buttons-container">
				<button
					css={buttonStyle}
					id="test-button"
					onClick={handleClick}
					data-interaction-name="test-click"
				>
					new interaction button
				</button>
				<button css={buttonStyle} id="test-button2" onClick={handleUnknownClick}>
					unknown interaction button
				</button>
				{showHold && <UFOLoadHold name="show-hold">Loading</UFOLoadHold>}
			</UFOSegment>
		</div>
	);
};

const LongHoldPageLoad = () => {
	const [showHold, setShowHold] = useState(true);
	useEffect(() => {
		setTimeout(() => {
			setShowHold(false);
		}, 1000);
	}, []);
	return showHold ? <UFOLoadHold name="show-page-load-hold">Loading</UFOLoadHold> : null;
};

export default function Example(): JSX.Element {
	useEffect(() => {
		const config = getConfig();
		if (!config) {
			return;
		}
		const nextConfig = {
			...config,
			rates: {
				...config.rates,
				unknown: 1,
			},
		};
		setUFOConfig(nextConfig);

		return () => {
			setUFOConfig(config);
		};
	}, []);

	return (
		<UFOSegment name="app-root">
			<main id="app-main" css={mainStyles}>
				<SectionContentOne />
				<LongHoldPageLoad />
			</main>
		</UFOSegment>
	);
}
