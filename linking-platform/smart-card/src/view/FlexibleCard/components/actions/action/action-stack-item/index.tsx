import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import Tooltip from '@atlaskit/tooltip';

import { ActionName } from '../../../../../../constants';
import { useFlexibleUiContext } from '../../../../../../state/flexible-ui-context';

import ActionButton from './action-button';
import type { ActionStackItemProps } from './types';

const ActionStackItem = ({
	content,
	tooltipMessage,
	tooltipOnHide,
	hideTooltipOnMouseDown,
	hideTooltip,
	...props
}: ActionStackItemProps): React.JSX.Element => {
	const flexibleUiContext = useFlexibleUiContext();
	const isRovoAction = !!flexibleUiContext?.actions?.[ActionName.RovoChatAction];
	const isRovoPillVariant =
		isRovoAction &&
		fg('rovogrowth-640-inline-action-nudge-fg') &&
		expValEqualsNoExposure('rovogrowth-640-inline-action-nudge-exp', 'isEnabled', true);

	return hideTooltip ? (
		<ActionButton {...props} content={content} />
	) : (
		<Tooltip
			content={tooltipMessage || content}
			onHide={tooltipOnHide}
			hideTooltipOnMouseDown={hideTooltipOnMouseDown}
			position={isRovoPillVariant ? 'right' : undefined}
		>
			{(tooltipProps) => <ActionButton {...props} content={content} tooltipProps={tooltipProps} />}
		</Tooltip>
	);
};
export default ActionStackItem;
