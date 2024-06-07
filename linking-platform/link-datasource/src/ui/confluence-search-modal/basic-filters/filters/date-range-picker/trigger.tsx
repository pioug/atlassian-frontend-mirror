import React from 'react';

import Button from '@atlaskit/button/standard-button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
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
		<Button
			{...triggerProps}
			testId={'confluence-search-modal--date-range-button'}
			onClick={onClick}
			isSelected={isSelected}
			iconAfter={
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<span style={{ display: 'flex', alignItems: 'center' }}>
					<ChevronDownIcon size="medium" label="" />
				</span>
			}
		>
			{labelPrefix}
			{selectedLabel ? `: ${selectedLabel}` : ''}
		</Button>
	);
};
