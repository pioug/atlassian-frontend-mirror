/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { useIsInsetViewer } from './insetViewerContext/useIsInsetViewer';

const volumeTimeRangeWrapperStyles = css({
	width: '100%',
	marginRight: token('space.250'),
});

// The inset slider takes the same height as the buttons beside it and is centered in it.
const insetViewerVolumeTimeRangeWrapperStyles = css({
	display: 'flex',
	alignItems: 'center',
	height: token('space.400'),
});

export const VolumeTimeRangeWrapper = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div
			css={[volumeTimeRangeWrapperStyles, isInsetViewer && insetViewerVolumeTimeRangeWrapperStyles]}
			{...props}
		>
			{children}
		</div>
	);
};
