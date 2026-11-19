/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { useIsInsetFullscreen } from './insetViewerContext/useIsInsetFullscreen';
import { useIsInsetViewer } from './insetViewerContext/useIsInsetViewer';

const leftControlsStyles = css({
	display: 'flex',
	marginLeft: token('space.150'),
});

const insetViewerLeftControlsStyles = css({
	marginLeft: token('space.0'),
});

export type LeftControlsProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

export const LeftControls = ({ children, ...props }: LeftControlsProps): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	const isInsetFullscreen = useIsInsetFullscreen();
	return (
		<div
			css={[
				leftControlsStyles,
				(isInsetViewer || isInsetFullscreen) && insetViewerLeftControlsStyles,
			]}
			{...props}
		>
			{children}
		</div>
	);
};
