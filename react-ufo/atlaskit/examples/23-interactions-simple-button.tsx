/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useCallback, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

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

const SectionContentOne = () => {
	const [showHold, setShowHold] = useState(false);
	const handleClick = useCallback(() => {
		setShowHold(true);
		setTimeout(() => {
			setShowHold(false);
		}, 1000);
	}, [setShowHold]);
	return (
		<div id="test-container">
			<UFOSegment name="buttons-container">
				<Button id="test-button" onClick={handleClick} interactionName="test-click">
					new interaction button
				</Button>
				<Button id="test-button2" onClick={handleClick}>
					unknown interaction button
				</Button>
				{showHold && <UFOLoadHold name="show-hold">Loading</UFOLoadHold>}
			</UFOSegment>
		</div>
	);
};

export default function Example() {
	return (
		<UFOSegment name="app-root">
			<main id="app-main" css={mainStyles}>
				<SectionContentOne />
			</main>
		</UFOSegment>
	);
}
