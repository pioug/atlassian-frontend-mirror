import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DropdownMenu from '@atlaskit/dropdown-menu/dropdown-menu';
import DropdownItem from '@atlaskit/dropdown-menu/dropdown-menu-item';
import DropdownItemGroup from '@atlaskit/dropdown-menu/dropdown-menu-item-group';
import FilterIcon from '@atlaskit/icon/core/filter';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import FilterButton from '../../../new-button/variants/filter/button';
import { expectTokenStyle } from '../_util/expect-token-style';

describe('FilterButton', () => {
	it('shows a decorative chevron by default without changing the accessible name', () => {
		failGate('platform-dst-tokens-finesse');
		render(<FilterButton trailingMetric={8}>Filter</FilterButton>);

		expect(screen.getByRole('button')).toHaveAccessibleName('Filter 8');
		expect(screen.getByRole('presentation', { hidden: true })).toBeInTheDocument();
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
		expect(screen.getByRole('button')).not.toHaveAttribute('haschevrondown');
	});

	it('preserves iconBefore when the chevron is hidden', () => {
		failGate('platform-dst-tokens-finesse');
		const { rerender } = render(
			<FilterButton iconBefore={FilterIcon} trailingMetric={8}>
				Filter
			</FilterButton>,
		);
		expect(screen.getAllByRole('presentation', { hidden: true })).toHaveLength(2);

		rerender(
			<FilterButton iconBefore={FilterIcon} trailingMetric={8} hasChevronDown={false}>
				Filter
			</FilterButton>,
		);
		expect(screen.getAllByRole('presentation', { hidden: true })).toHaveLength(1);
		expect(screen.getByRole('button')).toHaveAccessibleName('Filter 8');
	});

	it('renders zero and formatted counts, and hides an omitted count', () => {
		failGate('platform-dst-tokens-finesse');
		const { rerender } = render(<FilterButton trailingMetric={0}>Filter</FilterButton>);
		expect(screen.getByRole('button')).toHaveAccessibleName('Filter 0');
		rerender(<FilterButton trailingMetric="99+">Filter</FilterButton>);
		expect(screen.getByRole('button')).toHaveAccessibleName('Filter 99+');
		rerender(<FilterButton>Filter</FilterButton>);
		expect(screen.getByRole('button')).toHaveAccessibleName('Filter');
	});

	it('matches Badge geometry and small text', () => {
		failGate('platform-dst-tokens-finesse');
		render(
			<FilterButton trailingMetric="8" testId="filter">
				Filter
			</FilterButton>,
		);
		const metric = screen.getByTestId('filter--metric');
		expectTokenStyle(metric, 'min-width', 'space.300');
		expectTokenStyle(metric, 'padding-inline-start', 'space.050');
		expectTokenStyle(metric, 'padding-inline-end', 'space.050');
		expectTokenStyle(metric, 'border-radius', 'radius.xsmall');
		expect(metric).toHaveCompiledCss('flex-shrink', '0');
		expectTokenStyle(screen.getByText('8'), 'font', 'font.body.small');
	});

	it.each([false, true])(
		'uses information only for a selected count with Finesse off and isSelected=%s',
		(isSelected) => {
			failGate('platform-dst-tokens-finesse');
			render(
				<FilterButton trailingMetric="8" isSelected={isSelected}>
					Filter
				</FilterButton>,
			);
			const button = screen.getByRole('button');
			expectTokenStyle(
				button,
				'--ds-filter-button-metric-background',
				isSelected ? 'color.background.information.subtle' : 'color.background.accent.gray.subtler',
			);
			expectTokenStyle(
				button,
				'--ds-filter-button-metric-text',
				isSelected ? 'color.text.information.bolder' : 'color.text',
			);
			for (const state of [':hover', ':active']) {
				expectTokenStyle(
					button,
					'--ds-filter-button-metric-background',
					'color.background.neutral.hovered',
					state,
					!isSelected,
				);
			}
		},
	);

	it.each([false, true])(
		'uses neutral unselected and hover/press rules with Finesse=%s',
		(enabled) => {
			enabled ? passGate('platform-dst-tokens-finesse') : failGate('platform-dst-tokens-finesse');
			render(
				<FilterButton trailingMetric="8" testId="filter">
					Filter
				</FilterButton>,
			);
			const button = screen.getByRole('button');
			expectTokenStyle(
				button,
				'--ds-filter-button-metric-background',
				'color.background.accent.gray.subtler',
			);
			expectTokenStyle(
				button,
				'--ds-filter-button-metric-background',
				'color.background.neutral.hovered',
				':hover',
			);
			expectTokenStyle(
				button,
				'--ds-filter-button-metric-background',
				'color.background.neutral.hovered',
				':active',
			);
			expect(screen.getByTestId('filter--metric')).toHaveCompiledCss(
				'background-color',
				'var(--ds-filter-button-metric-background)',
			);
		},
	);

	it('uses the stronger neutral count on a selected filter', () => {
		passGate('platform-dst-tokens-finesse');
		render(
			<FilterButton trailingMetric="8" isSelected>
				Filter
			</FilterButton>,
		);
		expectTokenStyle(
			screen.getByRole('button'),
			'--ds-filter-button-metric-background',
			'color.background.neutral.hovered',
		);
	});

	it.each([
		{ enabled: false, isSelected: false },
		{ enabled: false, isSelected: true },
		{ enabled: true, isSelected: false },
		{ enabled: true, isSelected: true },
	])(
		'preserves disabled/loading with Finesse=$enabled and isSelected=$isSelected',
		({ enabled, isSelected }) => {
			enabled ? passGate('platform-dst-tokens-finesse') : failGate('platform-dst-tokens-finesse');
			const onClick = jest.fn();
			const { rerender } = render(
				<FilterButton trailingMetric="8" isDisabled isSelected={isSelected} onClick={onClick}>
					Filter
				</FilterButton>,
			);
			const disabledButton = screen.getByRole('button');
			expect(disabledButton).toBeDisabled();
			expectTokenStyle(
				disabledButton,
				'--ds-filter-button-metric-background',
				'color.background.disabled',
			);
			expectTokenStyle(disabledButton, '--ds-filter-button-metric-text', 'color.text.disabled');
			expectTokenStyle(
				disabledButton,
				'--ds-filter-button-metric-background',
				'color.background.information.subtle',
				'',
				false,
			);
			expectTokenStyle(
				disabledButton,
				'--ds-filter-button-metric-text',
				'color.text.information.bolder',
				'',
				false,
			);
			fireEvent.click(disabledButton);
			expect(onClick).not.toHaveBeenCalled();

			rerender(
				<FilterButton trailingMetric="8" isLoading isSelected={isSelected} onClick={onClick}>
					Filter
				</FilterButton>,
			);
			const loadingButton = screen.getByRole('button');
			expect(loadingButton).toHaveAttribute('aria-disabled', 'true');
			expectTokenStyle(
				loadingButton,
				'--ds-filter-button-metric-background',
				'color.background.disabled',
			);
			expectTokenStyle(loadingButton, '--ds-filter-button-metric-text', 'color.text.disabled');
			expectTokenStyle(
				loadingButton,
				'--ds-filter-button-metric-background',
				'color.background.information.subtle',
				'',
				false,
			);
			expectTokenStyle(
				loadingButton,
				'--ds-filter-button-metric-text',
				'color.text.information.bolder',
				'',
				false,
			);
			fireEvent.click(loadingButton);
			expect(onClick).not.toHaveBeenCalled();

			rerender(
				<FilterButton trailingMetric="8" isSelected={isSelected} onClick={onClick}>
					Filter
				</FilterButton>,
			);
			const interactiveButton = screen.getByRole('button');
			const selectedBackground = enabled
				? 'color.background.neutral.hovered'
				: 'color.background.information.subtle';
			expect(interactiveButton).toBeEnabled();
			expect(interactiveButton).not.toHaveAttribute('aria-disabled');
			expectTokenStyle(
				interactiveButton,
				'--ds-filter-button-metric-background',
				isSelected ? selectedBackground : 'color.background.accent.gray.subtler',
			);
			fireEvent.click(interactiveButton);
			expect(onClick).toHaveBeenCalledTimes(1);
		},
	);

	it('forwards ref, focus, native keyboard activation, and DOM attributes', async () => {
		failGate('platform-dst-tokens-finesse');
		const user = userEvent.setup();
		const ref = React.createRef<HTMLButtonElement>();
		const onClick = jest.fn();
		const onFocus = jest.fn();
		render(
			<FilterButton
				ref={ref}
				trailingMetric="8"
				onClick={onClick}
				onFocus={onFocus}
				aria-pressed="true"
			>
				Filter
			</FilterButton>,
		);
		const button = screen.getByRole('button');
		expect(ref.current).toBe(button);
		expect(button).toHaveAttribute('type', 'button');
		expect(button).toHaveAttribute('aria-pressed', 'true');
		expect(button).not.toHaveAttribute('rootxcss');
		expect(button).not.toHaveAttribute('filtermetricxcss');
		await user.tab();
		expect(button).toHaveFocus();
		expect(onFocus).toHaveBeenCalled();
		await user.keyboard('{Enter}');
		await user.keyboard(' ');
		expect(onClick).toHaveBeenCalledTimes(2);
	});

	it('supports compact spacing and keeps label truncation separate from the metric', () => {
		failGate('platform-dst-tokens-finesse');
		render(
			<FilterButton spacing="compact" trailingMetric="8">
				Long filter label
			</FilterButton>,
		);
		expect(screen.getByRole('button')).toHaveCompiledCss('height', '1.5rem');
		expect(screen.getByText('Long filter label')).toHaveCompiledCss('text-overflow', 'ellipsis');
	});

	it('works as an existing DropdownMenu custom trigger without a new menu API', async () => {
		failGate('platform-dst-tokens-finesse');
		const user = userEvent.setup();
		render(
			<DropdownMenu
				shouldRenderToParent
				trigger={({ triggerRef, ...triggerProps }) => (
					<FilterButton {...triggerProps} ref={triggerRef} trailingMetric="8">
						Filter
					</FilterButton>
				)}
			>
				<DropdownItemGroup>
					<DropdownItem>Status</DropdownItem>
				</DropdownItemGroup>
			</DropdownMenu>,
		);
		await user.click(screen.getByRole('button', { name: 'Filter 8' }));
		expect(screen.getByRole('button', { name: 'Filter 8' })).toHaveAttribute(
			'aria-expanded',
			'true',
		);
		expect(await screen.findByText('Status')).toBeVisible();
	});

	it.each([false, true])('is accessible with Finesse=%s', async (enabled) => {
		enabled ? passGate('platform-dst-tokens-finesse') : failGate('platform-dst-tokens-finesse');
		const { container } = render(
			<FilterButton trailingMetric="8" aria-pressed="true" isSelected>
				Filter
			</FilterButton>,
		);
		await expect(container).toBeAccessible();
	});
});
