import React from 'react';

import Tooltip from '@atlaskit/tooltip';

type ToolbarTooltipProps = {
	content: string;
	children: React.ReactNode;
};

export const ToolbarTooltip = ({ content, children }: ToolbarTooltipProps) => {
	return <Tooltip content={content}>{children}</Tooltip>;
};
