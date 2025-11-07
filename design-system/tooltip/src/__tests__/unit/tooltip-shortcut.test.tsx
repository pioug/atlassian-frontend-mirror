import React from 'react';

import { act, render, screen, userEvent } from '@atlassian/testing-library';

import Tooltip from '../../tooltip';

const createUser = () => userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

describe('tooltip shortcuts', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('shortcuts flag enabled', () => {
		it('should display the keyboard shortcut in the tooltip when provided', async () => {
			const user = createUser();
			render(
				<Tooltip testId="tooltip" content="Save" shortcut={['Ctrl', '[']}>
					<button data-testid="trigger" type="button">
						focus me
					</button>
				</Tooltip>,
			);
			await user.hover(screen.getByTestId('trigger'));
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByRole('tooltip', { name: 'Save Ctrl [' })).toBeVisible();
		});

		it('should not include the keyboard shortcut in the hidden text for screen readers', async () => {
			const user = createUser();
			render(
				<Tooltip testId="tooltip" content="Save" shortcut={['Ctrl', '[']}>
					<button data-testid="trigger" type="button">
						focus me
					</button>
				</Tooltip>,
			);
			await user.hover(screen.getByTestId('trigger'));
			act(() => {
				jest.runAllTimers();
			});

			expect(screen.getByRole('tooltip', { name: 'Save Ctrl [' })).toBeVisible();

			// // The hidden element is used to announce the tooltip content to screen readers
			const hiddenElement = screen.getByTestId('tooltip-hidden');
			expect(hiddenElement).not.toHaveTextContent('Ctrl [');
			// Using regex to match the exact content of the hidden element. The string arg allows partial matching, which
			// we don't want here.
			expect(hiddenElement).toHaveTextContent(/^Save$/);
		});
	});
});
