import Tooltip from '@atlaskit/tooltip';
import React from 'react';

type Props = {
	children: React.ReactNode;
	tooltip: string;
};

/**
 * Wraps a disabled `<Mention>` chip with a tooltip explaining why the chip
 * is disabled. The chip itself remains non-interactive; the tooltip is the
 * sole hover affordance.
 */
export const DisabledMentionTooltip = ({ tooltip, children }: Props): React.JSX.Element => (
	<Tooltip content={tooltip} position="top">
		{(triggerProps) => <span {...triggerProps}>{children}</span>}
	</Tooltip>
);
