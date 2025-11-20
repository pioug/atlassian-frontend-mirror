import React from 'react';

import { type MessageDescriptor, useIntl } from 'react-intl-next';

import { IconButton, type IconProp } from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';

export type LinkInfoButtonProps = {
	content: React.ReactNode;
	icon: IconProp;
	label: MessageDescriptor;
	onClick?: () => void;
	testId?: string;
};

const LinkInfoButton = ({
	content,
	icon,
	label,
	onClick,
	testId,
}: LinkInfoButtonProps): React.JSX.Element => {
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
