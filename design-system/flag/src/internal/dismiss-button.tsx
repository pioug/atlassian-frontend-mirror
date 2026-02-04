import React, { memo } from 'react';

import { IconButton } from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/core/chevron-up';
import CrossIcon from '@atlaskit/icon/core/cross';

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

	let buttonTestId = testId && `${testId}-dismiss`;

	if (isBold) {
		ButtonIcon = isExpanded ? ChevronUpIcon : ChevronDownIcon;
		buttonLabel = isExpanded ? 'Collapse' : 'Expand';
		buttonTestId = testId && `${testId}-toggle`;
	}

	return (
		<IconButton
			icon={(iconProps) => (
				<ButtonIcon {...iconProps} size="small" label="" color={flagTextColorToken[appearance]} />
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

const DismissButton: React.MemoExoticComponent<({ appearance, onClick, isBold, isExpanded, testId, }: DismissButtonProps) => React.JSX.Element> = memo(DismissButtonComponent);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default DismissButton;
