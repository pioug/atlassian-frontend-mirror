import { bind, bindAll } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';
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
		// Both `showModal()` and `show()` run the dialog focusing steps. With no content, the dialog
		// itself takes focus.
		if (modal) {
			dialog.showModal();
		} else {
			dialog.show();
		}
		expect(dialog).toHaveFocus();
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

	it('cancels and closes when the keydown dispatch returns, after every keydown listener', () => {
		const dialog = createDialog();
		const events: string[] = [];
		const unbind = bindAll(
			dialog,
			['cancel', 'beforetoggle', 'toggle', 'close'].map((type) => ({
				type,
				listener: (event: Event) => events.push(event.type),
			})),
		);
		// The last listener on the event path still sees the dialog open.
		const unbindWindow = bind(window, {
			type: 'keydown',
			listener: () => events.push(`window keydown, open=${dialog.open}`),
		});
		dialog.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
		);
		// As in a browser: `cancel` and `beforetoggle` in the same task as the keydown, and
		// `toggle` and `close` in later tasks.
		expect(events).toEqual(['window keydown, open=true', 'cancel', 'beforetoggle']);
		expect(dialog.open).toBe(false);
		jest.runAllTimers();
		expect(events).toEqual([
			'window keydown, open=true',
			'cancel',
			'beforetoggle',
			'toggle',
			'close',
		]);
		unbind();
		unbindWindow();
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

	it.each([
		[true, null, 'closerequest'],
		[false, null, 'none'],
		[true, 'none', 'none'],
		[true, 'ANY', 'any'],
		[false, 'closerequest', 'closerequest'],
		[true, 'invalid', 'closerequest'],
	] as const)(
		'reports closedBy for modal=%s and closedby=%s as "%s"',
		(modal, closedBy, expected) => {
			const dialog = createDialog({ modal });
			if (closedBy !== null) {
				dialog.setAttribute('closedby', closedBy);
			}
			expect(dialog.closedBy).toBe(expected);
		},
	);

	it('gives a removed open dialog Escape handling again when it is inserted in a later task', async () => {
		const dialog = createDialog();
		dialog.setAttribute('closedby', 'closerequest');

		dialog.remove();
		// Let the polyfill's `MutationObserver` callback run the removing steps.
		await Promise.resolve();
		expect(dialog).toHaveAttribute('open');
		document.body.appendChild(dialog);

		await user.keyboard('{Escape}');
		expect(dialog.open).toBe(false);
	});

	it('does not handle Escape for a removed open dialog', async () => {
		const dialog = createDialog();
		const cancel = jest.fn();
		const unbind = bind(dialog, { type: 'cancel', listener: cancel });

		dialog.remove();
		await user.keyboard('{Escape}');

		expect(cancel).not.toHaveBeenCalled();
		expect(dialog).toHaveAttribute('open');
		unbind();
	});

	it('sets the closedby attribute from closedBy', () => {
		const dialog = createDialog();
		dialog.closedBy = 'none';
		expect(dialog).toHaveAttribute('closedby', 'none');
	});

	it('ignores closedby when closedBy is removed (a browser without closedby)', async () => {
		/* eslint-disable compat/compat -- jsdom has `<dialog>` */
		const descriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'closedBy');
		Reflect.deleteProperty(HTMLDialogElement.prototype, 'closedBy');
		/* eslint-enable compat/compat */
		try {
			const dialog = createDialog();
			dialog.setAttribute('closedby', 'none');
			const cancel = jest.fn();
			const unbind = bind(dialog, { type: 'cancel', listener: cancel });
			expect(dialog).toHaveFocus();
			await user.keyboard('{Escape}');
			expect(cancel).toHaveBeenCalledTimes(1);
			expect(dialog.open).toBe(false);
			unbind();
		} finally {
			if (descriptor) {
				Object.defineProperty(HTMLDialogElement.prototype, 'closedBy', descriptor);
			}
		}
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

	it('closes a dialog opened after a popover first on Escape', async () => {
		const popover = document.createElement('div');
		popover.setAttribute('popover', 'auto');
		elements.push(popover);
		document.body.appendChild(popover);
		popover.showPopover();
		// Opening a dialog closes the auto popovers it is not in, so the dialog is in the popover.
		const dialog = document.createElement('dialog');
		popover.appendChild(dialog);
		dialog.showModal();
		expect(popover.matches(':popover-open')).toBe(true);
		expect(dialog).toHaveFocus();
		jest.runAllTimers();

		await user.keyboard('{Escape}');

		expect(dialog.open).toBe(false);
		expect(popover.matches(':popover-open')).toBe(true);
	});

	it('closes a popover opened after a dialog first on Escape', async () => {
		const popover = document.createElement('div');
		popover.setAttribute('popover', 'auto');
		elements.push(popover);
		document.body.appendChild(popover);
		const dialog = createDialog();
		popover.showPopover();
		expect(dialog).toHaveFocus();

		await user.keyboard('{Escape}');

		expect(dialog.open).toBe(true);
		expect(popover.matches(':popover-open')).toBe(false);
	});

	it.each(['close', 'remove', 'reopen'] as const)(
		'selects the current opening after a dialog changes during keydown: %s',
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
			expect(cancel).toHaveBeenCalledTimes(action === 'reopen' ? 1 : 0);
			if (action === 'remove') {
				expect(dialog.isConnected).toBe(false);
			} else {
				expect(dialog.open).toBe(false);
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

describe('polyfilled dialog focus', () => {
	const elements: HTMLElement[] = [];

	afterEach(() => {
		// Remove fixtures explicitly because these tests create DOM elements without React.
		elements.splice(0).forEach((element) => element.remove());
		// Some tests use fake timers. Restore real ones even when a test fails.
		jest.useRealTimers();
	});

	function createTrigger() {
		const trigger = document.createElement('button');
		trigger.textContent = 'Trigger';
		elements.push(trigger);
		document.body.appendChild(trigger);
		trigger.focus();
		return trigger;
	}

	function createDialog({ html }: { html: string }) {
		const dialog = document.createElement('dialog');
		// Test fixture markup only.
		dialog.innerHTML = html;
		elements.push(dialog);
		document.body.appendChild(dialog);
		return dialog;
	}

	it('moves focus to the first focusable descendant on showModal, and back on close', () => {
		const trigger = createTrigger();
		const dialog = createDialog({
			html: '<p>Text</p><button type="button">First</button><button type="button">Second</button>',
		});

		dialog.showModal();

		expect(screen.getByRole('button', { name: 'First', hidden: true })).toHaveFocus();

		dialog.close();

		expect(trigger).toHaveFocus();
	});

	it('prefers a descendant with the autofocus attribute', () => {
		createTrigger();
		const dialog = createDialog({
			html: '<button type="button">First</button><input autofocus aria-label="Autofocus" />',
		});

		dialog.showModal();

		expect(screen.getByRole('textbox', { name: 'Autofocus', hidden: true })).toHaveFocus();
	});

	it('skips content a browser does not render', () => {
		createTrigger();
		const dialog = createDialog({
			html: [
				'<div hidden><button type="button">Hidden</button></div>',
				'<div popover="auto"><button type="button">In closed popover</button></div>',
				'<dialog><button type="button">In closed dialog</button></dialog>',
				'<button type="button" data-testid="rendered">Rendered</button>',
			].join(''),
		});

		dialog.showModal();

		expect(screen.getByTestId('rendered')).toHaveFocus();
	});

	it('focuses the dialog itself when nothing in it can take focus', () => {
		createTrigger();
		const dialog = createDialog({ html: '<p>Text only</p>' });

		dialog.showModal();

		expect(dialog).toHaveFocus();
		expect(dialog).not.toHaveAttribute('tabindex');
	});

	it('does not focus anything in a closed dialog', () => {
		const trigger = createTrigger();
		const dialog = createDialog({ html: '<button type="button">Inside</button>' });
		expect(dialog.open).toBe(false);

		screen.getByRole('button', { name: 'Inside', hidden: true }).focus();

		expect(trigger).toHaveFocus();
	});

	it('moves focus out of the closed dialog in the next frame when the element before showModal was body', () => {
		jest.useFakeTimers();
		const dialog = createDialog({ html: '<button type="button">Inside</button>' });
		expect(document.body).toHaveFocus();
		dialog.showModal();
		const inside = screen.getByRole('button', { name: 'Inside', hidden: true });
		expect(inside).toHaveFocus();
		const onBlur = jest.fn();
		const unbind = bind(inside, { type: 'blur', listener: onBlur });

		dialog.close();

		// As in a browser, the focus fixup runs at the next rendering update, not in close().
		expect(inside).toHaveFocus();
		jest.runOnlyPendingTimers();
		expect(document.body).toHaveFocus();
		expect(onBlur).toHaveBeenCalledTimes(1);
		unbind();
	});

	it('skips a tabindex="-1" element and focuses the first sequentially focusable one', () => {
		createTrigger();
		const dialog = createDialog({
			html: '<div tabindex="-1"><button type="button">Inside</button></div>',
		});

		dialog.showModal();

		expect(screen.getByRole('button', { name: 'Inside', hidden: true })).toHaveFocus();
	});

	it('focuses the selected tab in a roving tab list', () => {
		createTrigger();
		const dialog = createDialog({
			html: [
				'<div role="tablist">',
				'<button type="button" role="tab" tabindex="-1">First</button>',
				'<button type="button" role="tab" tabindex="0" aria-selected="true">Selected</button>',
				'</div>',
			].join(''),
		});

		dialog.showModal();

		expect(screen.getByRole('tab', { name: 'Selected', hidden: true })).toHaveFocus();
	});

	it('focuses the dialog itself when it has the autofocus attribute', () => {
		createTrigger();
		const dialog = createDialog({ html: '<button type="button">Inside</button>' });
		dialog.setAttribute('autofocus', '');

		dialog.showModal();

		expect(dialog).toHaveFocus();
	});

	it('moves focus into the dialog on show (non-modal), and back on close', () => {
		const trigger = createTrigger();
		const dialog = createDialog({ html: '<button type="button">Inside</button>' });

		dialog.show();

		expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();

		dialog.close();

		expect(trigger).toHaveFocus();
	});

	it('does not move focus on close (non-modal) when focus is outside the dialog', () => {
		createTrigger();
		const other = document.createElement('button');
		other.textContent = 'Other';
		elements.push(other);
		document.body.appendChild(other);
		const dialog = createDialog({ html: '<button type="button">Inside</button>' });
		dialog.show();
		other.focus();

		dialog.close();

		expect(other).toHaveFocus();
	});

	it('moves focus out of the closed dialog in the next frame when the previously focused element is gone', () => {
		jest.useFakeTimers();
		const trigger = createTrigger();
		const dialog = createDialog({ html: '<button type="button">Inside</button>' });
		dialog.showModal();
		trigger.remove();

		dialog.close();

		expect(screen.getByRole('button', { name: 'Inside', hidden: true })).toHaveFocus();
		jest.runOnlyPendingTimers();
		expect(document.body).toHaveFocus();
	});

	it('throws on show when the dialog is open as a modal dialog', () => {
		const dialog = createDialog({ html: '' });
		dialog.showModal();

		expect(() => dialog.show()).toThrow(expect.objectContaining({ name: 'InvalidStateError' }));
	});

	it('removing an open modal dialog makes it non-modal, so a later close does not move focus', () => {
		createTrigger();
		const other = document.createElement('button');
		other.textContent = 'Other';
		elements.push(other);
		document.body.appendChild(other);
		const dialog = createDialog({ html: '<button type="button">Inside</button>' });
		dialog.showModal();
		expect(dialog.matches(':modal')).toBe(true);

		dialog.remove();
		other.focus();

		expect(dialog).toHaveAttribute('open');
		expect(dialog.matches(':modal')).toBe(false);
		// The computed closed-by state of a non-modal dialog without `closedby` is None.
		expect(dialog.closedBy).toBe('none');

		dialog.close();

		expect(other).toHaveFocus();
	});

	it('does not focus an SVG element in a closed dialog', () => {
		const trigger = createTrigger();
		createDialog({
			html: '<svg><a href="#target" data-testid="svg-link"><text>Link</text></a></svg>',
		});

		screen.getByTestId('svg-link').focus();

		expect(trigger).toHaveFocus();
	});

	it('does not focus an SVG link in a disconnected dialog on show', () => {
		const trigger = createTrigger();
		const dialog = document.createElement('dialog');
		// Test fixture markup only.
		dialog.innerHTML = '<svg><a href="#target"><text>Link</text></a></svg>';

		dialog.show();

		expect(dialog).toHaveAttribute('open');
		expect(trigger).toHaveFocus();
	});

	it('does not move focus on close when a beforetoggle listener removes a modal dialog', () => {
		createTrigger();
		const other = document.createElement('button');
		other.textContent = 'Other';
		elements.push(other);
		document.body.appendChild(other);
		const dialog = createDialog({ html: '<button type="button">Inside</button>' });
		dialog.showModal();
		const unbind = bind(dialog, {
			type: 'beforetoggle',
			listener: () => {
				dialog.remove();
				other.focus();
			},
		});

		dialog.close();

		expect(other).toHaveFocus();
		unbind();
	});

	it('answers :modal from the first polyfill copy when the module loads again', () => {
		jest.isolateModules(() => {
			// A second copy, as after `jest.resetModules()`.
			require('../../src/testing/polyfill');
		});
		const dialog = createDialog({ html: '' });
		dialog.showModal();
		expect(dialog.matches(':modal')).toBe(true);

		dialog.remove();

		expect(dialog.matches(':modal')).toBe(false);
	});

	/**
	 * Puts `element` in an open shadow root in the dialog. Testing Library cannot see into shadow
	 * roots, so tests read focus through the element's focus events.
	 */
	function appendInShadowRoot({
		dialog,
		element,
		delegatesFocus = false,
	}: {
		dialog: HTMLDialogElement;
		element: HTMLElement;
		delegatesFocus?: boolean;
	}) {
		const host = document.createElement('div');
		dialog.appendChild(host);
		const shadowRoot = host.attachShadow({ mode: 'open' });
		if (delegatesFocus) {
			// jsdom does not implement `delegatesFocus`, so model a browser that does.
			Object.defineProperty(shadowRoot, 'delegatesFocus', { value: true });
		}
		shadowRoot.appendChild(element);
		const onFocus = jest.fn();
		bind(element, { type: 'focus', listener: onFocus });
		return { onFocus };
	}

	it('does not focus an element in a shadow root in a closed dialog', () => {
		const trigger = createTrigger();
		const dialog = createDialog({ html: '' });
		const button = document.createElement('button');
		const { onFocus } = appendInShadowRoot({ dialog, element: button });

		button.focus();

		expect(onFocus).not.toHaveBeenCalled();
		expect(trigger).toHaveFocus();
	});

	it('returns focus on close (non-modal) when focus is in a shadow root in the dialog', () => {
		const trigger = createTrigger();
		const dialog = createDialog({ html: '' });
		const button = document.createElement('button');
		const { onFocus } = appendInShadowRoot({ dialog, element: button });
		dialog.show();
		button.focus();
		expect(onFocus).toHaveBeenCalledTimes(1);

		dialog.close();

		expect(trigger).toHaveFocus();
	});

	it('focuses the focus delegate of a shadow host that delegates focus', () => {
		createTrigger();
		const dialog = createDialog({ html: '' });
		// Inside a shadow root, the first focusable element counts, even with `tabindex="-1"`.
		const span = document.createElement('span');
		span.tabIndex = -1;
		const { onFocus } = appendInShadowRoot({ dialog, element: span, delegatesFocus: true });

		dialog.showModal();

		expect(onFocus).toHaveBeenCalledTimes(1);
	});
});
