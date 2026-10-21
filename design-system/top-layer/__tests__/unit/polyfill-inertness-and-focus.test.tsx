/**
 * The polyfill models inertness, rendering, popover focus, `requestClose()` and the focus fixup as
 * Chrome 155 does. Each expectation here was first observed in Chrome with the same markup.
 *
 * Spec references:
 * - Inert subtrees: https://html.spec.whatwg.org/multipage/interaction.html#inert-subtrees
 * - Show and hide popover: https://html.spec.whatwg.org/multipage/popover.html#show-popover
 * - requestClose(): https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-requestclose
 * - Focus fixup: https://html.spec.whatwg.org/multipage/webappapis.html#update-the-rendering
 */
import { bind, bindAll } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';
import { fireEvent } from '@atlassian/testing-library/testing-library/react';
import { userEvent } from '@atlassian/testing-library/user-event';

import '../../src/testing/polyfill';

const containers: HTMLElement[] = [];

/**
 * Mounts test markup in a new container. Elements with a `data-testid` are found with
 * `getElement`.
 */
function mount({ html }: { html: string }): HTMLElement {
	const container = document.createElement('div');
	// Test fixture markup only.
	container.innerHTML = html;
	containers.push(container);
	document.body.appendChild(container);
	return container;
}

function getElement<TElement extends HTMLElement = HTMLElement>({ id }: { id: string }): TElement {
	// `getByTestId` also finds content that is hidden or inert.
	return screen.getByTestId(id) as TElement;
}

function getDialog({ id }: { id: string }): HTMLDialogElement {
	return getElement<HTMLDialogElement>({ id });
}

