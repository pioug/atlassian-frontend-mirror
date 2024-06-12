import React from 'react';

import Spinner, { type Appearance, type Size } from '@atlaskit/spinner';

import { type BaseProps } from '../types';

type LoadingSpinnerProps = Pick<BaseProps, 'appearance' | 'isDisabled' | 'isSelected' | 'spacing'>;

function getSpinnerAppearance({
	appearance,
	isDisabled,
	isSelected,
}: LoadingSpinnerProps): Appearance {
	if (isDisabled) {
		return 'inherit';
	}
	if (isSelected) {
		return 'invert';
	}
	if (appearance === 'primary' || appearance === 'danger') {
		return 'invert';
	}
	return 'inherit';
}

export default function LoadingSpinner({
	appearance,
	isDisabled,
	isSelected,
	spacing = 'default',
}: LoadingSpinnerProps) {
	const size: Size = spacing === 'default' ? 'medium' : 'small';

	return (
		<Spinner
			size={size}
			label=", Loading"
			appearance={getSpinnerAppearance({ appearance, isDisabled, isSelected })}
		/>
	);
}
