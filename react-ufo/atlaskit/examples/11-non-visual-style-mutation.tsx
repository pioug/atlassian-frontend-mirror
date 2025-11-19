/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef, useState } from 'react';

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

const contentDivStyle = css({
	backgroundColor: '#f9f9f9',
	padding: '20px',
	marginBottom: '10px',
	borderRadius: '4px',
	width: '80vw',
	height: '80vh',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
});

const initialInvisibleStyle = css({
	position: 'absolute',
	top: 0,
	left: 0,
	width: 0,
	height: 0,
	display: 'none',
});

const halfUpdatedInvisibleStyle = css({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '10vw',
	height: '100vh',
	cursor: 'pointer',
	display: 'block',
	backgroundColor: '#ff0000', // Red - for testing purposes it is visible. but the element is marked as non-visual-style-mutation
	opacity: 0.3,
});

const updatedInvisibleStyle = css({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '15vw',
	height: '100vh',
	cursor: 'pointer',
	display: 'block',
	backgroundColor: '#ff0000', // Red - for testing purposes it is visible. but the element is marked as non-visual-style-mutation
	opacity: 0.3,
});

// The only way to reproduce a similar behavior like Editor Lazy Node View
// is by faking a native vanilla app.
export default function Example(): JSX.Element {
	const contentRef = useRef<HTMLDivElement>(null);
	const [isMainLoading, setIsMainLoading] = useState(true);
	const [isInvisibleDivLoading, setIsInvisibleDivLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsMainLoading(false);
			setTimeout(() => {
				setIsInvisibleDivLoading(false);
			}, 200);
		}, 200);
	}, []);

	return (
		<UFOSegment name="app-root">
			<UFOLoadHold name="app-to-replace" hold={isMainLoading || isInvisibleDivLoading} />
			{!isMainLoading && (
				<div data-testid="main" ref={contentRef} css={mainStyles}>
					<div data-testid="content-div" css={contentDivStyle}>
						Content Div
					</div>
				</div>
			)}
			<div
				data-testid="nvs-div"
				data-vc-nvs="true"
				css={[
					initialInvisibleStyle,
					!isMainLoading && halfUpdatedInvisibleStyle,
					!isInvisibleDivLoading && updatedInvisibleStyle,
				]}
			></div>
		</UFOSegment>
	);
}
