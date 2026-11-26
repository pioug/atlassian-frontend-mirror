import React, { useState } from 'react';

import { skipA11yAudit } from '@af/accessibility-testing/skip-a11y-audit';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { type OptionsType } from '../../../types';
import { PopupSelect } from '../../popup-select';

/**
 * Whether `isOpen` is controlled is decided once, at mount. When it is `undefined` at mount, the popup
 * is not controlled: a pick, Escape and an outside press close it, even while the consumer passes
 * `true`. A later `true` or `false` opens or closes the popup, and a later `undefined` keeps it as it
 * is. This is the legacy rule, and the top-layer path keeps it.
 */

const OPTIONS: OptionsType = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
];

const user = userEvent.setup();

function getTrigger(): HTMLElement {
	return screen.getByRole('button', { name: 'Choose' });
}

function getPopupMenu(): HTMLElement | null {
	return screen.queryByText('Brisbane');
}

/**
 * Lets the queued `toggle` events and focus returns run.
 */
async function flushTasks() {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 20));
	});
}

async function openByTrigger() {
	await user.click(getTrigger());
	expect(await screen.findByText('Brisbane')).toBeInTheDocument();
	expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
}

function expectClosed() {
	expect(getPopupMenu()).not.toBeInTheDocument();
	expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
}

/**
 * Passes `isOpen` only while open, and clears it in `onMenuClose` (as some product filters do).
 */
function OpenOnlyPopupSelect() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<PopupSelect
			options={OPTIONS}
			label="Cities"
			isOpen={isOpen ? true : undefined}
			onMenuClose={() => setIsOpen(false)}
			target={({ isOpen: _isOpen, ...triggerProps }) => (
				<button type="button" {...triggerProps} onClick={() => setIsOpen(true)}>
					Choose
				</button>
			)}
		/>
	);
}

/**
 * Passes `isOpen` only while open, and does not clear it when the popup closes.
 */
function OpenOnlyNoClearPopupSelect() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<PopupSelect
			options={OPTIONS}
			label="Cities"
			isOpen={isOpen ? true : undefined}
			target={({ isOpen: _isOpen, ...triggerProps }) => (
				<button type="button" {...triggerProps} onClick={() => setIsOpen(true)}>
					Choose
				</button>
			)}
		/>
	);
}

/**
 * Passes `isOpen` only while hidden (as a picker does while its footer opens a modal).
 */
function HiddenOnlyPopupSelect() {
	const [isHidden, setIsHidden] = useState(false);
	return (
		<>
			<button type="button" onClick={() => setIsHidden(false)}>
				Done
			</button>
			<PopupSelect
				options={OPTIONS}
				label="Cities"
				isOpen={isHidden ? false : undefined}
				footer={
					<button type="button" onClick={() => setIsHidden(true)}>
						Configure
					</button>
				}
				target={({ isOpen: _isOpen, ...triggerProps }) => (
					<button type="button" {...triggerProps}>
						Choose
					</button>
				)}
			/>
		</>
	);
}

/**
 * Passes `isOpen` only while open, and opens the popup from a button that is not the trigger.
 */
function OpenFromOutsidePopupSelect() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<button type="button" onClick={() => setIsOpen(true)}>
				Open cities
			</button>
			<PopupSelect
				options={OPTIONS}
				label="Cities"
				isOpen={isOpen ? true : undefined}
				onMenuClose={() => setIsOpen(false)}
				target={({ isOpen: _isOpen, ...triggerProps }) => (
					<button type="button" {...triggerProps}>
						Choose
					</button>
				)}
			/>
		</>
	);
}

describe.each([
	['legacy', failGate],
	['top-layer', passGate],
] as const)('PopupSelect %s: isOpen undefined at mount', (_path, setGate) => {
	beforeEach(() => {
		skipA11yAudit();
		setGate('platform-dst-top-layer');
	});

	describe('isOpen passed only while open', () => {
		it('should close on a pick, and focus the trigger', async () => {
			render(<OpenOnlyPopupSelect />);
			await openByTrigger();

			await user.click(screen.getByText('Brisbane'));
			await flushTasks();

			expectClosed();
			expect(getTrigger()).toHaveFocus();
		});

		it('should close on Escape', async () => {
			render(<OpenOnlyPopupSelect />);
			await openByTrigger();

			await user.keyboard('{Escape}');
			await flushTasks();

			expectClosed();
		});

		it('should close on an outside press', async () => {
			render(
				<>
					<button type="button">Outside</button>
					<OpenOnlyPopupSelect />
				</>,
			);
			await openByTrigger();

			await user.click(screen.getByRole('button', { name: 'Outside' }));
			await flushTasks();

			expectClosed();
		});

		it('should open again from the trigger after a close', async () => {
			render(<OpenOnlyPopupSelect />);
			await openByTrigger();
			await user.click(screen.getByText('Brisbane'));
			await flushTasks();
			expectClosed();

			await openByTrigger();
			await user.keyboard('{Escape}');
			await flushTasks();

			expectClosed();
		});

		it('should close on a pick and on Escape while isOpen stays true', async () => {
			render(<OpenOnlyNoClearPopupSelect />);
			await openByTrigger();

			await user.click(screen.getByText('Brisbane'));
			await flushTasks();
			expectClosed();

			// `isOpen` is still `true`, so the trigger click opens the popup without a new `isOpen`.
			await openByTrigger();
			await user.keyboard('{Escape}');
			await flushTasks();

			expectClosed();
		});

		it('should open when isOpen becomes true without a trigger click', async () => {
			render(<OpenFromOutsidePopupSelect />);

			await user.click(screen.getByRole('button', { name: 'Open cities' }));

			expect(await screen.findByText('Brisbane')).toBeInTheDocument();
			expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');

			await user.click(screen.getByText('Brisbane'));
			await flushTasks();

			expectClosed();
		});
	});

	describe('isOpen passed only while hidden', () => {
		it('should stay closed when isOpen goes from false back to undefined', async () => {
			render(<HiddenOnlyPopupSelect />);
			await openByTrigger();

			await user.click(screen.getByRole('button', { name: 'Configure' }));
			await flushTasks();
			expectClosed();

			await user.click(screen.getByRole('button', { name: 'Done' }));
			await flushTasks();

			expectClosed();
		});
	});
});
