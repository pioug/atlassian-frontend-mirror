import React from 'react';

import type { PositionType } from '@atlaskit/tooltip';
import Tooltip from '@atlaskit/tooltip';

type ToolbarTooltipProps = {
	children: React.ReactNode;
	content: React.ReactNode;
	delay?: number;
	position?: PositionType;
	shortcut?: string[];
};

export const ToolbarTooltip = ({
	content,
	shortcut,
	children,
	position = 'top',
	delay,
}: ToolbarTooltipProps): React.JSX.Element => {
	return (
		<Tooltip content={content} position={position} delay={delay} shortcut={shortcut}>
			{children}
		</Tooltip>
	);
};
