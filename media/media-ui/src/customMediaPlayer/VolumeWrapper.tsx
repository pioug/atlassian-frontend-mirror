/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const volumeStyles = css({
	display: 'flex',
	width: '35px',
	overflow: 'hidden',
	transition: 'width 0.3s',
	alignItems: 'center',
	bottom: token('space.0'),
	left: token('space.500'),
});

const showSliderVolumeStyles = css({
	'&:hover': {
		width: '150px',
		transition: 'width 0.3s ease-out',
	},
	'&:active': {
		width: '150px',
		transition: 'width 0.3s ease-out',
	},
	'&:focus-within': {
		width: '150px',
		transition: 'width 0.3s ease-out',
	},
});

export const VolumeWrapper = ({
	showSlider,
	children,
	...props
}: VolumeWrapperProps &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={[volumeStyles, showSlider && showSliderVolumeStyles]} {...props}>
		{children}
	</div>
);
export type VolumeWrapperProps = {
	showSlider: boolean;
};
