import React from 'react';

import { IconButton, type IconProp } from '@atlaskit/button/new';
import Tooltip from '@atlaskit/tooltip';

import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';

export type LinkInfoButtonProps = {
	content: React.ReactNode;
	icon: IconProp;
	label: string;
	onClick?: () => void;
	role?: string;
	testId?: string;
};

const LinkInfoButton = ({
	content,
	icon,
	label,
	onClick,
	testId,
	role,
}: LinkInfoButtonProps): React.JSX.Element => {
	const onMouseDown = useMouseDownEvent();

	return (
		<Tooltip content={content} hideTooltipOnClick={true} tag="span" testId={`${testId}-tooltip`}>
			<IconButton
				appearance="subtle"
				icon={icon}
				label={label}
				onClick={onClick}
				onMouseDown={onMouseDown}
				testId={`${testId}-button`}
				role={role}
			/>
		</Tooltip>
	);
};

export default LinkInfoButton;
