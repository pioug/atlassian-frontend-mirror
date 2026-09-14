/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import type { MutedIndicatorProps } from './MutedIndicator';

const volumeToggleWrapperStyles = css({
	position: 'relative',
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginRight: '13px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		width: '36px !important',
	},
});

const mutedVolumeToggleWrapperStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles
		color: '#EF5C48 !important',
	},
});

export const VolumeToggleWrapper = ({
	isMuted,
	children,
	...props
}: MutedIndicatorProps &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => (
	<div css={[volumeToggleWrapperStyles, isMuted && mutedVolumeToggleWrapperStyles]} {...props}>
		{children}
	</div>
);
