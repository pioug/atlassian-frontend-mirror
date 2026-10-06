/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { useIsInsetViewer } from './insetViewerContext/useIsInsetViewer';

const currentTimeStyles = css({
	color: '#c7d1db',
	userSelect: 'none',
	marginRight: token('space.100'),
	whiteSpace: 'nowrap',
});

const insetViewerCurrentTimeStyles = css({
	color: token('color.text'),
});

export const CurrentTime = ({
	children,
	...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>): JSX.Element => {
	const isInsetViewer = useIsInsetViewer();
	return (
		<div css={[currentTimeStyles, isInsetViewer && insetViewerCurrentTimeStyles]} {...props}>
			{children}
		</div>
	);
};
export interface CurrentTimeTooltipProps {
	isDragging: boolean;
	timeLineThumbIsHover: boolean;
	timeLineThumbIsFocus: boolean;
}
