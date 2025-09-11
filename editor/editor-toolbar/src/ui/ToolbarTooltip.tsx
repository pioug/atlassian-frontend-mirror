import React from 'react';

import type { PositionType } from '@atlaskit/tooltip';
import Tooltip from '@atlaskit/tooltip';

type ToolbarTooltipProps = {
	children: React.ReactNode;
	content: React.ReactNode;
	delay?: number;
	position?: PositionType;
};

export const ToolbarTooltip = ({
	content,
	children,
	position = 'top',
	delay,
}: ToolbarTooltipProps) => {
	return (
		<Tooltip content={content} position={position} delay={delay}>
			{children}
		</Tooltip>
	);
};
