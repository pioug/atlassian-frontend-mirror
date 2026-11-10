import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import Button from '@atlaskit/button/default/button';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import DropdownItem from '../../dropdown-item';
import DropdownMenu from '../../dropdown-menu';
import type { CustomTriggerProps } from '../../types';

describe('dropdown trigger context', () => {
	describe.each([true, false])('platform-dst-top-layer = %s', (isTopLayerEnabled) => {
		beforeEach(() => {
			if (isTopLayerEnabled) {
				passGate('platform-dst-top-layer');
			} else {
				failGate('platform-dst-top-layer');
			}
		});
		it('does not pass nested-menu metadata to custom button triggers', () => {
			if (isTopLayerEnabled) {
				passGate('platform-dst-new-menu');
			}
			const trigger = jest.fn(({ triggerRef, ...props }: CustomTriggerProps) => (
				<Button {...props} ref={triggerRef}>
					Options
				</Button>
			));
			render(
				<DropdownMenu trigger={trigger}>
					<DropdownItem>Action</DropdownItem>
				</DropdownMenu>,
			);

			expect(trigger.mock.calls[0][0]).not.toHaveProperty('hasNestedMenu');
			expect(screen.getByRole('button', { name: 'Options' })).not.toHaveAttribute('hasNestedMenu');
		});

		it('shows a chevron only on the submenu trigger and keeps it when selected', () => {
			passGate('platform-dst-new-menu');
			render(
				<DropdownMenu trigger="Options" defaultOpen>
					<DropdownMenu
						trigger={({ triggerRef, ...props }) => (
							<DropdownItem {...props} ref={triggerRef} testId="submenu">
								More
							</DropdownItem>
						)}
					>
						<DropdownItem testId="child" isSelected>
							Action
						</DropdownItem>
					</DropdownMenu>
				</DropdownMenu>,
			);

			expect(screen.getByTestId('submenu--chevron')).toBeInTheDocument();
			fireEvent.click(screen.getByTestId('submenu'));
			expect(screen.getByTestId('submenu--chevron')).toBeInTheDocument();
			expect(screen.queryByTestId('submenu--selected')).not.toBeInTheDocument();
			expect(screen.queryByTestId('child--chevron')).not.toBeInTheDocument();
			expect(screen.getByTestId('child--selected')).toBeInTheDocument();
		});
	});
});

it('supports an explicit submenu indicator without dropdown trigger context', () => {
	passGate('platform-dst-new-menu');
	render(
		<DropdownItem
			hasNestedMenu
			isSelected
			elemAfter={<span>Trailing content</span>}
			testId="custom-submenu"
		>
			More
		</DropdownItem>,
	);

	expect(screen.getByTestId('custom-submenu--chevron')).toBeInTheDocument();
	expect(screen.queryByTestId('custom-submenu--selected')).not.toBeInTheDocument();
	expect(screen.getByText('Trailing content')).toBeInTheDocument();
	expect(screen.getByTestId('custom-submenu')).not.toHaveAttribute('hasNestedMenu');
});
