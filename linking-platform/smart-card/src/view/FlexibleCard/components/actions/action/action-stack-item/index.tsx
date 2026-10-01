import React from 'react';

import Tooltip from '@atlaskit/tooltip/Tooltip';

import ActionButton from './action-button';
import type { ActionStackItemProps } from './types';

const ActionStackItem = ({
	content,
	tooltipMessage,
	tooltipOnHide,
	hideTooltipOnMouseDown,
	hasNewContentOnTriggerClick,
	hideTooltip,
	...props
}: ActionStackItemProps): React.JSX.Element => {
	return hideTooltip ? (
		<ActionButton {...props} content={content} />
	) : (
		<Tooltip
			content={tooltipMessage || content}
			onHide={tooltipOnHide}
			hideTooltipOnMouseDown={hideTooltipOnMouseDown}
			hasNewContentOnTriggerClick={hasNewContentOnTriggerClick}
		>
			{(tooltipProps) => <ActionButton {...props} content={content} tooltipProps={tooltipProps} />}
		</Tooltip>
	);
};
export default ActionStackItem;
