import React from 'react';

import Spinner from '@atlaskit/spinner';

import { type Appearance, type ButtonSpacing } from '../types';

function getIconSpacing(spacing?: ButtonSpacing) {
	switch (spacing) {
		case 'compact':
			return 'small';
		case 'none':
			return 'xsmall';
		default:
			return 'medium';
	}
}

function getSpinnerAppearance({
	appearance,
	isDisabled,
	isSelected,
}: {
	appearance?: Appearance;
	isDisabled?: boolean;
	isSelected?: boolean;
}): 'inherit' | 'invert' {
	if (isDisabled || isSelected) {
		return 'inherit';
	}
	if (appearance === 'primary' || appearance === 'danger' || appearance === 'discovery') {
		return 'invert';
	}
	return 'inherit';
}

export default function renderLoadingOverlay({
	appearance,
	spacing,
	isDisabled,
	isSelected,
	testId,
}: {
	spacing?: ButtonSpacing;
	appearance?: Appearance;
	isDisabled?: boolean;
	isSelected?: boolean;
	testId?: string;
}) {
	return (
		<Spinner
			size={getIconSpacing(spacing)}
			appearance={getSpinnerAppearance({
				appearance,
				isDisabled,
				isSelected,
			})}
			testId={testId ? `${testId}--loading-spinner` : undefined}
		/>
	);
}
