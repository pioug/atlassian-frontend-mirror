import React from 'react';

import { useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';

import { type LinkInfoButtonProps } from './types';

const LinkInfoButton = ({ content, icon, label, onClick, testId }: LinkInfoButtonProps) => {
	const onMouseDown = useMouseDownEvent();
	const { formatMessage } = useIntl();

	return (
		<Tooltip content={content} hideTooltipOnClick={true} tag="span" testId={`${testId}-tooltip`}>
			<IconButton
				appearance="subtle"
				icon={icon}
				label={formatMessage(label)}
				onClick={onClick}
				onMouseDown={onMouseDown}
				testId={`${testId}-button`}
			/>
		</Tooltip>
	);
};

export default LinkInfoButton;
