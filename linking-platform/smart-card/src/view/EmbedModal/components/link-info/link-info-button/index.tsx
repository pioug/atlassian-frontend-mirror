import React, { type RefObject } from 'react';

import { IconButton, type IconProp } from '@atlaskit/button/new';
import { fg } from '@atlaskit/platform-feature-flags';
import Tooltip from '@atlaskit/tooltip';

import { useMouseDownEvent } from '../../../../../state/analytics/useLinkClicked';

export type LinkInfoButtonProps = {
	content: React.ReactNode;
	focusRef?: RefObject<HTMLButtonElement>;
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
	focusRef,
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
				{...(fg('navx-4719-a11y-embed-modal-focus-states') ? { ref: focusRef } : {})}
			/>
		</Tooltip>
	);
};

export default LinkInfoButton;
