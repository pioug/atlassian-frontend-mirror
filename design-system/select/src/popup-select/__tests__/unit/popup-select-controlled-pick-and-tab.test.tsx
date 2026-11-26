import React, { useState } from 'react';

import { skipA11yAudit } from '@af/accessibility-testing/skip-a11y-audit';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { type OptionsType } from '../../../types';
import { PopupSelect } from '../../popup-select';

/**
 * A pick and Tab close the popup only when its `isOpen` was not controlled at mount. With a
 * controlled `isOpen`, they do not close it and do not call `onClose` or `onMenuClose`: the consumer
 * decides (for example a multi-value picker stays open). This is the legacy rule, and the top-layer
 * path keeps it.
 */

const OPTIONS: OptionsType = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
];

const user = userEvent.setup();

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

type TCallbacks = {
	onChange: jest.Mock;
	onClose: jest.Mock;
	onMenuClose: jest.Mock;
};

function createCallbacks(): TCallbacks {
	return { onChange: jest.fn(), onClose: jest.fn(), onMenuClose: jest.fn() };
}

function clearCallbacks(callbacks: TCallbacks) {
	callbacks.onChange.mockClear();
	callbacks.onClose.mockClear();
	callbacks.onMenuClose.mockClear();
}

/**
 * `isOpen` is controlled from mount. The consumer opens the popup from its own trigger click, and
 * closes it only on an outside press or Escape (through `onClose`).
 */
function ControlledPopupSelect({ callbacks }: { callbacks: TCallbacks }) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<PopupSelect
			options={OPTIONS}
			label="Cities"
			isOpen={isOpen}
			onChange={callbacks.onChange}
			onClose={() => {
				callbacks.onClose();
				setIsOpen(false);
			}}
			onMenuClose={callbacks.onMenuClose}
			target={({ isOpen: _isOpen, ...triggerProps }) => (
				<button type="button" {...triggerProps} onClick={() => setIsOpen(true)}>
					Choose
				</button>
			)}
		/>
	);
}

/**
 * `isOpen` is `undefined` at mount, and `true` only while open (as in some product filters). The
 * popup is not controlled, so a pick and Tab close it through `onMenuClose`.
 */
function OpenOnlyPopupSelect({ callbacks }: { callbacks: TCallbacks }) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<PopupSelect
			options={OPTIONS}
			label="Cities"
			isOpen={isOpen ? true : undefined}
			onChange={callbacks.onChange}
			onClose={callbacks.onClose}
			onMenuClose={() => {
				callbacks.onMenuClose();
				setIsOpen(false);
			}}
			target={({ isOpen: _isOpen, ...triggerProps }) => (
				<button type="button" {...triggerProps} onClick={() => setIsOpen(true)}>
					Choose
				</button>
			)}
		/>
	);
}

/**
 * `isOpen` is controlled from mount, and `onChange` closes the popup. `blurInputOnSelect` is the
 * `react-select` default on a touch-capable device: the input loses focus on a pick.
 */
function CloseOnPickPopupSelect({ callbacks }: { callbacks: TCallbacks }) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<PopupSelect
			options={OPTIONS}
			label="Cities"
			isOpen={isOpen}
			blurInputOnSelect
			onChange={(...args) => {
				callbacks.onChange(...args);
				setIsOpen(false);
			}}
			onClose={callbacks.onClose}
			target={({ isOpen: _isOpen, ...triggerProps }) => (
				<button type="button" {...triggerProps} onClick={() => setIsOpen(true)}>
					Choose
				</button>
			)}
		/>
	);
}

function UncontrolledPopupSelect({ callbacks }: { callbacks: TCallbacks }) {
	return (
		<PopupSelect
			options={OPTIONS}
			label="Cities"
			onChange={callbacks.onChange}
			onClose={callbacks.onClose}
			onMenuClose={callbacks.onMenuClose}
			target={({ isOpen: _isOpen, ...triggerProps }) => (
				<button type="button" {...triggerProps}>
					Choose
				</button>
			)}
		/>
	);
}

async function open() {
	await user.click(screen.getByRole('button', { name: 'Choose' }));
	expect(await screen.findByText('Brisbane')).toBeInTheDocument();
}

