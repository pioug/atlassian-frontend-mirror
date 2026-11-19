/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { useIsInsetViewer } from './insetViewerContext/useIsInsetViewer';

const playPauseBlanketStyles = css({
	width: '100%',
	height: '100%',
	cursor: 'pointer',
});

const insetViewerPlayPauseBlanketStyles = css({
	display: 'grid',
	placeItems: 'center',
	minWidth: 0,
	minHeight: 0,
});

// Gives up height so the footer below isn't pushed off screen, and leaves a gap above it. The gray
// replaces the browser's black around the video, to match the footer.
const insetFooterPlayPauseBlanketStyles = css({
	minHeight: 0,
	boxSizing: 'border-box',
	paddingBlockEnd: token('space.025'),
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: '#22272A',
});

export const PlayPauseBlanket = ({
	children,
	hasInsetFooter,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
	hasInsetFooter?: boolean;
}): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div
			css={[
				playPauseBlanketStyles,
				isInsetViewer && insetViewerPlayPauseBlanketStyles,
				hasInsetFooter && insetFooterPlayPauseBlanketStyles,
			]}
			{...props}
		>
			{children}
		</div>
	);
};
