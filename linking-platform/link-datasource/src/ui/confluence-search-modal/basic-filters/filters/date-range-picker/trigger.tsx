import React from 'react';

import NewButton from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import type { TriggerProps } from '@atlaskit/popup/types';

export interface PopupTriggerProps {
	isSelected: boolean;
	labelPrefix: string;
	onClick: () => void;
	selectedLabel?: string;
	triggerProps: TriggerProps;
}

export const PopupTrigger = ({
	triggerProps,
	isSelected,
	labelPrefix,
	selectedLabel,
	onClick,
}: PopupTriggerProps): React.JSX.Element => {
	return (
		<NewButton
			{...triggerProps}
			testId={'confluence-search-modal--date-range-button'}
			onClick={onClick}
			isSelected={isSelected}
			iconAfter={() => <ChevronDownIcon label="" color="currentColor" size="small" />}
		>
			{labelPrefix}
			{selectedLabel ? `: ${selectedLabel}` : ''}
		</NewButton>
	);
};
