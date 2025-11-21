import React, { memo } from 'react';

import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/core/migration/chevron-down--hipchat-chevron-down';
import ChevronUpIcon from '@atlaskit/icon/core/migration/chevron-up--hipchat-chevron-up';
import CrossIcon from '@atlaskit/icon/core/migration/cross';

import { flagTextColorToken } from '../theme';
import { type AppearanceTypes } from '../types';

interface DismissButtonProps {
	appearance: AppearanceTypes;
	onClick: (...args: any) => void;
	isExpanded: boolean;
	isBold: boolean;
	testId?: string;
}

const DismissButtonComponent = ({
	appearance,
	onClick,
	isBold,
	isExpanded,
	testId,
}: DismissButtonProps): React.JSX.Element => {
	let ButtonIcon = CrossIcon;
	let buttonLabel = 'Dismiss';

	let size: 'small' | 'medium' = 'small';
	let buttonTestId = testId && `${testId}-dismiss`;

	if (isBold) {
		ButtonIcon = isExpanded ? ChevronUpIcon : ChevronDownIcon;
		buttonLabel = isExpanded ? 'Collapse' : 'Expand';
		size = 'medium';
		buttonTestId = testId && `${testId}-toggle`;
	}

	return (
		<IconButton
			icon={(iconProps) => (
				<ButtonIcon
					{...iconProps}
					LEGACY_size={size}
					size="small"
					label=""
					color={flagTextColorToken[appearance]}
				/>
			)}
			appearance="subtle"
			spacing="compact"
			label={buttonLabel}
			onClick={onClick}
			aria-expanded={isBold ? isExpanded : undefined}
			testId={buttonTestId}
		/>
	);
};

const DismissButton = memo(DismissButtonComponent);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default DismissButton;
