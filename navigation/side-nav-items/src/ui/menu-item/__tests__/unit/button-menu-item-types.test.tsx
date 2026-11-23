import React, { createRef } from 'react';

import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { ButtonMenuItem, type ButtonMenuItemProps } from '../../button-menu-item';

const gate = 'navx_button_menu_item_types';

describe('ButtonMenuItem types', () => {
	it('should preserve the legacy selected appearance when type is omitted', () => {
		setupComponent({ isSelected: true });
		expect(screen.getByRole('listitem')).toBeVisible();
		expect(screen.getByTestId('item-container')).toHaveAttribute('data-selected', 'true');
		expect(screen.queryByTestId('item-selected-indicator')).not.toBeInTheDocument();
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-current');
	});

	it('should ignore selection for explicit default actions', () => {
		setupComponent({ type: 'default', isSelected: true });
		expect(screen.getByRole('button')).not.toHaveAttribute('tabindex');
		expect(screen.getByTestId('item-container')).toHaveAttribute('data-selected', 'false');
		expect(screen.queryByTestId('item-selected-indicator')).not.toBeInTheDocument();
	});

	it('should highlight an expanded popup regardless of isSelected', () => {
		setupComponent({
			type: 'popup',
			isSelected: false,
			'aria-expanded': true,
			'aria-haspopup': 'menu',
		});
		expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'menu');
		expect(screen.getByTestId('item-container')).toHaveAttribute('data-selected', 'true');
		expect(screen.queryByTestId('item-selected-indicator')).not.toBeInTheDocument();
	});

	it('should not highlight a collapsed popup even when isSelected is true', () => {
		setupComponent({
			type: 'popup',
			isSelected: true,
			'aria-expanded': false,
			'aria-haspopup': 'menu',
		});
		expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
		expect(screen.getByRole('button')).toHaveAttribute('aria-haspopup', 'menu');
		expect(screen.getByTestId('item-container')).toHaveAttribute('data-selected', 'false');
		expect(screen.queryByTestId('item-selected-indicator')).not.toBeInTheDocument();
	});

	it('should mark a selected location as current and show its notch', () => {
		setupComponent({ type: 'location', isSelected: true });
		expect(screen.getByTestId('item-selected-indicator')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByTestId('item-container')).toHaveCompiledCss(
			'--notch-color',
			'var(--ds-background-selected-bold,#1868db)',
		);
		expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'page');
	});

	it('should not mark an unselected location as current or show its notch', () => {
		setupComponent({ type: 'location', isSelected: false });
		expect(screen.getByTestId('item-selected-indicator')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByTestId('item-container')).toHaveCompiledCss('--notch-color', 'transparent');
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-current');
	});

	describe('with tab semantics', () => {
		it('should expose selected tab semantics and panel relationships', () => {
			setupComponent({
				semantics: 'tab',
				type: 'location',
				isSelected: true,
				id: 'details-tab',
				'aria-controls': 'details-panel',
			});
			const tab = screen.getByRole('tab', { name: 'Details', selected: true });
			expect(tab.tagName).toBe('BUTTON');
			expect(tab).toHaveAttribute('id', 'details-tab');
			expect(tab).toHaveAttribute('aria-controls', 'details-panel');
			expect(tab).toHaveAttribute('tabindex', '0');
			expect(tab).not.toHaveAttribute('aria-current');
			expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
			expect(screen.getByRole('none')).toBeVisible();
		});

		it('should expose unselected tab semantics and panel relationships', () => {
			setupComponent({
				semantics: 'tab',
				type: 'location',
				isSelected: false,
				id: 'details-tab',
				'aria-controls': 'details-panel',
			});
			const tab = screen.getByRole('tab', { name: 'Details', selected: false });
			expect(tab.tagName).toBe('BUTTON');
			expect(tab).toHaveAttribute('id', 'details-tab');
			expect(tab).toHaveAttribute('aria-controls', 'details-panel');
			expect(tab).toHaveAttribute('tabindex', '-1');
			expect(tab).not.toHaveAttribute('aria-current');
			expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
			expect(screen.getByRole('none')).toBeVisible();
		});
	});

	describe('accessibility', () => {
		it('should pass accessibility checks for a default button in a list', async () => {
			const { container } = setupComponent({ type: 'default' });
			await expect(container).toBeAccessible();
		});

		it('should pass accessibility checks for a popup trigger in a list', async () => {
			const { container } = setupComponent({
				type: 'popup',
				'aria-expanded': false,
				'aria-haspopup': 'menu',
			});
			await expect(container).toBeAccessible();
		});

		it('should pass accessibility checks for a selected location in a list', async () => {
			const { container } = setupComponent({ type: 'location', isSelected: true });
			await expect(container).toBeAccessible();
		});

		it('should pass accessibility checks for a tab with its tablist and panel', async () => {
			const { container } = setupComponent({
				semantics: 'tab',
				type: 'location',
				isSelected: true,
				'aria-controls': 'details-panel',
			});
			await expect(container).toBeAccessible();
		});
	});

	it('should announce an unselected tab when isSelected is omitted', () => {
		setupComponent({ semantics: 'tab' });
		const tab = screen.getByRole('tab');
		expect(tab).toHaveAttribute('aria-selected', 'false');
		expect(tab).toHaveAttribute('tabindex', '-1');
	});

	it('should forward focus, keyboard, click, and refs for a parent tabs controller', async () => {
		const onFocusMock = jest.fn();
		const onKeyDownMock = jest.fn();
		const onClickMock = jest.fn();
		const ref = createRef<HTMLButtonElement>();
		const listItemRef = createRef<HTMLDivElement>();
		setupComponent({
			semantics: 'tab',
			isSelected: true,
			ref,
			listItemRef,
			onFocus: onFocusMock,
			onKeyDown: onKeyDownMock,
			onClick: onClickMock,
		});
		const tab = screen.getByRole('tab');
		await userEvent.tab();
		expect(tab).toHaveFocus();
		expect(onFocusMock).toHaveBeenCalledTimes(1);
		await userEvent.keyboard('{ArrowDown}');
		expect(onKeyDownMock).toHaveBeenCalledWith(
			expect.objectContaining({ key: 'ArrowDown', target: tab }),
		);
		await userEvent.keyboard('{Enter}');
		expect(onClickMock).toHaveBeenCalledTimes(1);
		expect(ref.current).toBe(tab);
		expect(listItemRef.current).toHaveAttribute('role', 'none');
	});

	it('should keep disabled tabs non-interactive', async () => {
		const onClickMock = jest.fn();
		setupComponent({
			semantics: 'tab',
			type: 'location',
			isDisabled: true,
			isSelected: true,
			onClick: onClickMock,
		});
		expect(screen.getByRole('tab')).toBeDisabled();
		await userEvent.click(screen.getByRole('tab'));
		expect(onClickMock).not.toHaveBeenCalled();
	});

	it('should preserve existing behavior when the rollout gate is off', () => {
		setupComponent({
			semantics: 'tab',
			type: 'location',
			isSelected: true,
			id: 'ignored',
			isLegacy: true,
		});
		expect(screen.getByRole('listitem')).toBeVisible();
		expect(screen.getByRole('button')).not.toHaveAttribute('id');
		expect(screen.getByRole('button')).not.toHaveAttribute('aria-selected');
		expect(screen.getByRole('button')).not.toHaveAttribute('tabindex');
		expect(screen.getByTestId('item-container')).toHaveAttribute('data-selected', 'true');
		expect(screen.queryByTestId('item-selected-indicator')).not.toBeInTheDocument();
	});
});

function setupComponent({
	// Use the legacy list arrangement when the rollout gate is disabled.
	isLegacy = false,
	...props
}: Partial<ButtonMenuItemProps> &
	React.RefAttributes<HTMLButtonElement> & { isLegacy?: boolean } = {}) {
	if (isLegacy) {
		failGate(gate);
	} else {
		passGate(gate);
	}
	const isTab = props.semantics === 'tab' && !isLegacy;
	return render(
		<>
			<div role={isTab ? 'tablist' : 'list'} aria-label="Settings">
				<ButtonMenuItem testId="item" id={isTab ? 'details-tab' : undefined} {...props}>
					{props.children ?? 'Details'}
				</ButtonMenuItem>
			</div>
			{isTab && <div role="tabpanel" id="details-panel" aria-labelledby="details-tab" />}
		</>,
	);
}
