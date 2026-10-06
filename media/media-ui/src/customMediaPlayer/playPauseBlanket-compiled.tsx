/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

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

export const PlayPauseBlanket = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div
			css={[playPauseBlanketStyles, isInsetViewer && insetViewerPlayPauseBlanketStyles]}
			{...props}
		>
			{children}
		</div>
	);
};
