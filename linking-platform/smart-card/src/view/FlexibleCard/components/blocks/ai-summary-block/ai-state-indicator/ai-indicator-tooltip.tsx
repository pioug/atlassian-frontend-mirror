import React from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import Tooltip, { TooltipPrimitive } from '@atlaskit/tooltip';
import { token } from '@atlaskit/tokens';
import { Box, xcss } from '@atlaskit/primitives';

import type { AIIndicatorTooltipProps } from './types';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const AIIndicatorTooltipPrimitive = styled(TooltipPrimitive)({
	borderRadius: token('border.radius', '3px'),
	backgroundColor: token('elevation.surface.raised', 'white'),
	boxShadow: token(
		'elevation.shadow.overlay',
		'0px 8px 12px rgba(9, 30, 66, 0.15),0px 0px 1px rgba(9, 30, 66, 0.31)',
	),
	boxSizing: 'content-box',
	padding: token('space.200', '16px'),
	maxWidth: '350px',
});

const triggerStyles = xcss({ display: 'inline-flex' });

const AIIndicatorTooltip: React.FC<AIIndicatorTooltipProps> = ({
	content,
	trigger,
	xcss: overrideXcss,
}) => {
	return (
		<Tooltip component={AIIndicatorTooltipPrimitive} content={content} tag="span">
			{(tooltipProps) => (
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
				<Box xcss={[triggerStyles, overrideXcss]} {...tooltipProps}>
					{trigger}
				</Box>
			)}
		</Tooltip>
	);
};

export default AIIndicatorTooltip;
