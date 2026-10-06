/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

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
	return (
		<div css={[leftControlsStyles, isInsetViewer && insetViewerLeftControlsStyles]} {...props}>
			{children}
		</div>
	);
};
