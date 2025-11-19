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

const mediaDivStyleLoading = css({
	backgroundColor: '#999999',
	padding: '20px',
	marginBottom: '10px',
	borderRadius: '4px',
	width: '80vw',
	height: '80vh',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
});

const mediaDivStyleFinish = css({
	backgroundColor: '#00ff00',
	padding: '20px',
	marginBottom: '10px',
	borderRadius: '4px',
	width: '80vw',
	height: '80vh',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
});
const mediaDomAdditionDiv = css({
	backgroundColor: '#0000ff',
	padding: '20px',
	marginBottom: '10px',
	borderRadius: '4px',
	width: '50vw',
	height: '50vh',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
	position: 'absolute',
	bottom: '0',
	right: '0',
});

// The only way to reproduce a similar behavior like Editor Lazy Node View
// is by faking a native vanilla app.
export default function Example(): JSX.Element {
	const [isMainLoading, setIsMainLoading] = useState(true);
	const [isMediaStyleLoading, setIsMediaStyleLoading] = useState(true);

	const [isMediaDomAdditionLoading, setIsMediaDomAdditionLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsMainLoading(false);

			setTimeout(() => {
				setIsMediaStyleLoading(false);

				setTimeout(() => {
					setIsMediaDomAdditionLoading(false);
				}, 500);
			}, 500);
		}, 200);
	}, []);

	return (
		<UFOSegment name="app-root">
			<UFOLoadHold
				name="media-loading"
				hold={isMainLoading || isMediaStyleLoading || isMediaDomAdditionLoading}
			/>
			{!isMainLoading && (
				<div data-testid="main" css={mainStyles}>
					<div
						data-testid="media-style-mutation-div"
						data-media-vc-wrapper={true}
						css={[isMediaStyleLoading ? mediaDivStyleLoading : mediaDivStyleFinish]}
					>
						Content Div
					</div>
				</div>
			)}
			{!isMediaDomAdditionLoading && (
				<div
					data-testid="media-dom-addition-div"
					data-media-vc-wrapper={true}
					css={mediaDomAdditionDiv}
				>
					media-dom-addition-div
				</div>
			)}
		</UFOSegment>
	);
}
