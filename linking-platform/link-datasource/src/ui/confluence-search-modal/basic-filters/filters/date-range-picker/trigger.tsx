import React from 'react';

import NewButton from '@atlaskit/button/new';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import type { TriggerProps } from '@atlaskit/popup/types';

export interface PopupTriggerProps {
	triggerProps: TriggerProps;
	isSelected: boolean;
	labelPrefix: string;
	selectedLabel?: string;
	onClick: () => void;
}

export const PopupTrigger = ({
	triggerProps,
	isSelected,
	labelPrefix,
	selectedLabel,
	onClick,
}: PopupTriggerProps) => {
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
