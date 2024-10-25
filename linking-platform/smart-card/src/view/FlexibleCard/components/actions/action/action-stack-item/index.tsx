import React from 'react';

import Tooltip from '@atlaskit/tooltip';

import ActionButton from './action-button';
import type { ActionStackItemProps } from './types';

const ActionStackItem = ({
	content,
	tooltipMessage,
	tooltipOnHide,
	hideTooltipOnMouseDown,
	hideTooltip,
	...props
}: ActionStackItemProps) =>
	hideTooltip ? (
		<ActionButton {...props} content={content} />
	) : (
		<Tooltip
			content={tooltipMessage || content}
			onHide={tooltipOnHide}
			hideTooltipOnMouseDown={hideTooltipOnMouseDown}
		>
			{(tooltipProps) => <ActionButton {...props} content={content} tooltipProps={tooltipProps} />}
		</Tooltip>
	);

export default ActionStackItem;
