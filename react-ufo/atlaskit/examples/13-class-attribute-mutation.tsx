/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

const mainStyles = css({
	minWidth: '100vw',
	minHeight: '100vh',
	maxHeight: '100vh',
	backgroundColor: '#c0c2c23d',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

// The only way to reproduce a similar behavior like Editor Lazy Node View
// is by faking a native vanilla app.
export default function Example() {
	const [isMainLoading, setIsMainLoading] = useState(true);
	const [isWaitingForClassChange, setIsWaitingForClassChange] = useState(true);
	const [isWaitingForFinish, setIsWaitingForFinish] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsMainLoading(false);
			setTimeout(() => {
				setIsWaitingForClassChange(false);

				// additional wait because mutation observer is triggered asynchronously
				// if TTAI is too soon, we might miss the class mutation and test will fail
				setTimeout(() => {
					setIsWaitingForFinish(false);
				}, 200);
			}, 200);
		}, 200);
	}, []);

	return (
		<UFOSegment name="app-root">
			<UFOLoadHold name="loading" hold={isWaitingForFinish} />
			{!isMainLoading && (
				<div data-testid="main" css={mainStyles}>
					<div
						data-testid="content-div"
						css={mainStyles}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
						className={isWaitingForClassChange ? 'main_a' : 'main_b'}
					>
						Content Div
					</div>
				</div>
			)}
		</UFOSegment>
	);
}
