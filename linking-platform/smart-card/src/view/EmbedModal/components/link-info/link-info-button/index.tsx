import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';
import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';
import { type LinkInfoButtonProps } from './types';

const LinkInfoButton: React.FC<LinkInfoButtonProps> = ({
	content,
	href,
	icon,
	onClick,
	target,
	testId,
}) => {
	const onMouseDown = useMouseDownEvent();

	return (
		<Tooltip content={content} hideTooltipOnClick={true} tag="span" testId={`${testId}-tooltip`}>
			<Button
				appearance="subtle"
				href={href}
				iconBefore={icon}
				onClick={onClick}
				onMouseDown={onMouseDown}
				spacing="none"
				target={target}
				testId={`${testId}-button`}
			/>
		</Tooltip>
	);
};

export default LinkInfoButton;
