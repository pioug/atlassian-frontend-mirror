import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import DateLabelDropdownTrigger from '../../ui/date-label-dropdown-trigger';

const hoveredTransition =
	'var(--ds-button-hovered,background-color border-color .15s cubic-bezier(.4,1,.6,1))';
const pressedTransition =
	'var(--ds-button-pressed,background-color border-color .15s cubic-bezier(.4,1,.6,1))';

describe('DateLabelDropdownTrigger motion', () => {
	it('uses button hover and pressed motion tokens when the labels motion gate is on', () => {
		passGate('platform-dst-motion-uplift-labels');
		render(<DateLabelDropdownTrigger label="29 Jul 2026" />);

		const trigger = screen.getByRole('button');
		expect(trigger).toHaveCompiledCss('transition', hoveredTransition);
		expect(trigger).toHaveCompiledCss('transition', pressedTransition, {
			target: ':active',
		});
	});

	it('fades content and the loading spinner when the labels motion gate is on', () => {
		passGate('platform-dst-motion-uplift-labels');
		render(<DateLabelDropdownTrigger label="29 Jul 2026" isLoading testId="date-label" />);

		const content = screen.getByTestId('date-label--content');
		const loadingOverlay = screen.getByTestId('date-label--loading-overlay');

		expect(content).toHaveCompiledCss('transition-property', 'opacity');
		expect(content).toHaveCompiledCss('transition-duration', 'var(--ds-duration-short,.15s)');
		expect(loadingOverlay).toHaveCompiledCss('animation-duration', 'var(--ds-duration-short,.15s)');
	});

	it('does not apply interactive motion tokens when the labels motion gate is off', () => {
		failGate('platform-dst-motion-uplift-labels');
		render(<DateLabelDropdownTrigger label="29 Jul 2026" />);

		const trigger = screen.getByRole('button');
		expect(trigger).not.toHaveCompiledCss('transition', hoveredTransition);
		expect(trigger).not.toHaveCompiledCss('transition', pressedTransition, {
			target: ':active',
		});
	});
});
