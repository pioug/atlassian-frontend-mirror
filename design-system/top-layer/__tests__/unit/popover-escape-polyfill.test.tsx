import { bind, bindAll } from 'bind-event-listener';

import '../../src/testing/polyfill';

describe('polyfilled popover Escape dismissal', () => {
	const elements: HTMLElement[] = [];
	const modes = new Map<HTMLElement, string>();
	const cleanups: (() => void)[] = [];

	beforeEach(() => jest.useFakeTimers());
	afterEach(() => {
		cleanups.splice(0).forEach((cleanup) => cleanup());
		elements
			.splice(0)
			.reverse()
			.forEach((element) => {
				const mode = modes.get(element);
				if (mode) {
					element.setAttribute('popover', mode);
					if (!element.isConnected) {
						document.body.appendChild(element);
					}
					element.hidePopover();
				}
				element.remove();
			});
		modes.clear();
		jest.runAllTimers();
		jest.useRealTimers();
	});

	function createPopover({
		mode = 'auto',
		parent = document.body,
	}: {
		mode?: 'auto' | 'hint' | 'manual';
		parent?: HTMLElement;
	} = {}) {
		const popover = document.createElement('div');
		popover.setAttribute('popover', mode);
		elements.push(popover);
		modes.set(popover, mode);
		parent.appendChild(popover);
		popover.showPopover();
		jest.runAllTimers();
		return popover;
	}

	function pressEscape({ target }: { target: EventTarget }) {
		target.dispatchEvent(
			new KeyboardEvent('keydown', {
				key: 'Escape',
				code: 'Escape',
				bubbles: true,
				cancelable: true,
			}),
		);
	}

	it.each(['auto', 'hint'] as const)(
		'dismisses %s after keydown handlers and before toggle',
		(mode) => {
			const popover = createPopover({ mode });
			const events: string[] = [];
			cleanups.push(
				bindAll(popover, [
					{
						type: 'keydown',
						listener: () => {
							expect(popover.matches(':popover-open')).toBe(true);
							events.push('keydown');
						},
					},
					{ type: 'beforetoggle', listener: () => events.push('beforetoggle') },
					{ type: 'toggle', listener: () => events.push('toggle') },
				]),
			);
			pressEscape({ target: popover });
			expect(events).toEqual(['keydown']);
			expect(popover.matches(':popover-open')).toBe(true);
			jest.runAllTimers();
			expect(events).toEqual(['keydown', 'beforetoggle', 'toggle']);
			expect(popover.matches(':popover-open')).toBe(false);
		},
	);

	it.each([
		['target', true],
		['target', false],
		['document', true],
		['document', false],
		['window', true],
		['window', false],
	] as const)('honours preventDefault at %s, capture=%s', (location, capture) => {
		const popover = createPopover();
		const target = { target: popover, document, window }[location];
		cleanups.push(
			bind(target, {
				type: 'keydown',
				listener: (event) => event.preventDefault(),
				options: { capture },
			}),
		);
		pressEscape({ target: popover });
		jest.runAllTimers();
		expect(popover.matches(':popover-open')).toBe(true);
	});

	it('stopPropagation does not prevent default dismissal', () => {
		const popover = createPopover();
		cleanups.push(bind(popover, { type: 'keydown', listener: (event) => event.stopPropagation() }));
		pressEscape({ target: popover });
		jest.runAllTimers();
		expect(popover.matches(':popover-open')).toBe(false);
	});

	it.each(['close', 'remove', 'reopen', 'manual', 'remove-attribute'] as const)(
		'selects the current layer after the target changes during keydown: %s',
		(action) => {
			const parent = createPopover();
			const child = createPopover({ parent });

			cleanups.push(
				bind(child, {
					type: 'keydown',
					listener: () => {
						if (action === 'remove') {
							child.remove();
						} else if (action === 'remove-attribute') {
							child.removeAttribute('popover');
						} else if (action === 'manual') {
							child.setAttribute('popover', 'manual');
						} else {
							child.hidePopover();
							if (action === 'reopen') {
								child.showPopover();
							}
						}
						if (action === 'manual' || action === 'remove-attribute') {
							expect(child.matches(':popover-open')).toBe(false);
						}
					},
				}),
			);
			pressEscape({ target: child });
			jest.runAllTimers();
			expect(parent.matches(':popover-open')).toBe(action === 'reopen');
			if (action === 'remove') {
				expect(child.isConnected).toBe(false);
			} else {
				expect(child.matches(':popover-open')).toBe(false);
			}
		},
	);

	it.each(['close', 'manual', 'remove-attribute'] as const)(
		'preserves the parent when a handler changes the child and prevents Escape: %s',
		(action) => {
			const parent = createPopover();
			const child = createPopover({ parent });
			cleanups.push(
				bind(child, {
					type: 'keydown',
					listener: (event) => {
						if (action === 'close') {
							child.hidePopover();
						} else if (action === 'manual') {
							child.setAttribute('popover', 'manual');
						} else {
							child.removeAttribute('popover');
						}
						event.preventDefault();
					},
				}),
			);
			pressEscape({ target: child });
			jest.runAllTimers();
			expect(child.matches(':popover-open')).toBe(false);
			expect(parent.matches(':popover-open')).toBe(true);
		},
	);

	it.each(['auto', 'hint', 'manual'] as const)(
		'hides an open %s popover when its mode changes',
		(mode) => {
			const popover = createPopover({ mode });
			const closing = jest.fn();
			cleanups.push(bind(popover, { type: 'beforetoggle', listener: closing }));
			popover.setAttribute('popover', mode);
			expect(popover.matches(':popover-open')).toBe(true);
			expect(closing).not.toHaveBeenCalled();
			popover.popover = mode === 'manual' ? 'auto' : 'manual';
			expect(popover.matches(':popover-open')).toBe(false);
			expect(closing).toHaveBeenCalledTimes(1);
		},
	);

	it('preventing Escape in a child preserves both nested popovers', () => {
		const parent = createPopover();
		const child = createPopover({ parent });
		cleanups.push(bind(child, { type: 'keydown', listener: (event) => event.preventDefault() }));
		pressEscape({ target: child });
		jest.runAllTimers();
		expect(child.matches(':popover-open')).toBe(true);
		expect(parent.matches(':popover-open')).toBe(true);
	});

	it('does not close twice when multiple Escape events target the same opening', () => {
		const popover = createPopover();
		const closing = jest.fn();
		cleanups.push(bind(popover, { type: 'beforetoggle', listener: closing }));
		pressEscape({ target: popover });
		pressEscape({ target: popover });
		jest.runAllTimers();
		expect(popover.matches(':popover-open')).toBe(false);
		expect(closing).toHaveBeenCalledTimes(1);
	});

	it('dismisses a replacement opened during keydown', () => {
		const parent = createPopover();
		const child = createPopover({ parent });
		const replacement = document.createElement('div');
		replacement.setAttribute('popover', 'auto');
		elements.push(replacement);
		modes.set(replacement, 'auto');
		parent.appendChild(replacement);
		cleanups.push(bind(child, { type: 'keydown', listener: () => replacement.showPopover() }));
		pressEscape({ target: child });
		jest.runAllTimers();
		expect(child.matches(':popover-open')).toBe(false);
		expect(parent.matches(':popover-open')).toBe(true);
		expect(replacement.matches(':popover-open')).toBe(false);
	});

	it('dismisses one nested popover per Escape', () => {
		const parent = createPopover();
		const child = createPopover({ parent });
		pressEscape({ target: child });
		jest.runAllTimers();
		expect(child.matches(':popover-open')).toBe(false);
		expect(parent.matches(':popover-open')).toBe(true);
		pressEscape({ target: parent });
		jest.runAllTimers();
		expect(parent.matches(':popover-open')).toBe(false);
	});

	it('cancels the parent dialog when its popover closes in a keydown handler', () => {
		const dialog = document.createElement('dialog');
		elements.push(dialog);
		document.body.appendChild(dialog);
		dialog.showModal();
		const popover = createPopover({ parent: dialog });
		const cancel = jest.fn();
		cleanups.push(bind(dialog, { type: 'cancel', listener: cancel }));
		cleanups.push(bind(popover, { type: 'keydown', listener: () => popover.hidePopover() }));
		pressEscape({ target: popover });
		jest.runAllTimers();
		expect(popover.matches(':popover-open')).toBe(false);
		expect(dialog.open).toBe(false);
		expect(cancel).toHaveBeenCalledTimes(1);
	});

	it('ignores manual popovers and non-Escape keys', () => {
		const manual = createPopover({ mode: 'manual' });
		pressEscape({ target: manual });
		jest.runAllTimers();
		const auto = createPopover();
		auto.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		jest.runAllTimers();
		expect(manual.matches(':popover-open')).toBe(true);
		expect(auto.matches(':popover-open')).toBe(true);
	});
});
