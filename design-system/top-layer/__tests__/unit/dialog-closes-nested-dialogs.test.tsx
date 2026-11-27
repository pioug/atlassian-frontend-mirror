import React, { useState } from 'react';

import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import { Dialog } from '../../src/dialog/dialog-content';

/**
 * When a `Dialog` closes, it closes the open dialogs inside it. Otherwise an inner modal stays open
 * out of sight, and the page stays inert.
 */

function flushTask() {
	return act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
}

function clickButton({ name }: { name: string }): void {
	act(() => {
		screen.getByRole('button', { name, hidden: true }).click();
	});
}

function focusButton({ name }: { name: string }): void {
	act(() => {
		screen.getByRole('button', { name, hidden: true }).focus();
	});
}

function getOpenDialogs(): HTMLDialogElement[] {
	// eslint-disable-next-line testing-library/no-node-access -- the native open state is the subject
	return Array.from(document.querySelectorAll('dialog')).filter((dialog) => dialog.open);
}

/**
 * A button in the inner dialog closes only the outer one. The inner owner keeps `isOpen` `true`, as
 * when a modal draws a second modal inside it.
 */
function NestedDialogs({ onInnerClose }: { onInnerClose: () => void }) {
	const [isOuterOpen, setIsOuterOpen] = useState(false);
	const [isInnerOpen, setIsInnerOpen] = useState(false);
	return (
		<>
			<button type="button" onClick={() => setIsOuterOpen(true)}>
				Open outer
			</button>
			<button type="button">Outside</button>
			<Dialog isOpen={isOuterOpen} onClose={() => setIsOuterOpen(false)} label="Outer">
				<button type="button" onClick={() => setIsInnerOpen(true)}>
					Open inner
				</button>
				<Dialog isOpen={isInnerOpen} onClose={onInnerClose} label="Inner">
					<button type="button" onClick={() => setIsOuterOpen(false)}>
						Close outer
					</button>
				</Dialog>
			</Dialog>
		</>
	);
}

async function renderWithInnerOpen() {
	const onInnerClose = jest.fn();
	render(<NestedDialogs onInnerClose={onInnerClose} />);
	focusButton({ name: 'Open outer' });
	clickButton({ name: 'Open outer' });
	focusButton({ name: 'Open inner' });
	clickButton({ name: 'Open inner' });
	await flushTask();
	expect(getOpenDialogs()).toHaveLength(2);
	return { onInnerClose };
}

describe('Dialog: closing a dialog with an open dialog inside it', () => {
	// Checked in the close commit: the outer dialog stays mounted during its exit, and product code
	// that moves focus after the close runs then.
	it('closes the inner dialog in the same step, without asking its owner', async () => {
		const { onInnerClose } = await renderWithInnerOpen();

		clickButton({ name: 'Close outer' });

		expect(getOpenDialogs()).toHaveLength(0);
		await flushTask();
		expect(onInnerClose).not.toHaveBeenCalled();
	});

	it('leaves the page around it able to take focus', async () => {
		await renderWithInnerOpen();

		clickButton({ name: 'Close outer' });
		// jsdom has no modal inertness, so the open state is the real check.
		expect(getOpenDialogs()).toHaveLength(0);
		focusButton({ name: 'Outside' });

		expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
	});

	it('gives focus back to the element that opened the outer dialog', async () => {
		await renderWithInnerOpen();

		clickButton({ name: 'Close outer' });
		await flushTask();

		expect(screen.getByRole('button', { name: 'Open outer' })).toHaveFocus();
	});
});
