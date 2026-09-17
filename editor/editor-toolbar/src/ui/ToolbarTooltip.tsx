import React from 'react';

import type { PositionType } from '@atlaskit/tooltip/types';
import Tooltip from '@atlaskit/tooltip/Tooltip';

type ToolbarTooltipProps = {
	children?: React.ReactNode;
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
		<Tooltip
			content={content}
			position={position}
			delay={delay}
			shortcut={shortcut}
			// the information in toolbar tooltips is already announced by aria-label and aria-keyshortcuts on the item
			// so we need to disable screen reader announcement of tooltip to avoid duplicate announcements
			isScreenReaderAnnouncementDisabled
		>
			{children}
		</Tooltip>
	);
};
