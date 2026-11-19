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

const rightControlStyles = css({
	display: 'flex',
	alignItems: 'center',
	marginRight: token('space.150'),
});

const insetViewerRightControlStyles = css({
	marginRight: token('space.0'),
});

export type RightControlsProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

export const RightControls = ({ children, ...props }: RightControlsProps): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	const isInsetFullscreen = useIsInsetFullscreen();
	return (
		<div
			css={[
				rightControlStyles,
				(isInsetViewer || isInsetFullscreen) && insetViewerRightControlStyles,
			]}
			{...props}
		>
			{children}
		</div>
	);
};
