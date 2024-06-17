import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Tooltip, { TooltipPrimitive } from '../../src';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const InlineDialog = styled(TooltipPrimitive)({
	background: 'white',
	borderRadius: token('border.radius', '4px'),
	boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
	boxSizing: 'content-box',
	padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
});

const TooltipCustomizationExample = () => (
	<Tooltip component={InlineDialog} content="This tooltip is styled like an inline dialog">
		{(tooltipProps) => <Button {...tooltipProps}>Hover or keyboard focus on me</Button>}
	</Tooltip>
);

export default TooltipCustomizationExample;
