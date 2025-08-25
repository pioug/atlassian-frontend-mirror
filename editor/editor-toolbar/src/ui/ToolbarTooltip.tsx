import React from 'react';

import type { PositionType } from '@atlaskit/tooltip';
import Tooltip from '@atlaskit/tooltip';

type ToolbarTooltipProps = {
	children: React.ReactNode;
	content: React.ReactNode;
	position?: PositionType;
};

export const ToolbarTooltip = ({ content, children, position = 'top' }: ToolbarTooltipProps) => {
	return (
		<Tooltip content={content} position={position}>
			{children}
		</Tooltip>
	);
};
