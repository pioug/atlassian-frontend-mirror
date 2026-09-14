import React, { type RefObject } from 'react';

import IconButton from '@atlaskit/button/icon/button';
import type { IconProp } from '@atlaskit/button/variants/types';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import { useMouseDownEvent } from '../../../../../state/analytics/useMouseDownEvent';

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
				ref={focusRef}
			/>
		</Tooltip>
	);
};

export default LinkInfoButton;
