import { bind, bindAll } from 'bind-event-listener';

import { userEvent } from '@atlassian/testing-library/user-event';

import '../../src/testing/polyfill';

describe('polyfilled dialog Escape cancellation', () => {
	const elements: HTMLElement[] = [];
	// Drain each interaction delay and the polyfill tasks it schedules.
	const user = userEvent.setup({ advanceTimers: jest.runAllTimers });

	beforeEach(() => jest.useFakeTimers());
	afterEach(() => {
		// Remove fixtures explicitly because these tests create DOM elements without React.
		elements.splice(0).forEach((element) => element.remove());
		jest.runAllTimers();
		jest.useRealTimers();
	});

	/**
	 * Opens and focuses a dialog fixture, then drains opening events to isolate Escape events.
	 */
	function createDialog({ modal = true }: { modal?: boolean } = {}) {
		const dialog = document.createElement('dialog');
		elements.push(dialog);
		document.body.appendChild(dialog);
		// jsdom does not implement the dialog opening focus steps.
		dialog.tabIndex = -1;
		if (modal) {
			dialog.showModal();
		} else {
			dialog.show();
		}
		dialog.focus();
		// Drain opening notifications so assertions observe only the Escape lifecycle.
		jest.runAllTimers();
		return dialog;
	}

	it('fires cancel before the closing events', async () => {
		const dialog = createDialog();
		const events: string[] = [];
		const unbind = bindAll(
			dialog,
			['cancel', 'beforetoggle', 'toggle', 'close'].map((type) => ({
				type,
				listener: (event: Event) => {
					events.push(event.type);
					if (event.type === 'cancel') {
						expect(event.cancelable).toBe(true);
						expect(event.bubbles).toBe(false);
						expect(dialog.open).toBe(true);
					}
					if (event.type === 'beforetoggle') {
						expect(event.cancelable).toBe(false);
					}
				},
			})),
		);
		const parentCancel = jest.fn();
		const unbindParent = bind(document.body, { type: 'cancel', listener: parentCancel });
		expect(dialog).toHaveFocus();
		await user.keyboard('{Escape}');
		expect(events).toEqual(['cancel', 'beforetoggle', 'toggle', 'close']);
		expect(dialog.open).toBe(false);
		expect(parentCancel).not.toHaveBeenCalled();
		unbind();
		unbindParent();
	});

	it('preventing cancel leaves the dialog open without closing events', async () => {
		const dialog = createDialog();
		const closingEvent = jest.fn();
		const unbind = bindAll(dialog, [
			{ type: 'cancel', listener: (event) => event.preventDefault() },
			{ type: 'beforetoggle', listener: closingEvent },
			{ type: 'toggle', listener: closingEvent },
			{ type: 'close', listener: closingEvent },
		]);
		expect(dialog).toHaveFocus();
		await user.keyboard('{Escape}');
		expect(dialog.open).toBe(true);
		expect(closingEvent).not.toHaveBeenCalled();
		unbind();
	});

	it.each([true, false])('honours keydown prevention: %s', async (prevent) => {
		const dialog = createDialog();
		const cancel = jest.fn();
		const unbindCancel = bind(dialog, { type: 'cancel', listener: cancel });
		const unbindKeydown = bind(dialog, {
			type: 'keydown',
			listener: (event) => {
				if (prevent) {
					event.preventDefault();
				} else {
					event.stopPropagation();
				}
			},
		});
		expect(dialog).toHaveFocus();
		await user.keyboard('{Escape}');
		expect(dialog.open).toBe(prevent);
		expect(cancel).toHaveBeenCalledTimes(prevent ? 0 : 1);
		unbindCancel();
		unbindKeydown();
	});

	it.each([
		[true, null, false],
		[false, null, true],
		[true, 'none', true],
		[false, 'closerequest', false],
		[false, 'any', false],
		[true, 'invalid', false],
	] as const)('respects modal=%s and closedby=%s', async (modal, closedBy, remainsOpen) => {
		const dialog = createDialog({ modal });
		if (closedBy !== null) {
			dialog.setAttribute('closedby', closedBy);
		}
		expect(dialog).toHaveFocus();
		await user.keyboard('{Escape}');
		expect(dialog.open).toBe(remainsOpen);
	});

	it('cancels only the last opened dialog and preserves its parent when prevented', async () => {
		const parent = createDialog();
		const child = createDialog();
		const unbind = bind(child, { type: 'cancel', listener: (event) => event.preventDefault() });
		expect(child).toHaveFocus();
		await user.keyboard('{Escape}');
		expect(parent.open).toBe(true);
		expect(child.open).toBe(true);
		unbind();
		expect(child).toHaveFocus();
		await user.keyboard('{Escape}');
		expect(child.open).toBe(false);
		expect(parent.open).toBe(true);
	});

	it.each([true, false])(
		'orders dialog and popover Escape targets, dialog opened last=%s',
		async (dialogLast) => {
			const popover = document.createElement('div');
			popover.setAttribute('popover', 'auto');
			elements.push(popover);
			document.body.appendChild(popover);
			if (dialogLast) {
				popover.showPopover();
			}
			const dialog = createDialog();
			if (!dialogLast) {
				popover.showPopover();
			}
			expect(dialog).toHaveFocus();
			await user.keyboard('{Escape}');
			expect(dialog.open).toBe(!dialogLast);
			expect(popover.matches(':popover-open')).toBe(dialogLast);
		},
	);

	it.each(['close', 'remove', 'reopen'] as const)(
		'does not cancel a target changed during keydown: %s',
		async (action) => {
			const dialog = createDialog();
			const cancel = jest.fn();
			const unbindCancel = bind(dialog, { type: 'cancel', listener: cancel });
			const unbindKeydown = bind(dialog, {
				type: 'keydown',
				listener: () => {
					if (action === 'remove') {
						dialog.remove();
					} else {
						dialog.close();
					}
					if (action === 'reopen') {
						dialog.showModal();
					}
				},
			});
			expect(dialog).toHaveFocus();
			await user.keyboard('{Escape}');
			expect(cancel).not.toHaveBeenCalled();
			if (action === 'reopen') {
				expect(dialog.open).toBe(true);
			}
			unbindCancel();
			unbindKeydown();
		},
	);

	it('does not close twice when the cancel handler closes the dialog', async () => {
		const dialog = createDialog();
		const close = jest.fn();
		const unbind = bindAll(dialog, [
			{ type: 'cancel', listener: () => dialog.close() },
			{ type: 'close', listener: close },
		]);
		expect(dialog).toHaveFocus();
		await user.keyboard('{Escape}');
		expect(close).toHaveBeenCalledTimes(1);
		unbind();
	});
});
