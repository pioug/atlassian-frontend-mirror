import React from 'react';

import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';

import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';

import { type OldLinkInfoButtonProps } from './types';

/**
 * @private
 * @deprecated Remove when cleaning up fg `platform-smart-card-remove-legacy-button` - EDM-12433
 */
const LinkInfoButton = ({
	content,
	href,
	icon,
	onClick,
	target,
	testId,
}: OldLinkInfoButtonProps) => {
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