// The hooks are in a describe block, so that they run before the automatic accessibility check.
describe('polyfill parity with browsers', () => {
	beforeEach(() => jest.useFakeTimers());
	afterEach(() => {
		// Close everything first, so that no modal dialog or popover leaks into the next test.
		screen.queryAllByTestId(/./).forEach((element) => {
			if (element instanceof HTMLDialogElement) {
				element.close();
				return;
			}
			if (element.hasAttribute('popover')) {
				element.hidePopover();
			}
		});
		containers.splice(0).forEach((container) => container.remove());
		jest.runAllTimers();
		jest.useRealTimers();
	});

	describe('a modal dialog blocks the document', () => {
		const user = userEvent.setup({ advanceTimers: jest.runAllTimers });

		it('does not focus an element outside an open modal dialog', () => {
			mount({
				html: '<button data-testid="outside">Outside</button><dialog data-testid="dialog"><button data-testid="inside">Inside</button></dialog>',
			});
			getDialog({ id: 'dialog' }).showModal();
			expect(getElement({ id: 'inside' })).toHaveFocus();

			getElement({ id: 'outside' }).focus();

			expect(getElement({ id: 'inside' })).toHaveFocus();
		});

		it('does not focus an element in a popover outside the modal dialog, even one shown later', () => {
			mount({
				html: '<dialog data-testid="dialog"><button data-testid="inside">Inside</button></dialog><div popover="manual" data-testid="popover"><button data-testid="in-popover">In popover</button></div>',
			});
			getDialog({ id: 'dialog' }).showModal();
			getElement({ id: 'popover' }).showPopover();

			getElement({ id: 'in-popover' }).focus();

			expect(getElement({ id: 'inside' })).toHaveFocus();
		});

		it('focuses an element in a popover inside the modal dialog', () => {
			mount({
				html: '<dialog data-testid="dialog"><button data-testid="inside">Inside</button><div popover="manual" data-testid="popover"><button data-testid="in-popover">In popover</button></div></dialog>',
			});
			getDialog({ id: 'dialog' }).showModal();
			getElement({ id: 'popover' }).showPopover();

			getElement({ id: 'in-popover' }).focus();

			expect(getElement({ id: 'in-popover' })).toHaveFocus();
		});

		it('blocks a lower modal dialog while a later one is open', () => {
			mount({
				html: '<dialog data-testid="lower"><button data-testid="in-lower">In lower</button></dialog><dialog data-testid="upper"><button data-testid="in-upper">In upper</button></dialog>',
			});
			getDialog({ id: 'lower' }).showModal();
			getDialog({ id: 'upper' }).showModal();

			getElement({ id: 'in-lower' }).focus();

			expect(getElement({ id: 'in-upper' })).toHaveFocus();
		});

		it('does not block a modal dialog that is inside an inert subtree', () => {
			mount({
				html: '<div inert><dialog data-testid="dialog"><button data-testid="inside">Inside</button></dialog></div>',
			});

			getDialog({ id: 'dialog' }).showModal();

			expect(getElement({ id: 'inside' })).toHaveFocus();
		});

		it('moves focus to body at once when the modal dialog itself is inert', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><dialog inert data-testid="dialog"><button data-testid="inside">Inside</button></dialog>',
			});
			getElement({ id: 'trigger' }).focus();

			getDialog({ id: 'dialog' }).showModal();

			expect(document.body).toHaveFocus();
		});

		it('stops a user-event click outside the modal dialog, as a user cannot hit it', async () => {
			mount({
				html: '<button data-testid="outside">Outside</button><dialog data-testid="dialog"><button data-testid="inside">Inside</button></dialog>',
			});
			const onClick = jest.fn();
			const unbind = bind(getElement({ id: 'outside' }), { type: 'click', listener: onClick });
			getDialog({ id: 'dialog' }).showModal();

			await expect(user.click(getElement({ id: 'outside' }))).rejects.toThrow(
				/pointer-events: none/,
			);
			await expect(user.click(document.body)).rejects.toThrow(/pointer-events: none/);

			expect(onClick).not.toHaveBeenCalled();
			unbind();
		});

		it('lets a user-event click reach content in the modal dialog, and the dialog itself', async () => {
			mount({
				html: '<dialog data-testid="dialog"><button data-testid="inside">Inside</button></dialog>',
			});
			const onClick = jest.fn();
			const dialog = getDialog({ id: 'dialog' });
			const unbind = bind(dialog, { type: 'click', listener: onClick });
			dialog.showModal();

			await user.click(getElement({ id: 'inside' }));
			await user.click(dialog);

			expect(onClick).toHaveBeenCalledTimes(2);
			unbind();
		});

		it('still runs element.click() and dispatched click events outside the modal dialog', () => {
			mount({
				html: '<button data-testid="outside">Outside</button><dialog data-testid="dialog"></dialog>',
			});
			const onClick = jest.fn();
			const outside = getElement({ id: 'outside' });
			const unbind = bind(outside, { type: 'click', listener: onClick });
			getDialog({ id: 'dialog' }).showModal();

			outside.click();
			fireEvent.click(outside);

			expect(onClick).toHaveBeenCalledTimes(2);
			unbind();
		});

		it('reports pointer-events: none for blocked content and auto for the blocking dialog', () => {
			mount({
				html: '<button data-testid="outside">Outside</button><dialog data-testid="dialog"><button data-testid="inside">Inside</button></dialog>',
			});
			const dialog = getDialog({ id: 'dialog' });
			const inside = getElement({ id: 'inside' });
			const insideBefore = window.getComputedStyle(inside).pointerEvents;
			expect(window.getComputedStyle(getElement({ id: 'outside' })).pointerEvents).not.toBe('none');

			dialog.showModal();

			expect(window.getComputedStyle(getElement({ id: 'outside' })).pointerEvents).toBe('none');
			expect(window.getComputedStyle(document.body).pointerEvents).toBe('none');
			expect(window.getComputedStyle(dialog).pointerEvents).toBe('auto');
			expect(window.getComputedStyle(inside).pointerEvents).toBe(insideBefore);
		});

		it('unblocks the document when the modal dialog closes', async () => {
			mount({
				html: '<button data-testid="outside">Outside</button><dialog data-testid="dialog"></dialog>',
			});
			const dialog = getDialog({ id: 'dialog' });
			dialog.showModal();
			dialog.close();

			await user.click(getElement({ id: 'outside' }));

			expect(getElement({ id: 'outside' })).toHaveFocus();
		});

		it('unblocks the document when the modal dialog is removed', () => {
			mount({
				html: '<button data-testid="outside">Outside</button><dialog data-testid="dialog"></dialog>',
			});
			const dialog = getDialog({ id: 'dialog' });
			dialog.showModal();
			dialog.remove();

			getElement({ id: 'outside' }).focus();

			expect(getElement({ id: 'outside' })).toHaveFocus();
		});

		it('does not block for a non-modal dialog', () => {
			mount({
				html: '<button data-testid="outside">Outside</button><dialog data-testid="dialog"><button>Inside</button></dialog>',
			});
			getDialog({ id: 'dialog' }).show();

			getElement({ id: 'outside' }).focus();

			expect(getElement({ id: 'outside' })).toHaveFocus();
		});
	});

	describe('the inert attribute', () => {
		const user = userEvent.setup({ advanceTimers: jest.runAllTimers });

		it('stops focus and user-event clicks in an inert subtree', async () => {
			mount({ html: '<div inert><button data-testid="inert-button">Inert</button></div>' });
			const button = getElement({ id: 'inert-button' });

			button.focus();

			expect(document.body).toHaveFocus();
			await expect(user.click(button)).rejects.toThrow(/pointer-events: none/);
		});
	});

	describe('content that a browser does not render', () => {
		it('does not take focus in a hidden subtree', () => {
			mount({ html: '<div hidden><button data-testid="in-hidden">In hidden</button></div>' });

			getElement({ id: 'in-hidden' }).focus();

			expect(document.body).toHaveFocus();
		});

		it('focuses a hidden="until-found" element itself, but not its content', () => {
			mount({
				html: '<div hidden="until-found" tabindex="0" data-testid="until-found"><button data-testid="content">Content</button></div>',
			});

			getElement({ id: 'content' }).focus();
			expect(document.body).toHaveFocus();
			getElement({ id: 'until-found' }).focus();

			expect(getElement({ id: 'until-found' })).toHaveFocus();
		});

		it('does not take focus in a closed popover', () => {
			mount({
				html: '<div popover="auto" data-testid="popover"><button data-testid="in-popover">In popover</button></div>',
			});

			getElement({ id: 'in-popover' }).focus();

			expect(document.body).toHaveFocus();
		});
	});

	describe('popover focus', () => {
		const user = userEvent.setup({ advanceTimers: jest.runAllTimers });

		it('focuses the autofocus delegate on show, and returns focus on hidePopover()', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="auto" data-testid="popover"><button>First</button><button autofocus data-testid="autofocus">Autofocus</button></div>',
			});
			const popover = getElement({ id: 'popover' });
			getElement({ id: 'trigger' }).focus();

			popover.showPopover();
			expect(getElement({ id: 'autofocus' })).toHaveFocus();
			popover.hidePopover();

			expect(getElement({ id: 'trigger' })).toHaveFocus();
		});

		it('does not move focus on show without autofocus', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="auto" data-testid="popover"><button data-testid="inside">Inside</button></div>',
			});
			getElement({ id: 'trigger' }).focus();

			getElement({ id: 'popover' }).showPopover();

			expect(getElement({ id: 'trigger' })).toHaveFocus();
		});

		it('focuses a popover with autofocus itself', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="auto" autofocus tabindex="-1" data-testid="popover"><button>Inside</button></div>',
			});
			getElement({ id: 'trigger' }).focus();

			getElement({ id: 'popover' }).showPopover();

			expect(getElement({ id: 'popover' })).toHaveFocus();
		});

		it('skips a hidden autofocus element', () => {
			mount({
				html: '<div popover="auto" data-testid="popover"><button hidden autofocus>Hidden</button><button autofocus data-testid="visible">Visible</button></div>',
			});

			getElement({ id: 'popover' }).showPopover();

			expect(getElement({ id: 'visible' })).toHaveFocus();
		});

		it('does not move focus on hide when focus is outside the popover', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><button data-testid="other">Other</button><div popover="auto" data-testid="popover"><button>Inside</button></div>',
			});
			const popover = getElement({ id: 'popover' });
			getElement({ id: 'trigger' }).focus();
			popover.showPopover();
			getElement({ id: 'other' }).focus();

			popover.hidePopover();

			expect(getElement({ id: 'other' })).toHaveFocus();
		});

		it('does not return focus for a manual popover', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="manual" data-testid="popover"><button autofocus data-testid="inside">Inside</button></div>',
			});
			const popover = getElement({ id: 'popover' });
			getElement({ id: 'trigger' }).focus();
			popover.showPopover();
			expect(getElement({ id: 'inside' })).toHaveFocus();

			popover.hidePopover();

			// Focus stays in the hidden popover until the focus fixup.
			expect(getElement({ id: 'inside' })).toHaveFocus();
		});

		it('returns focus only for the first popover in a stack', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="auto" data-testid="parent"><button data-testid="in-parent">In parent</button><div popover="auto" data-testid="child"><button autofocus data-testid="in-child">In child</button></div></div>',
			});
			const parent = getElement({ id: 'parent' });
			const child = getElement({ id: 'child' });
			getElement({ id: 'trigger' }).focus();
			parent.showPopover();
			getElement({ id: 'in-parent' }).focus();
			child.showPopover();
			expect(getElement({ id: 'in-child' })).toHaveFocus();

			child.hidePopover();
			expect(getElement({ id: 'in-child' })).toHaveFocus();
			child.showPopover();
			parent.hidePopover();

			expect(getElement({ id: 'trigger' })).toHaveFocus();
		});

		it('returns focus for a hint popover', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="hint" data-testid="popover"><button autofocus data-testid="inside">Inside</button></div>',
			});
			const popover = getElement({ id: 'popover' });
			getElement({ id: 'trigger' }).focus();
			popover.showPopover();
			expect(getElement({ id: 'inside' })).toHaveFocus();

			popover.hidePopover();

			expect(getElement({ id: 'trigger' })).toHaveFocus();
		});

		it('returns focus on Escape', async () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="auto" data-testid="popover"><button autofocus data-testid="inside">Inside</button></div>',
			});
			getElement({ id: 'trigger' }).focus();
			getElement({ id: 'popover' }).showPopover();
			expect(getElement({ id: 'inside' })).toHaveFocus();

			await user.keyboard('{Escape}');

			expect(getElement({ id: 'popover' })).not.toHaveAttribute('data-popover-open');
			expect(getElement({ id: 'trigger' })).toHaveFocus();
		});

		it('does not return focus on light dismiss', async () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div data-testid="outside">Outside</div><div popover="auto" data-testid="popover"><button autofocus data-testid="inside">Inside</button></div>',
			});
			getElement({ id: 'trigger' }).focus();
			getElement({ id: 'popover' }).showPopover();
			expect(getElement({ id: 'inside' })).toHaveFocus();

			await user.click(getElement({ id: 'outside' }));

			expect(getElement({ id: 'popover' })).not.toHaveAttribute('data-popover-open');
			expect(document.body).toHaveFocus();
		});

		it('returns focus when the popover attribute is removed', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="auto" data-testid="popover"><button autofocus data-testid="inside">Inside</button></div>',
			});
			getElement({ id: 'trigger' }).focus();
			getElement({ id: 'popover' }).showPopover();
			expect(getElement({ id: 'inside' })).toHaveFocus();

			getElement({ id: 'popover' }).removeAttribute('popover');

			expect(getElement({ id: 'trigger' })).toHaveFocus();
		});

		it('does not return focus when opening another auto popover closes it', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="auto" data-testid="first"><button autofocus data-testid="in-first">In first</button></div><div popover="auto" data-testid="second"><button>In second</button></div>',
			});
			getElement({ id: 'trigger' }).focus();
			getElement({ id: 'first' }).showPopover();

			getElement({ id: 'second' }).showPopover();

			expect(getElement({ id: 'first' })).not.toHaveAttribute('data-popover-open');
			expect(getElement({ id: 'in-first' })).toHaveFocus();
		});

		it('does not return focus when the popover opened while body had focus', () => {
			mount({
				html: '<div popover="auto" data-testid="popover"><button autofocus data-testid="inside">Inside</button></div>',
			});
			const popover = getElement({ id: 'popover' });
			popover.showPopover();

			popover.hidePopover();

			expect(getElement({ id: 'inside' })).toHaveFocus();
		});
	});

	describe('dialog.requestClose()', () => {
		function openDialog({ html, modal = true }: { html: string; modal?: boolean }) {
			mount({ html: `<button data-testid="trigger">Trigger</button>${html}` });
			getElement({ id: 'trigger' }).focus();
			const dialog = getDialog({ id: 'dialog' });
			if (modal) {
				dialog.showModal();
			} else {
				dialog.show();
			}
			// Drain the opening toggle so that only the closing events are recorded.
			jest.runAllTimers();
			return dialog;
		}

		function recordEvents({ dialog }: { dialog: HTMLDialogElement }) {
			const events: string[] = [];
			const unbind = bindAll(
				dialog,
				['cancel', 'beforetoggle', 'toggle', 'close'].map((type) => ({
					type,
					listener: (event: Event) => events.push(`${event.type}:${String(event.cancelable)}`),
				})),
			);
			return { events, unbind };
		}

		it('fires a cancelable cancel event every time, and stays open when it is canceled', () => {
			const dialog = openDialog({ html: '<dialog data-testid="dialog"></dialog>' });
			const { events, unbind } = recordEvents({ dialog });
			const unbindCancel = bind(dialog, {
				type: 'cancel',
				listener: (event) => event.preventDefault(),
			});

			dialog.requestClose('first');
			dialog.requestClose('second');
			jest.runAllTimers();

			expect(events).toEqual(['cancel:true', 'cancel:true']);
			expect(dialog.open).toBe(true);
			expect(dialog.returnValue).toBe('');
			unbind();
			unbindCancel();
		});

		it('closes the dialog with the return value and returns focus, like close()', () => {
			const dialog = openDialog({
				html: '<dialog data-testid="dialog"><button>Inside</button></dialog>',
			});
			const { events, unbind } = recordEvents({ dialog });

			dialog.requestClose('done');

			expect(events).toEqual(['cancel:true', 'beforetoggle:false']);
			expect(dialog.open).toBe(false);
			expect(dialog.returnValue).toBe('done');
			expect(getElement({ id: 'trigger' })).toHaveFocus();
			jest.runAllTimers();
			expect(events).toEqual(['cancel:true', 'beforetoggle:false', 'toggle:false', 'close:false']);
			unbind();
		});

		it('closes a dialog with closedby="none"', () => {
			const dialog = openDialog({ html: '<dialog data-testid="dialog" closedby="none"></dialog>' });

			dialog.requestClose();

			expect(dialog.open).toBe(false);
		});

		it('closes a non-modal dialog', () => {
			const dialog = openDialog({ html: '<dialog data-testid="dialog"></dialog>', modal: false });
			const { events, unbind } = recordEvents({ dialog });

			dialog.requestClose();

			expect(dialog.open).toBe(false);
			expect(events[0]).toBe('cancel:true');
			unbind();
		});

		it('keeps the return value when no argument is given', () => {
			const dialog = openDialog({ html: '<dialog data-testid="dialog"></dialog>' });
			dialog.returnValue = 'kept';

			dialog.requestClose();

			expect(dialog.returnValue).toBe('kept');
		});

		it('does nothing for a closed dialog', () => {
			const dialog = openDialog({ html: '<dialog data-testid="dialog"></dialog>' });
			dialog.requestClose('closed');
			const { events, unbind } = recordEvents({ dialog });

			dialog.requestClose('again');

			expect(events).toEqual([]);
			expect(dialog.returnValue).toBe('closed');
			unbind();
		});

		it('does nothing for a disconnected open dialog, until it is inserted again', () => {
			const dialog = openDialog({ html: '<dialog data-testid="dialog" closedby="any"></dialog>' });
			const { events, unbind } = recordEvents({ dialog });
			dialog.remove();

			dialog.requestClose();
			expect(events).toEqual([]);
			expect(dialog.open).toBe(true);
			document.body.appendChild(dialog);
			dialog.requestClose();

			expect(dialog.open).toBe(false);
			unbind();
			dialog.remove();
		});

		it('does not fire cancel again when a cancel handler calls requestClose()', () => {
			const dialog = openDialog({ html: '<dialog data-testid="dialog"></dialog>' });
			const onCancel = jest.fn(() => dialog.requestClose('inner'));
			const unbind = bind(dialog, { type: 'cancel', listener: onCancel });

			dialog.requestClose('outer');

			expect(onCancel).toHaveBeenCalledTimes(1);
			expect(dialog.open).toBe(false);
			// The inner call sets the request close return value before it returns.
			expect(dialog.returnValue).toBe('inner');
			unbind();
		});

		it('does not close twice when a cancel handler closes the dialog', () => {
			const dialog = openDialog({ html: '<dialog data-testid="dialog"></dialog>' });
			const { events, unbind } = recordEvents({ dialog });
			const unbindCancel = bind(dialog, {
				type: 'cancel',
				listener: () => dialog.close('from-cancel'),
			});

			dialog.requestClose('outer');

			expect(dialog.returnValue).toBe('from-cancel');
			expect(events).toEqual(['cancel:true', 'beforetoggle:false']);
			unbind();
			unbindCancel();
		});
	});

	describe('focus fixup', () => {
		function focusAndRecordBlur({ id }: { id: string }) {
			const element = getElement({ id });
			element.focus();
			expect(element).toHaveFocus();
			const onBlur = jest.fn();
			const unbind = bind(element, { type: 'blur', listener: onBlur });
			return { element, onBlur, unbind };
		}

		it('moves focus to body one frame after the focused element becomes hidden', async () => {
			mount({
				html: '<div data-testid="wrapper"><button data-testid="target">Target</button></div>',
			});
			const { element, onBlur, unbind } = focusAndRecordBlur({ id: 'target' });

			getElement({ id: 'wrapper' }).hidden = true;
			await Promise.resolve();

			expect(element).toHaveFocus();
			jest.advanceTimersByTime(0);
			expect(element).toHaveFocus();
			jest.advanceTimersByTime(16);
			expect(document.body).toHaveFocus();
			expect(onBlur).toHaveBeenCalledTimes(1);
			unbind();
		});

		it('moves focus to body one frame after the focused element becomes inert', async () => {
			mount({
				html: '<div data-testid="wrapper"><button data-testid="target">Target</button></div>',
			});
			const { element, onBlur, unbind } = focusAndRecordBlur({ id: 'target' });

			getElement({ id: 'wrapper' }).setAttribute('inert', '');
			await Promise.resolve();

			expect(element).toHaveFocus();
			jest.runOnlyPendingTimers();
			expect(document.body).toHaveFocus();
			expect(onBlur).toHaveBeenCalledTimes(1);
			unbind();
		});

		it('moves focus to body one frame after the popover that has it hides without returning focus', () => {
			mount({
				html: '<div popover="manual" data-testid="popover"><button data-testid="target">Target</button></div>',
			});
			getElement({ id: 'popover' }).showPopover();
			const { element, onBlur, unbind } = focusAndRecordBlur({ id: 'target' });

			getElement({ id: 'popover' }).hidePopover();
			// The toggle event task runs first, while focus is still in the popover.
			jest.advanceTimersByTime(0);

			expect(element).toHaveFocus();
			jest.advanceTimersByTime(16);
			expect(document.body).toHaveFocus();
			expect(onBlur).toHaveBeenCalledTimes(1);
			unbind();
		});

		it('moves focus to body one frame after a non-modal dialog that has it closes without returning focus', () => {
			mount({
				html: '<dialog data-testid="dialog"><button data-testid="target">Target</button></dialog>',
			});
			getDialog({ id: 'dialog' }).show();
			const { element, onBlur, unbind } = focusAndRecordBlur({ id: 'target' });

			getDialog({ id: 'dialog' }).close();

			expect(element).toHaveFocus();
			jest.runOnlyPendingTimers();
			expect(document.body).toHaveFocus();
			expect(onBlur).toHaveBeenCalledTimes(1);
			unbind();
		});

		it('returns focus at once when a modal dialog closes', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><dialog data-testid="dialog"><button>Inside</button></dialog>',
			});
			getElement({ id: 'trigger' }).focus();
			const dialog = getDialog({ id: 'dialog' });
			dialog.showModal();

			dialog.close();

			expect(getElement({ id: 'trigger' })).toHaveFocus();
		});

		it('does not move focus that is still allowed', async () => {
			mount({
				html: '<div data-testid="wrapper"><button data-testid="target">Target</button></div><div data-testid="other"></div>',
			});
			const { element, onBlur, unbind } = focusAndRecordBlur({ id: 'target' });

			getElement({ id: 'other' }).hidden = true;
			await Promise.resolve();
			jest.runOnlyPendingTimers();

			expect(element).toHaveFocus();
			expect(onBlur).not.toHaveBeenCalled();
			unbind();
		});

		it('moves focus to body one frame after the focused element in a shadow root becomes hidden', async () => {
			const container = mount({ html: '' });
			const host = document.createElement('div');
			container.appendChild(host);
			const shadowRoot = host.attachShadow({ mode: 'open' });
			const wrapper = document.createElement('div');
			const button = document.createElement('button');
			button.textContent = 'In shadow root';
			wrapper.appendChild(button);
			shadowRoot.appendChild(wrapper);
			const onBlur = jest.fn();
			const unbind = bind(button, { type: 'blur', listener: onBlur });
			button.focus();
			// The document reports the shadow host as its active element.
			expect(host).toHaveFocus();

			wrapper.hidden = true;
			await Promise.resolve();
			expect(host).toHaveFocus();
			jest.runOnlyPendingTimers();

			expect(onBlur).toHaveBeenCalledTimes(1);
			expect(document.body).toHaveFocus();
			unbind();
		});
	});
});
