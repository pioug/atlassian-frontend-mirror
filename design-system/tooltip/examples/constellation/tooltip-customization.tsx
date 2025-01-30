import React from 'react';

import { styled } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';
import Tooltip, { TooltipPrimitive, TooltipPrimitiveProps } from '@atlaskit/tooltip';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const InlineDialog = styled<TooltipPrimitiveProps>(TooltipPrimitive)({
	background: 'white',
	borderRadius: '3px',
	boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
	boxSizing: 'content-box',
	paddingTop: token('space.100', '8px'),
	paddingRight: token('space.150', '12px'),
	paddingBottom: token('space.100', '8px'),
	paddingLeft: token('space.150', '12px'),
});

const TooltipCustomizationExample = () => (
	<Tooltip component={InlineDialog} content="This tooltip is styled like an inline dialog">
		{(tooltipProps) => <Button {...tooltipProps}>Hover or keyboard focus on me</Button>}
	</Tooltip>
);

export default TooltipCustomizationExample;
