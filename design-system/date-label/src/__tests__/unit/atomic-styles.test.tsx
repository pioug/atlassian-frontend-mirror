import React from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';

import DateLabelDropdownTrigger from '../../ui/date-label-dropdown-trigger';

describe('atomic dropdown icon styles', () => {
	it('keeps state and icon semantics with atomic styles disabled', async () => {
		failGate('platform-date-label-atomic-styles');
		const { container, rerender } = render(
			<DateLabelDropdownTrigger label="Today" testId="date" />,
		);
		const trigger = screen.getByTestId('date');
		expect(trigger).toHaveAttribute('data-appearance', 'neutral');
		expect(
			screen.getByRole('img', {
				name: 'Date',
			}),
		).toBeInTheDocument();
		rerender(
			<DateLabelDropdownTrigger label="Today" testId="date" appearance="warning" isSelected />,
		);
		expect(trigger).toHaveAttribute('data-appearance', 'warning');
		expect(trigger).toHaveAttribute('data-selected', 'true');
		expect(
			screen.getByRole('img', {
				name: 'Warning',
			}),
		).toBeInTheDocument();
		await expect(container).toBeAccessible();
	});

	it('keeps state and icon semantics with atomic styles enabled', async () => {
		passGate('platform-date-label-atomic-styles');
		const { container, rerender } = render(
			<DateLabelDropdownTrigger label="Today" testId="date" />,
		);
		const trigger = screen.getByTestId('date');
		expect(trigger).not.toHaveAttribute('data-appearance');
		expect(trigger).toHaveCompiledCss('--date-label-icon-color', 'var(--ds-icon-subtlest,#6b6e76)');
		expect(
			screen.getByRole('img', {
				name: 'Date',
			}),
		).toBeInTheDocument();
		rerender(
			<DateLabelDropdownTrigger label="Today" testId="date" appearance="warning" isSelected />,
		);
		expect(trigger).not.toHaveAttribute('data-appearance');
		expect(trigger).not.toHaveAttribute('data-selected');
		expect(
			screen.getByRole('img', {
				name: 'Warning',
			}),
		).toBeInTheDocument();
		expect(trigger).toHaveCompiledCss('--date-label-icon-color', 'var(--ds-text-warning,#9e4c00)');
		rerender(<DateLabelDropdownTrigger label="Today" testId="date" appearance="danger" />);
		expect(trigger).toHaveCompiledCss('--date-label-icon-color', 'var(--ds-icon-danger,#c9372c)');
		rerender(<DateLabelDropdownTrigger label="Today" testId="date" isSpacious />);
		expect(trigger).toHaveCompiledCss('--date-label-icon-color', 'var(--ds-text-subtle,#505258)');
		rerender(<DateLabelDropdownTrigger label="Today" testId="date" />);
		expect(trigger).toHaveCompiledCss('--date-label-icon-color', 'var(--ds-icon-subtlest,#6b6e76)');
		await expect(container).toBeAccessible();
	});
});
