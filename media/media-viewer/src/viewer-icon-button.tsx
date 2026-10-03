import React, { type MouseEvent, type ReactChild } from 'react';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import IconButton from '@atlaskit/button/icon/button';

type IconComponent = React.ComponentType<{
	label: string;
	spacing?: 'none' | 'spacious' | 'compact';
}>;

type ViewerIconButtonProps = {
	// Matches the underlying IconButton handler, which is also given the button's analytics event.
	onClick?: (event: MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => void;
	testId?: string;
	isDisabled?: boolean;
	isSelected?: boolean;
	label: string;
	icon?: IconComponent;
	iconBefore?: ReactChild;
	buttonRef?: React.Ref<HTMLButtonElement>;
};

export const ViewerIconButton = ({
	onClick,
	testId,
	isDisabled,
	isSelected,
	label,
	icon: Icon,
	iconBefore,
	buttonRef,
}: ViewerIconButtonProps): React.JSX.Element => (
	<IconButton
		ref={buttonRef}
		appearance="subtle"
		label={label}
		icon={Icon ? (iconProps) => <Icon {...iconProps} spacing="spacious" /> : () => iconBefore}
		onClick={onClick}
		isDisabled={isDisabled}
		isSelected={isSelected}
		isTooltipDisabled={false}
		spacing="default"
		testId={testId}
	/>
);
