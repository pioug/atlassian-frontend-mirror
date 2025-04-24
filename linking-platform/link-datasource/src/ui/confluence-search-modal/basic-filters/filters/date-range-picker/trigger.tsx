import React from 'react';

import NewButton from '@atlaskit/button/new';
import Button from '@atlaskit/button/standard-button';
import ChevronDownIcon from '@atlaskit/icon/utility/chevron-down';
import ChevronDownIconOld from '@atlaskit/icon/utility/migration/chevron-down';
import { fg } from '@atlaskit/platform-feature-flags';
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
	if (fg('platform-linking-visual-refresh-sllv')) {
		return (
			<NewButton
				{...triggerProps}
				testId={'confluence-search-modal--date-range-button'}
				onClick={onClick}
				isSelected={isSelected}
				iconAfter={() => <ChevronDownIcon label="" color="currentColor" />}
			>
				{labelPrefix}
				{selectedLabel ? `: ${selectedLabel}` : ''}
			</NewButton>
		);
	}

	return (
		<Button
			{...triggerProps}
			testId={'confluence-search-modal--date-range-button'}
			onClick={onClick}
			isSelected={isSelected}
			iconAfter={
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<span style={{ display: 'flex', alignItems: 'center' }}>
					<ChevronDownIconOld LEGACY_size="medium" label="" color="currentColor" />
				</span>
			}
		>
			{labelPrefix}
			{selectedLabel ? `: ${selectedLabel}` : ''}
		</Button>
	);
};
