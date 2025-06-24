/* eslint-disable @atlaskit/design-system/no-html-button */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
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
		}, 500);
	}, [setShowHold]);
	return (
		<div id="test-container">
			<Button id="test-button" onClick={handleClick} interactionName="test-click">
				new interaction button
			</Button>
			<div data-testid="test1">
				<Button id="test-button2" onClick={handleClick}>
					unknown interaction button
				</Button>
			</div>
			{showHold && <UFOLoadHold name="show-hold">Loading</UFOLoadHold>}
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
