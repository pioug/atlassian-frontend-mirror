import React, { useState } from 'react';

import { skipA11yAudit } from '@af/accessibility-testing/skip-a11y-audit';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import { type OptionsType } from '../../../types';
import { PopupSelect } from '../../popup-select';

/**
 * On the top layer, a controlled `PopupSelect` asks `onClose` first, and closes only when `isOpen`
 * becomes `false`. See `@atlaskit/top-layer` `notes/decisions/wrappers-ask-first-close.md`.
 */

const OPTIONS: OptionsType = [
	{ label: 'Adelaide', value: 'adelaide' },
	{ label: 'Brisbane', value: 'brisbane' },
];

function isPopoverOpen(element: Element | null): boolean {
	return Boolean(element?.matches(':popover-open'));
}

function getButton(name: string): HTMLElement {
	return screen.getByRole('button', { name });
}

/**
 * Lets queued `toggle` events and the polyfill focus fixup (one frame) run.
 */
async function flushTasks() {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 20));
	});
}

function ControlledPopupSelect({
	shouldAccept,
	onClose,
}: {
	shouldAccept: boolean;
	onClose?: () => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<button type="button">Outside</button>
			<PopupSelect
				options={OPTIONS}
				label="Cities"
				testId="popup-select"
				isOpen={isOpen}
				onOpen={() => setIsOpen(true)}
				onClose={() => {
					// `PopupSelect` also calls `onClose` when `isOpen` becomes `false`.
					if (!isOpen) {
						return;
					}
					onClose?.();
					if (shouldAccept) {
						setIsOpen(false);
					}
				}}
				target={({ isOpen: _isOpen, ...triggerProps }) => (
					<button type="button" {...triggerProps}>
						Choose
					</button>
				)}
			/>
		</>
	);
}

describe('PopupSelect top-layer: ask first on close', () => {
	beforeEach(() => {
		skipA11yAudit();
		passGate('platform-dst-top-layer');
	});

	it('should stay open and visible when onClose refuses an outside press', async () => {
		const onClose = jest.fn();
		render(<ControlledPopupSelect shouldAccept={false} onClose={onClose} />);
		await userEvent.click(getButton('Choose'));
		expect(screen.getByTestId('popup-select--content')).toBeVisible();

		await userEvent.click(getButton('Outside'));
		await flushTasks();

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('popup-select--content')).toBeVisible();
	});

	it('should stay open when onClose refuses Escape', async () => {
		const onClose = jest.fn();
		render(<ControlledPopupSelect shouldAccept={false} onClose={onClose} />);
		await userEvent.click(getButton('Choose'));

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(screen.getByTestId('popup-select--content')).toBeVisible();
	});

	it('should ask before it closes on an accepted outside press', async () => {
		const isOpenWhenAsked = jest.fn();
		render(
			<ControlledPopupSelect
				shouldAccept
				onClose={() =>
					isOpenWhenAsked(isPopoverOpen(screen.queryByTestId('popup-select--content')))
				}
			/>,
		);
		await userEvent.click(getButton('Choose'));

		await userEvent.click(getButton('Outside'));
		await flushTasks();

		expect(isOpenWhenAsked).toHaveBeenCalledTimes(1);
		expect(isOpenWhenAsked).toHaveBeenCalledWith(true);
		expect(screen.queryByTestId('popup-select--content')).not.toBeInTheDocument();
		expect(getButton('Outside')).toHaveFocus();
	});

	it('should close on an accepted Escape, and return focus to the trigger', async () => {
		render(<ControlledPopupSelect shouldAccept />);
		getButton('Choose').focus();
		await userEvent.keyboard('{Enter}');
		expect(screen.getByTestId('popup-select--content')).toBeVisible();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(screen.queryByTestId('popup-select--content')).not.toBeInTheDocument();
		expect(getButton('Choose')).toHaveFocus();
	});

	it('should return focus to the element that opened it after an accepted Escape', async () => {
		function OpenFromElsewhere() {
			const [isOpen, setIsOpen] = useState(false);
			return (
				<>
					<button type="button" onClick={() => setIsOpen(true)}>
						Open from elsewhere
					</button>
					<PopupSelect
						options={OPTIONS}
						label="Cities"
						testId="popup-select"
						isOpen={isOpen}
						onClose={() => setIsOpen(false)}
						target={({ isOpen: _isOpen, ...triggerProps }) => (
							<button type="button" {...triggerProps}>
								Choose
							</button>
						)}
					/>
				</>
			);
		}
		render(<OpenFromElsewhere />);
		const opener = getButton('Open from elsewhere');
		opener.focus();
		await userEvent.keyboard('{Enter}');
		expect(screen.getByTestId('popup-select--content')).toBeVisible();

		await userEvent.keyboard('{Escape}');
		await flushTasks();

		expect(screen.queryByTestId('popup-select--content')).not.toBeInTheDocument();
		expect(opener).toHaveFocus();
	});

	it('should ask once on a press on its trigger: the trigger click toggles it', async () => {
		const onClose = jest.fn();
		render(<ControlledPopupSelect shouldAccept onClose={onClose} />);
		await userEvent.click(getButton('Choose'));

		await userEvent.click(getButton('Choose'));
		await flushTasks();

		expect(onClose).toHaveBeenCalledTimes(1);
		expect(screen.queryByTestId('popup-select--content')).not.toBeInTheDocument();
	});
});
