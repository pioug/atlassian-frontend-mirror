import React from 'react';

import { styled } from '@compiled/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';
import Tooltip, { TooltipPrimitive, TooltipPrimitiveProps } from '@atlaskit/tooltip';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const InlineDialog = styled<TooltipPrimitiveProps>(TooltipPrimitive)({
	background: 'white',
	borderRadius: token('border.radius', '4px'),
	boxShadow: token('elevation.shadow.overlay'),
	boxSizing: 'content-box',
	color: token('color.text'),
	maxHeight: '300px',
	maxWidth: '300px',
	padding: `${token('space.100', '8px')} ${token('space.150', '12px')}`,
});

export default () => (
	<Tooltip component={InlineDialog} content="This is a tooltip">
		{(tooltipProps) => (
			<Button appearance="primary" {...tooltipProps}>
				Hover over me
			</Button>
		)}
	</Tooltip>
);
