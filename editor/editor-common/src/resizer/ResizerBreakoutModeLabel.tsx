import React from 'react';

import { useIntl } from 'react-intl-next';

import { Box, Inline, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { breakoutMessages as messages } from '../messages';
import type { BreakoutMode } from '../types';

const fullWidthLabelWrapperStyles = xcss({
	height: token('space.400', '32px'),
	display: 'flex',
	backgroundColor: 'elevation.surface.overlay',
	borderRadius: 'border.radius',
	boxShadow: 'elevation.shadow.overlay',
	boxSizing: 'border-box',
	alignItems: 'center',
});

const fullWidthLabelStyles = xcss({
	marginLeft: 'space.100',
	marginRight: 'space.100',
	paddingLeft: 'space.075',
	paddingRight: 'space.075',
	paddingTop: 'space.050',
	paddingBottom: 'space.050',
});

type props = {
	layout: BreakoutMode;
};

export const ResizerBreakoutModeLabel = ({ layout: breakoutLayout }: props) => {
	const { formatMessage } = useIntl();

	const message = React.useMemo(() => {
		switch (breakoutLayout) {
			case 'full-width':
				return formatMessage(messages.fullWidthLabel);
			case 'wide':
				return formatMessage(messages.wideWidthLabel);
			default:
				return null;
		}
	}, [breakoutLayout, formatMessage]);

	return (
		message && (
			<Box testId="resizer-breakout-mode-label" xcss={fullWidthLabelWrapperStyles}>
				<Inline xcss={fullWidthLabelStyles}>{message}</Inline>
			</Box>
		)
	);
};