describe.each([
	['legacy', failGate],
	['top-layer', passGate],
] as const)('PopupSelect %s: pick and Tab', (_path, setGate) => {
	beforeEach(() => {
		skipA11yAudit();
		setGate('platform-dst-top-layer');
	});

	describe('isOpen controlled at mount', () => {
		it('should stay open after a pick, and not ask to close', async () => {
			const callbacks = createCallbacks();
			render(<ControlledPopupSelect callbacks={callbacks} />);
			await open();
			// The top-layer path also calls `onClose` when the controlled `isOpen` is `false` (at mount).
			clearCallbacks(callbacks);

			await user.click(screen.getByText('Brisbane'));
			await flushTasks();

			expect(callbacks.onChange).toHaveBeenCalledTimes(1);
			expect(callbacks.onClose).not.toHaveBeenCalled();
			expect(callbacks.onMenuClose).not.toHaveBeenCalled();
			expect(getPopupMenu()).toBeInTheDocument();
		});

		it('should stay open after Tab, and not ask to close', async () => {
			const callbacks = createCallbacks();
			render(<ControlledPopupSelect callbacks={callbacks} />);
			await open();
			clearCallbacks(callbacks);

			await user.keyboard('{Tab}');
			await flushTasks();

			expect(callbacks.onClose).not.toHaveBeenCalled();
			expect(callbacks.onMenuClose).not.toHaveBeenCalled();
			expect(getPopupMenu()).toBeInTheDocument();
		});

		it('should focus the trigger when onChange closes the popup', async () => {
			const callbacks = createCallbacks();
			render(<CloseOnPickPopupSelect callbacks={callbacks} />);
			await open();

			await user.click(screen.getByText('Brisbane'));
			await flushTasks();

			expect(callbacks.onChange).toHaveBeenCalledTimes(1);
			expect(getPopupMenu()).not.toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Choose' })).toHaveFocus();
		});
	});

	describe('isOpen undefined at mount', () => {
		it('should ask to close on a pick when isOpen becomes true later', async () => {
			const callbacks = createCallbacks();
			render(<OpenOnlyPopupSelect callbacks={callbacks} />);
			await open();
			clearCallbacks(callbacks);

			await user.click(screen.getByText('Brisbane'));

			expect(callbacks.onChange).toHaveBeenCalledTimes(1);
			expect(callbacks.onMenuClose).toHaveBeenCalled();
		});

		it('should ask to close on Tab when isOpen becomes true later', async () => {
			const callbacks = createCallbacks();
			render(<OpenOnlyPopupSelect callbacks={callbacks} />);
			await open();
			clearCallbacks(callbacks);

			await user.keyboard('{Tab}');

			expect(callbacks.onMenuClose).toHaveBeenCalled();
		});

		it('should close on a pick, and focus the trigger, when uncontrolled', async () => {
			const callbacks = createCallbacks();
			render(<UncontrolledPopupSelect callbacks={callbacks} />);
			await open();

			await user.click(screen.getByText('Brisbane'));
			await flushTasks();

			expect(callbacks.onChange).toHaveBeenCalledTimes(1);
			expect(callbacks.onClose).toHaveBeenCalledTimes(1);
			expect(getPopupMenu()).not.toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Choose' })).toHaveFocus();
		});

		it('should close on Tab when uncontrolled', async () => {
			const callbacks = createCallbacks();
			render(<UncontrolledPopupSelect callbacks={callbacks} />);
			await open();

			await user.keyboard('{Tab}');
			await flushTasks();

			expect(callbacks.onClose).toHaveBeenCalledTimes(1);
			expect(getPopupMenu()).not.toBeInTheDocument();
		});
	});
});

/**
 * Top layer only: the legacy path does not ask a controlled popup to close on an outside press.
 */
describe('PopupSelect top-layer: an outside press after a pick', () => {
	beforeEach(() => {
		skipA11yAudit();
		passGate('platform-dst-top-layer');
	});

	it('should leave focus where the user pressed', async () => {
		const callbacks = createCallbacks();
		render(
			<>
				<button type="button">Outside</button>
				<ControlledPopupSelect callbacks={callbacks} />
			</>,
		);
		await open();
		await user.click(screen.getByText('Brisbane'));
		await flushTasks();
		expect(getPopupMenu()).toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Outside' }));
		await flushTasks();

		expect(callbacks.onClose).toHaveBeenCalled();
		expect(getPopupMenu()).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
	});
});
