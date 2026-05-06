/**
 * Comprehensive test suite for the top-layer jsdom polyfill.
 *
 * Every assertion here has a matching browser test in
 * __tests__/playwright/native-api-timing.spec.tsx that validates
 * the same behavior against real Chromium.
 *
 * The polyfill lives at: build/configs/jest-config/setup/setup-top-layer.js
 *
 * Spec references:
 * - Popover API: https://html.spec.whatwg.org/multipage/popover.html
 * - HTMLDialogElement: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element
 * - Toggle events: https://html.spec.whatwg.org/multipage/popover.html#queue-a-popover-toggle-event-task
 * - ToggleEvent: https://html.spec.whatwg.org/multipage/interaction.html#toggleevent
 */

import { bind } from 'bind-event-listener';

/**
 * Enables fake timers, runs all pending timers, then restores real timers.
 *
 * The polyfill schedules toggle events via `setTimeout`. Fake timers let us
 * deterministically flush those tasks with `jest.runAllTimers()`. Real timers
 * are restored immediately afterwards so the automatic sa11y accessibility
 * check (which runs in afterEach) is not blocked by fake timers.
 */
function flushTasks() {
	jest.runAllTimers();
	jest.useRealTimers();
}

function appendToBody(...elements: Element[]): () => void {
	elements.forEach((element) => {
		document.body.appendChild(element);
	});

	return function removeFromBody() {
		elements.forEach((element) => {
			element.remove();
		});
	};
}

function createPopover({ mode }: { mode: 'manual' | 'auto' | 'hint' }): HTMLDivElement {
	const popover = document.createElement('div');
	popover.setAttribute('popover', mode);
	return popover;
}

function createDialog(): HTMLDialogElement {
	return document.createElement('dialog');
}

// ─── showPopover() ──────────────────────────────────────────────────────────
// https://html.spec.whatwg.org/multipage/popover.html#dom-showpopover

describe('showPopover()', () => {
	it('should throw NotSupportedError when element has no popover attribute', () => {
		const element = document.createElement('div');
		const cleanup = appendToBody(element);

		expect(() => element.showPopover()).toThrow(
			expect.objectContaining({ name: 'NotSupportedError' }),
		);

		cleanup();
	});

	it('should throw InvalidStateError when element is not connected', () => {
		const element = document.createElement('div');
		element.setAttribute('popover', 'manual');

		expect(() => element.showPopover()).toThrow(
			expect.objectContaining({ name: 'InvalidStateError' }),
		);
	});

	it('should be a no-op when already showing', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		popover.showPopover();
		let count = 0;
		bind(popover, {
			type: 'beforetoggle',
			listener: () => {
				count++;
			},
		});

		popover.showPopover();
		flushTasks();

		expect(count).toBe(0);

		cleanup();
	});

	it('should make the element visible when shown', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);

		popover.showPopover();

		expect(popover).toBeVisible();

		cleanup();
	});

	it('should not be visible before showing', () => {
		const element = document.createElement('div');
		element.setAttribute('popover', 'manual');
		const cleanup = appendToBody(element);

		expect(element).not.toBeVisible();

		cleanup();
	});
});

// ─── hidePopover() ──────────────────────────────────────────────────────────
// https://html.spec.whatwg.org/multipage/popover.html#dom-hidepopover

describe('hidePopover()', () => {
	it('should throw NotSupportedError when element has no popover attribute', () => {
		const element = document.createElement('div');
		const cleanup = appendToBody(element);

		expect(() => element.hidePopover()).toThrow(
			expect.objectContaining({ name: 'NotSupportedError' }),
		);

		cleanup();
	});

	it('should not throw when element is disconnected', () => {
		const element = document.createElement('div');
		element.setAttribute('popover', 'manual');

		expect(() => element.hidePopover()).not.toThrow();
	});

	it('should be a no-op when already hidden', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		let count = 0;
		bind(popover, {
			type: 'beforetoggle',
			listener: () => {
				count++;
			},
		});

		popover.hidePopover();
		flushTasks();

		expect(count).toBe(0);

		cleanup();
	});

	it('should make the element not visible when hidden', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		popover.showPopover();

		popover.hidePopover();

		expect(popover).not.toBeVisible();

		cleanup();
	});
});

// ─── popover beforetoggle event ─────────────────────────────────────────────
// https://html.spec.whatwg.org/multipage/popover.html#popover-toggle-event-task

describe('popover beforetoggle event', () => {
	it('should fire synchronously during showPopover()', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		const log: string[] = [];
		bind(popover, {
			type: 'beforetoggle',
			listener: () => {
				log.push('beforetoggle');
			},
		});

		log.push('before-show');
		popover.showPopover();
		log.push('after-show');

		expect(log).toEqual(['before-show', 'beforetoggle', 'after-show']);

		cleanup();
	});

	it('should fire synchronously during hidePopover()', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		popover.showPopover();
		const log: string[] = [];
		bind(popover, {
			type: 'beforetoggle',
			listener: () => {
				log.push('beforetoggle');
			},
		});

		log.push('before-hide');
		popover.hidePopover();
		log.push('after-hide');

		expect(log).toEqual(['before-hide', 'beforetoggle', 'after-hide']);

		cleanup();
	});

	it('should report closed→open on show', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		let captured: { oldState: string; newState: string } | null = null;
		bind(popover, {
			type: 'beforetoggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				captured = { oldState: toggleEvent.oldState, newState: toggleEvent.newState };
			},
		});

		popover.showPopover();

		expect(captured).toEqual({ oldState: 'closed', newState: 'open' });

		cleanup();
	});

	it('should report open→closed on hide', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		popover.showPopover();
		let captured: { oldState: string; newState: string } | null = null;
		bind(popover, {
			type: 'beforetoggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				captured = { oldState: toggleEvent.oldState, newState: toggleEvent.newState };
			},
		});

		popover.hidePopover();

		expect(captured).toEqual({ oldState: 'open', newState: 'closed' });

		cleanup();
	});

	it('should be cancelable on show', () => {
		const popover = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(popover);
		let cancelable: boolean | null = null;
		bind(popover, {
			type: 'beforetoggle',
			listener: (event) => {
				cancelable = event.cancelable;
			},
		});

		popover.showPopover();

		expect(cancelable).toBe(true);

		cleanup();
	});

	it('should not be cancelable on hide', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		popover.showPopover();
		let cancelable: boolean | null = null;
		bind(popover, {
			type: 'beforetoggle',
			listener: (event) => {
				cancelable = event.cancelable;
			},
		});

		popover.hidePopover();

		expect(cancelable).toBe(false);

		cleanup();
	});

	it('should not bubble', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		let bubbles: boolean | null = null;
		bind(popover, {
			type: 'beforetoggle',
			listener: (event) => {
				bubbles = event.bubbles;
			},
		});

		popover.showPopover();

		expect(bubbles).toBe(false);

		cleanup();
	});

	it('should prevent showing when cancelled via preventDefault()', () => {
		const popover = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(popover);
		bind(popover, {
			type: 'beforetoggle',
			listener: (event) => {
				event.preventDefault();
			},
		});

		popover.showPopover();

		expect(popover).not.toBeVisible();

		cleanup();
	});
});

// ─── popover toggle event ───────────────────────────────────────────────────
// https://html.spec.whatwg.org/multipage/popover.html#queue-a-popover-toggle-event-task

describe('popover toggle event', () => {
	it('should fire as a task, after microtasks drain', async () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		const log: string[] = [];
		bind(popover, {
			type: 'toggle',
			listener: () => {
				log.push('toggle');
			},
		});

		popover.showPopover();
		log.push('sync');
		await Promise.resolve();
		log.push('microtask');
		flushTasks();

		expect(log).toEqual(['sync', 'microtask', 'toggle']);

		cleanup();
	});

	it('should report closed→open on show', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		let captured: { oldState: string; newState: string } | null = null;
		bind(popover, {
			type: 'toggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				captured = { oldState: toggleEvent.oldState, newState: toggleEvent.newState };
			},
		});

		popover.showPopover();
		flushTasks();

		expect(captured).toEqual({ oldState: 'closed', newState: 'open' });

		cleanup();
	});

	it('should report open→closed on hide', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		popover.showPopover();
		jest.runAllTimers();
		let captured: { oldState: string; newState: string } | null = null;
		bind(popover, {
			type: 'toggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				captured = { oldState: toggleEvent.oldState, newState: toggleEvent.newState };
			},
		});

		popover.hidePopover();
		flushTasks();

		expect(captured).toEqual({ oldState: 'open', newState: 'closed' });

		cleanup();
	});

	it('should not be cancelable', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		let cancelable: boolean | null = null;
		bind(popover, {
			type: 'toggle',
			listener: (event) => {
				cancelable = event.cancelable;
			},
		});

		popover.showPopover();
		flushTasks();

		expect(cancelable).toBe(false);

		cleanup();
	});

	it('should not bubble', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		let bubbles: boolean | null = null;
		bind(popover, {
			type: 'toggle',
			listener: (event) => {
				bubbles = event.bubbles;
			},
		});

		popover.showPopover();
		flushTasks();

		expect(bubbles).toBe(false);

		cleanup();
	});
});

// ─── popover toggle event coalescing ────────────────────────────────────────
// https://html.spec.whatwg.org/multipage/popover.html#queue-a-popover-toggle-event-task

describe('popover toggle event coalescing', () => {
	it('should coalesce show+hide into one toggle event', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		const events: string[] = [];
		bind(popover, {
			type: 'toggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				events.push(`${toggleEvent.oldState}->${toggleEvent.newState}`);
			},
		});

		popover.showPopover();
		popover.hidePopover();
		flushTasks();

		expect(events).toEqual(['closed->closed']);

		cleanup();
	});

	it('should coalesce show+hide+show+hide into one toggle event', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		const events: string[] = [];
		bind(popover, {
			type: 'toggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				events.push(`${toggleEvent.oldState}->${toggleEvent.newState}`);
			},
		});

		popover.showPopover();
		popover.hidePopover();
		popover.showPopover();
		popover.hidePopover();
		flushTasks();

		expect(events).toEqual(['closed->closed']);

		cleanup();
	});

	it('should fire separate toggle events when separated by a task boundary', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		const events: string[] = [];
		bind(popover, {
			type: 'toggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				events.push(`${toggleEvent.oldState}->${toggleEvent.newState}`);
			},
		});

		popover.showPopover();
		jest.runAllTimers();

		popover.hidePopover();
		flushTasks();

		expect(events).toEqual(['closed->open', 'open->closed']);

		cleanup();
	});
});

// ─── togglePopover() ────────────────────────────────────────────────────────
// https://html.spec.whatwg.org/multipage/popover.html#dom-togglepopover

describe('togglePopover()', () => {
	it('should open a closed popover and return true', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);

		const result = popover.togglePopover();

		expect(result).toBe(true);
		expect(popover).toBeVisible();

		cleanup();
	});

	it('should close an open popover and return false', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		popover.showPopover();

		const result = popover.togglePopover();

		expect(result).toBe(false);
		expect(popover).not.toBeVisible();

		cleanup();
	});

	it('should open when force=true and closed', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);

		const result = popover.togglePopover(true);

		expect(result).toBe(true);
		expect(popover).toBeVisible();

		cleanup();
	});

	it('should be a no-op when force=true and already open', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		popover.showPopover();

		const result = popover.togglePopover(true);

		expect(result).toBe(true);
		expect(popover).toBeVisible();

		cleanup();
	});

	it('should close when force=false and open', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		popover.showPopover();

		const result = popover.togglePopover(false);

		expect(result).toBe(false);
		expect(popover).not.toBeVisible();

		cleanup();
	});

	it('should be a no-op when force=false and already closed', () => {
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);

		const result = popover.togglePopover(false);

		expect(result).toBe(false);
		expect(popover).not.toBeVisible();

		cleanup();
	});
});

// ─── dialog.showModal() ─────────────────────────────────────────────────────
// https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-showmodal

describe('dialog.showModal()', () => {
	it('should throw InvalidStateError when dialog is not connected', () => {
		const dialog = document.createElement('dialog');

		expect(() => dialog.showModal()).toThrow(
			expect.objectContaining({ name: 'InvalidStateError' }),
		);
	});

	it('should throw InvalidStateError when dialog is already open non-modally', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.show();

		expect(() => dialog.showModal()).toThrow(
			expect.objectContaining({ name: 'InvalidStateError' }),
		);

		cleanup();
	});

	it('should open the dialog', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);

		dialog.showModal();

		expect(dialog).toHaveAttribute('open');

		cleanup();
	});

	it('should be a no-op when already modal', () => {
		jest.useFakeTimers();
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.showModal();
		let count = 0;
		bind(dialog, {
			type: 'beforetoggle',
			listener: () => {
				count++;
			},
		});

		dialog.showModal();
		flushTasks();

		expect(count).toBe(0);

		cleanup();
	});

	it('should fire beforetoggle synchronously with closed→open', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		const log: string[] = [];
		bind(dialog, {
			type: 'beforetoggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				log.push(`beforetoggle:${toggleEvent.oldState}->${toggleEvent.newState}`);
			},
		});

		log.push('before');
		dialog.showModal();
		log.push('after');

		expect(log).toEqual(['before', 'beforetoggle:closed->open', 'after']);

		cleanup();
	});

	it('should fire toggle as a task with closed→open', async () => {
		jest.useFakeTimers();
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		const log: string[] = [];
		bind(dialog, {
			type: 'toggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				log.push(`toggle:${toggleEvent.oldState}->${toggleEvent.newState}`);
			},
		});

		dialog.showModal();
		log.push('sync');
		await Promise.resolve();
		log.push('microtask');
		flushTasks();

		expect(log).toEqual(['sync', 'microtask', 'toggle:closed->open']);

		cleanup();
	});

	it('should fire beforetoggle that is not cancelable', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		let cancelable: boolean | null = null;
		bind(dialog, {
			type: 'beforetoggle',
			listener: (event) => {
				cancelable = event.cancelable;
			},
		});

		dialog.showModal();

		expect(cancelable).toBe(false);

		cleanup();
	});
});

// ─── dialog.show() ──────────────────────────────────────────────────────────
// https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-show

describe('dialog.show()', () => {
	it('should not throw when dialog is disconnected', () => {
		const dialog = document.createElement('dialog');

		expect(() => dialog.show()).not.toThrow();
	});

	it('should be a no-op when already open', () => {
		jest.useFakeTimers();
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.show();
		let count = 0;
		bind(dialog, {
			type: 'beforetoggle',
			listener: () => {
				count++;
			},
		});

		dialog.show();
		flushTasks();

		expect(count).toBe(0);

		cleanup();
	});

	it('should open the dialog', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);

		dialog.show();

		expect(dialog).toHaveAttribute('open');

		cleanup();
	});

	it('should fire beforetoggle synchronously with closed→open', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		const log: string[] = [];
		bind(dialog, {
			type: 'beforetoggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				log.push(`beforetoggle:${toggleEvent.oldState}->${toggleEvent.newState}`);
			},
		});

		log.push('before');
		dialog.show();
		log.push('after');

		expect(log).toEqual(['before', 'beforetoggle:closed->open', 'after']);

		cleanup();
	});

	it('should fire toggle as a task with closed→open', () => {
		jest.useFakeTimers();
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		let captured: { oldState: string; newState: string } | null = null;
		bind(dialog, {
			type: 'toggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				captured = { oldState: toggleEvent.oldState, newState: toggleEvent.newState };
			},
		});

		dialog.show();
		flushTasks();

		expect(captured).toEqual({ oldState: 'closed', newState: 'open' });

		cleanup();
	});
});

// ─── dialog.close() ─────────────────────────────────────────────────────────
// https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-close

describe('dialog.close()', () => {
	it('should be a no-op when already closed', () => {
		jest.useFakeTimers();
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		const events: string[] = [];
		bind(dialog, {
			type: 'toggle',
			listener: () => {
				events.push('toggle');
			},
		});
		bind(dialog, {
			type: 'close',
			listener: () => {
				events.push('close');
			},
		});

		dialog.close();
		flushTasks();

		expect(events).toEqual([]);

		cleanup();
	});

	it('should close the dialog', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.showModal();

		dialog.close();

		expect(dialog).not.toHaveAttribute('open');

		cleanup();
	});

	it('should set returnValue when provided', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.showModal();

		dialog.close('my-result');

		expect(dialog.returnValue).toBe('my-result');

		cleanup();
	});

	it('should fire beforetoggle synchronously with open→closed', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.showModal();
		const log: string[] = [];
		bind(dialog, {
			type: 'beforetoggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				log.push(`beforetoggle:${toggleEvent.oldState}->${toggleEvent.newState}`);
			},
		});

		log.push('before-close');
		dialog.close();
		log.push('after-close');

		expect(log).toEqual(['before-close', 'beforetoggle:open->closed', 'after-close']);

		cleanup();
	});

	it('should fire beforetoggle that is not cancelable on close', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.showModal();
		let cancelable: boolean | null = null;
		bind(dialog, {
			type: 'beforetoggle',
			listener: (event) => {
				cancelable = event.cancelable;
			},
		});

		dialog.close();

		expect(cancelable).toBe(false);

		cleanup();
	});

	it('should fire toggle(open→closed) followed by close event', () => {
		jest.useFakeTimers();
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.showModal();
		jest.runAllTimers();
		const log: string[] = [];
		bind(dialog, {
			type: 'toggle',
			listener: (event) => {
				const toggleEvent = event as ToggleEvent;
				log.push(`toggle:${toggleEvent.oldState}->${toggleEvent.newState}`);
			},
		});
		bind(dialog, {
			type: 'close',
			listener: () => {
				log.push('close');
			},
		});

		dialog.close();
		flushTasks();

		expect(log).toEqual(['toggle:open->closed', 'close']);

		cleanup();
	});

	it('should fire close event as a task, after sync code and microtasks', async () => {
		jest.useFakeTimers();
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.showModal();
		jest.runAllTimers();
		const log: string[] = [];
		bind(dialog, {
			type: 'close',
			listener: () => {
				log.push('close');
			},
		});

		dialog.close();
		log.push('sync');
		await Promise.resolve();
		log.push('microtask');
		flushTasks();

		expect(log).toEqual(['sync', 'microtask', 'close']);

		cleanup();
	});

	it('should fire close event that does not bubble and is not cancelable', () => {
		jest.useFakeTimers();
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.showModal();
		jest.runAllTimers();
		let bubbles: boolean | null = null;
		let cancelable: boolean | null = null;
		bind(dialog, {
			type: 'close',
			listener: (event) => {
				bubbles = event.bubbles;
				cancelable = event.cancelable;
			},
		});

		dialog.close();
		flushTasks();

		expect(bubbles).toBe(false);
		expect(cancelable).toBe(false);

		cleanup();
	});
});

// ─── dialog.returnValue ─────────────────────────────────────────────────────
// https://html.spec.whatwg.org/multipage/interactive-elements.html#dom-dialog-returnvalue

describe('dialog.returnValue', () => {
	it('should default to empty string', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);

		expect(dialog.returnValue).toBe('');

		cleanup();
	});

	it('should be settable', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);

		dialog.returnValue = 'test-value';

		expect(dialog.returnValue).toBe('test-value');

		cleanup();
	});

	it('should be set by close(returnValue)', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.showModal();

		dialog.close('from-close');

		expect(dialog.returnValue).toBe('from-close');

		cleanup();
	});

	it('should not be changed by close() without argument', () => {
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		dialog.returnValue = 'existing';
		dialog.showModal();

		dialog.close();

		expect(dialog.returnValue).toBe('existing');

		cleanup();
	});
});


// ─── auto popover stack & dismissal ─────────────────────────────────────────
// https://html.spec.whatwg.org/multipage/popover.html#popover-light-dismiss

// Spec: https://html.spec.whatwg.org/multipage/popover.html#hide-all-popovers-until
describe('popover="auto" stack and light-dismiss', () => {
	it('opening a sibling auto popover closes the previously open one', () => {
		jest.useFakeTimers();
		const a = createPopover({ mode: 'auto' });
		const b = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(a, b);

		a.showPopover();
		flushTasks();
		expect(a).toHaveAttribute('data-popover-open');

		jest.useFakeTimers();
		b.showPopover();
		flushTasks();

		expect(a).not.toHaveAttribute('data-popover-open');
		expect(b).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('opening a nested auto popover (inside the open one) keeps the outer open', () => {
		jest.useFakeTimers();
		const outer = createPopover({ mode: 'auto' });
		const inner = createPopover({ mode: 'auto' });
		outer.appendChild(inner);
		const cleanup = appendToBody(outer);

		outer.showPopover();
		flushTasks();
		jest.useFakeTimers();
		inner.showPopover();
		flushTasks();

		expect(outer).toHaveAttribute('data-popover-open');
		expect(inner).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('mousedown outside any open auto popover closes them', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'auto' });
		const outside = document.createElement('div');
		const cleanup = appendToBody(popover, outside);

		popover.showPopover();
		flushTasks();
		expect(popover).toHaveAttribute('data-popover-open');

		jest.useFakeTimers();
		outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		outside.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
		flushTasks();

		expect(popover).not.toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('mousedown inside an open auto popover keeps it open', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'auto' });
		const inside = document.createElement('span');
		popover.appendChild(inside);
		const cleanup = appendToBody(popover);

		popover.showPopover();
		flushTasks();

		jest.useFakeTimers();
		inside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		flushTasks();

		expect(popover).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('Escape closes the topmost open auto popover', () => {
		jest.useFakeTimers();
		const a = createPopover({ mode: 'auto' });
		const b = createPopover({ mode: 'auto' });
		// Nest b inside a so opening b does not light-dismiss a.
		a.appendChild(b);
		const cleanup = appendToBody(a);

		a.showPopover();
		flushTasks();
		jest.useFakeTimers();
		b.showPopover();
		flushTasks();

		jest.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		flushTasks();

		expect(b).not.toHaveAttribute('data-popover-open');
		expect(a).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('manual popovers are not light-dismissed by outside mousedown', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const outside = document.createElement('div');
		const cleanup = appendToBody(popover, outside);

		popover.showPopover();
		flushTasks();
		jest.useFakeTimers();
		outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		flushTasks();

		expect(popover).toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// ─── popover opacity-clear on open ──────────────────────────────────────────
// In jsdom there is no real layout, so any caller that uses a
// `ResizeObserver`-driven reveal pattern (e.g. `use-anchor-position`) would
// otherwise leave the popover at `opacity: 0`. The polyfill clears any inline
// `opacity` set before its own toggle listener runs.

// Polyfill-only behaviour to compensate for jsdom not delivering ResizeObserver callbacks.
describe('popover opacity guard cleanup', () => {
	it('clears inline opacity:0 set before showPopover after the open toggle fires', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(popover);

		popover.style.setProperty('opacity', '0');
		popover.showPopover();
		flushTasks();

		expect(popover).toHaveStyle({opacity:''});

		cleanup();
	});

	it('clears inline opacity:0 set by a caller toggle listener (anchor-positioning pattern)', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(popover);

		bind(popover, {
			type: 'toggle',
			listener: (event) => {
				const toggleEvent = event as Event & { newState?: 'open' | 'closed' };
				if (toggleEvent.newState === 'open') {
					popover.style.setProperty('opacity', '0');
				}
			},
		});

		popover.showPopover();
		flushTasks();

		expect(popover).toHaveStyle({opacity:''});

		cleanup();
	});

	it('does not clear opacity on hide', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);

		popover.showPopover();
		flushTasks();
		popover.style.setProperty('opacity', '0.5');
		jest.useFakeTimers();
		popover.hidePopover();
		flushTasks();

		expect(popover).toHaveStyle({opacity:'0.5'});

		cleanup();
	});
});


// ─── togglePopover() return value after cancel ──────────────────────────────

// Spec: https://html.spec.whatwg.org/multipage/popover.html#dom-togglepopover
describe('togglePopover() return value after beforetoggle cancellation', () => {
	it('returns false when beforetoggle is cancelled on show (no force)', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		bind(popover, {
			type: 'beforetoggle',
			listener: (event: Event) => {
				const toggleEvent = event as ToggleEvent;
				if (toggleEvent.newState === 'open') {
					event.preventDefault();
				}
			},
		});

		const result = popover.togglePopover();

		expect(result).toBe(false);
		expect(popover).not.toHaveAttribute('data-popover-open');

		// Switch to real timers so the sa11y afterEach hook can run.
		jest.useRealTimers();
		cleanup();
	});

	it('returns false when beforetoggle is cancelled on show with force=true', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(popover);
		bind(popover, {
			type: 'beforetoggle',
			listener: (event: Event) => {
				const toggleEvent = event as ToggleEvent;
				if (toggleEvent.newState === 'open') {
					event.preventDefault();
				}
			},
		});

		const result = popover.togglePopover(true);

		expect(result).toBe(false);
		expect(popover).not.toHaveAttribute('data-popover-open');

		// Switch to real timers so the sa11y afterEach hook can run.
		jest.useRealTimers();
		cleanup();
	});
});

// ─── auto-stack membership ──────────────────────────────────────────────────

// Spec: https://html.spec.whatwg.org/multipage/popover.html#showing-auto-popover-list
describe('auto-stack membership', () => {
	it('hidePopover removes the popover from the open-auto-stack', () => {
		jest.useFakeTimers();
		const a = createPopover({ mode: 'auto' });
		const b = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(a, b);

		a.showPopover();
		flushTasks();
		jest.useFakeTimers();
		a.hidePopover();
		flushTasks();

		// If `a` were still in the stack, opening `b` would dismiss it again.
		// More directly: pressing Escape after `b` opens should close `b`,
		// not anything previously left in the stack.
		jest.useFakeTimers();
		b.showPopover();
		flushTasks();
		jest.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		flushTasks();

		expect(b).not.toHaveAttribute('data-popover-open');
		expect(a).not.toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('manual popover does not enter the auto-stack', () => {
		jest.useFakeTimers();
		const manualPopover = createPopover({ mode: 'manual' });
		const autoPopover = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(manualPopover, autoPopover);

		manualPopover.showPopover();
		flushTasks();

		// Opening an auto popover must not close the manual one.
		jest.useFakeTimers();
		autoPopover.showPopover();
		flushTasks();
		expect(manualPopover).toHaveAttribute('data-popover-open');

		// Escape closes the topmost auto, not the manual.
		jest.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		flushTasks();
		expect(autoPopover).not.toHaveAttribute('data-popover-open');
		expect(manualPopover).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('opening a third sibling auto closes both prior siblings in stack order', () => {
		jest.useFakeTimers();
		const a = createPopover({ mode: 'auto' });
		const b = createPopover({ mode: 'auto' });
		const c = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(a, b, c);

		a.showPopover();
		flushTasks();
		jest.useFakeTimers();
		b.showPopover();
		flushTasks();
		// Opening b already closed a (covered in earlier test).
		jest.useFakeTimers();
		c.showPopover();
		flushTasks();

		expect(a).not.toHaveAttribute('data-popover-open');
		expect(b).not.toHaveAttribute('data-popover-open');
		expect(c).toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// ─── opacity-clear one-shot semantics ───────────────────────────────────────

// Polyfill-only behaviour: only clears opacity on the open toggle, never after.
describe('opacity-clear listener is one-shot', () => {
	it('does not clear opacity set after the open toggle has fired', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(popover);

		popover.showPopover();
		flushTasks();
		// At this point the polyfill's clear-on-open listener has run and
		// removed itself. Setting opacity now must persist.
		popover.style.setProperty('opacity', '0');

		expect(popover).toHaveStyle({opacity:'0'});

		cleanup();
	});
});

// ─── popover attribute mode parsing ─────────────────────────────────────────

// Spec: https://html.spec.whatwg.org/multipage/popover.html#attr-popover
describe('popover attribute mode parsing', () => {
	it('treats popover="" (empty value) as auto mode', () => {
		jest.useFakeTimers();
		const a = document.createElement('div');
		a.setAttribute('popover', '');
		const b = document.createElement('div');
		b.setAttribute('popover', '');
		const cleanup = appendToBody(a, b);

		a.showPopover();
		flushTasks();
		jest.useFakeTimers();
		b.showPopover();
		flushTasks();

		// If popover="" were treated as manual, opening b would not close a.
		expect(a).not.toHaveAttribute('data-popover-open');
		expect(b).toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// ─── light-dismiss capture-phase semantics ──────────────────────────────────

// Defensive against application handlers that call event.stopPropagation in bubble phase.
describe('light-dismiss runs in the capture phase', () => {
	it('dismisses even if an app handler calls stopPropagation in bubble phase', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'auto' });
		const outside = document.createElement('div');
		const cleanup = appendToBody(popover, outside);

		popover.showPopover();
		flushTasks();

		// App-installed bubble-phase handler tries to swallow the event.
		bind(outside, {
			type: 'mousedown',
			listener: (event: Event) => {
				event.stopPropagation();
			},
		});

		jest.useFakeTimers();
		outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		outside.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
		flushTasks();

		expect(popover).not.toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// ─── dialog open+close coalescing ───────────────────────────────────────────

// Spec: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element
describe('dialog open+close coalescing', () => {
	it('show() then close() in same task fires close event after coalesced toggle', () => {
		jest.useFakeTimers();
		const dialog = createDialog();
		const cleanup = appendToBody(dialog);
		const events: string[] = [];
		bind(dialog, {
			type: 'toggle',
			listener: (event: Event) => {
				const toggleEvent = event as ToggleEvent;
				events.push(`toggle:${toggleEvent.oldState}->${toggleEvent.newState}`);
			},
		});
		bind(dialog, {
			type: 'close',
			listener: () => {
				events.push('close');
			},
		});

		dialog.show();
		dialog.close();
		flushTasks();

		// Dialog matches popover behavior: coalesced no-op still fires toggle and
		// then the close event in a separate task.
		expect(events).toEqual(['toggle:closed->closed', 'close']);
		expect(dialog).not.toHaveAttribute('open');

		cleanup();
	});
});

// ─── consecutive Escape presses ─────────────────────────────────────────────

// Spec: https://html.spec.whatwg.org/multipage/popover.html#close-watcher (Escape closes the topmost popover)
describe('Escape stacking', () => {
	it('two consecutive Escape presses close two popovers', () => {
		jest.useFakeTimers();
		const outer = createPopover({ mode: 'auto' });
		const inner = createPopover({ mode: 'auto' });
		outer.appendChild(inner);
		const cleanup = appendToBody(outer);

		outer.showPopover();
		flushTasks();
		jest.useFakeTimers();
		inner.showPopover();
		flushTasks();

		jest.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		flushTasks();
		expect(inner).not.toHaveAttribute('data-popover-open');
		expect(outer).toHaveAttribute('data-popover-open');

		jest.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		flushTasks();
		expect(outer).not.toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// Spec: https://html.spec.whatwg.org/multipage/popover.html#dom-popover
describe('IDL `popover` getter and setter', () => {
	it('getter returns the canonical mode for valid attribute values', () => {
		const auto = createPopover({ mode: 'auto' });
		const hint = createPopover({ mode: 'hint' });
		const manual = createPopover({ mode: 'manual' });

		expect(auto.popover).toBe('auto');
		expect(hint.popover).toBe('hint');
		expect(manual.popover).toBe('manual');
	});

	it('getter returns `auto` for an empty `popover` attribute value', () => {
		const popover = document.createElement('div');
		popover.setAttribute('popover', '');

		expect(popover.popover).toBe('auto');
	});

	it('getter returns `manual` for unknown attribute values (invalid-value default)', () => {
		const popover = document.createElement('div');
		popover.setAttribute('popover', 'totally-bogus');

		expect(popover.popover).toBe('manual');
	});

	it('getter returns null when the attribute is absent', () => {
		const popover = document.createElement('div');

		expect(popover.popover).toBeNull();
	});

	it('setter writes the value through to the attribute', () => {
		const popover = document.createElement('div');

		popover.popover = 'hint';
		expect(popover).toHaveAttribute('popover', 'hint');

		popover.popover = 'auto';
		expect(popover).toHaveAttribute('popover', 'auto');
	});

	it('setter with null removes the attribute', () => {
		const popover = createPopover({ mode: 'auto' });

		popover.popover = null;
		expect(popover).not.toHaveAttribute('popover');
		expect(popover.popover).toBeNull();
	});

	it('feature-detection pattern used by Atlaskit reports `hint` as supported', () => {
		// Mirrors `supportsPopoverHint()` in @atlaskit/top-layer/src/popover/popover.tsx.
		const probe = document.createElement('div');
		probe.setAttribute('popover', 'hint');

		expect(probe.popover).toBe('hint');
	});
});

// Spec: https://html.spec.whatwg.org/multipage/popover.html#popover-and-hint-stacks
describe('hint stack semantics', () => {
	it('opening a hint does not close an open auto', () => {
		jest.useFakeTimers();
		const auto = createPopover({ mode: 'auto' });
		const hint = createPopover({ mode: 'hint' });
		const cleanup = appendToBody(auto, hint);

		auto.showPopover();
		flushTasks();
		hint.showPopover();
		flushTasks();

		expect(auto).toHaveAttribute('data-popover-open');
		expect(hint).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('opening a second hint closes the first hint', () => {
		jest.useFakeTimers();
		const hintA = createPopover({ mode: 'hint' });
		const hintB = createPopover({ mode: 'hint' });
		const cleanup = appendToBody(hintA, hintB);

		hintA.showPopover();
		flushTasks();
		hintB.showPopover();
		flushTasks();

		expect(hintA).not.toHaveAttribute('data-popover-open');
		expect(hintB).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('opening an auto closes all open hints', () => {
		jest.useFakeTimers();
		const hint = createPopover({ mode: 'hint' });
		const auto = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(hint, auto);

		hint.showPopover();
		flushTasks();
		auto.showPopover();
		flushTasks();

		expect(hint).not.toHaveAttribute('data-popover-open');
		expect(auto).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('hints are light-dismissed by an outside pointerdown+pointerup', () => {
		jest.useFakeTimers();
		const hint = createPopover({ mode: 'hint' });
		const outside = document.createElement('div');
		const cleanup = appendToBody(hint, outside);

		hint.showPopover();
		flushTasks();
		outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		outside.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
		flushTasks();

		expect(hint).not.toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('Escape closes the topmost popover (hint sits above auto)', () => {
		jest.useFakeTimers();
		const auto = createPopover({ mode: 'auto' });
		const hint = createPopover({ mode: 'hint' });
		const cleanup = appendToBody(auto, hint);

		auto.showPopover();
		flushTasks();
		jest.useFakeTimers();
		hint.showPopover();
		flushTasks();

		jest.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		flushTasks();

		// Hint dismissed first; auto remains open.
		expect(hint).not.toHaveAttribute('data-popover-open');
		expect(auto).toHaveAttribute('data-popover-open');

		jest.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		flushTasks();

		expect(auto).not.toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('hidePopover removes a hint from the hint stack', () => {
		jest.useFakeTimers();
		const hintA = createPopover({ mode: 'hint' });
		const hintB = createPopover({ mode: 'hint' });
		const cleanup = appendToBody(hintA, hintB);

		hintA.showPopover();
		flushTasks();
		hintA.hidePopover();
		flushTasks();
		// Opening hintB after hidePopover() should not affect anything else;
		// hintA should remain closed (proves hintA was removed from the stack
		// and is not re-closed when hintB pushes onto it).
		hintB.showPopover();
		flushTasks();

		expect(hintA).not.toHaveAttribute('data-popover-open');
		expect(hintB).toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// Spec: https://html.spec.whatwg.org/multipage/popover.html#topmost-popover-ancestor
describe('invoker chain ancestor lookup (popovertarget)', () => {
	it('opening B from a button inside A does not close A (DOM-nested invoker)', () => {
		jest.useFakeTimers();
		const auto = createPopover({ mode: 'auto' });
		const trigger = document.createElement('button');
		trigger.setAttribute('popovertarget', 'inner');
		auto.appendChild(trigger);

		const inner = createPopover({ mode: 'auto' });
		inner.id = 'inner';

		const cleanup = appendToBody(auto, inner);

		auto.showPopover();
		flushTasks();
		// Open inner directly (simulating the invoker click); the spec's invoker
		// chain says inner's button is inside auto, so auto stays open.
		inner.showPopover();
		flushTasks();

		expect(auto).toHaveAttribute('data-popover-open');
		expect(inner).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('clicking an invoker inside an open auto popover does not light-dismiss the auto', () => {
		jest.useFakeTimers();
		const auto = createPopover({ mode: 'auto' });
		const trigger = document.createElement('button');
		trigger.setAttribute('popovertarget', 'other');
		auto.appendChild(trigger);
		const other = createPopover({ mode: 'auto' });
		other.id = 'other';

		const cleanup = appendToBody(auto, other);

		auto.showPopover();
		flushTasks();
		// pointerdown+pointerup on the invoker button: per spec the nearest open
		// popover for `trigger` is `auto` (its DOM ancestor), so `auto` is not
		// dismissed. The invoker's own action would open `other`; we are only
		// asserting that the document-level light-dismiss does not close `auto`.
		trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		trigger.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
		flushTasks();

		expect(auto).toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// Spec: https://html.spec.whatwg.org/multipage/popover.html#light-dismiss-open-popovers
describe('pointerdown+pointerup same-target dismissal', () => {
	it('pointerdown inside, pointerup outside (drag-out) does NOT dismiss', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'auto' });
		const inside = document.createElement('div');
		popover.appendChild(inside);
		const outside = document.createElement('div');
		const cleanup = appendToBody(popover, outside);

		popover.showPopover();
		flushTasks();
		inside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		outside.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
		flushTasks();

		// Drag from inside to outside is not a "click", so the popover stays open.
		expect(popover).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('pointerdown outside, pointerup inside (drag-in) does NOT dismiss', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'auto' });
		const inside = document.createElement('div');
		popover.appendChild(inside);
		const outside = document.createElement('div');
		const cleanup = appendToBody(popover, outside);

		popover.showPopover();
		flushTasks();
		outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		inside.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
		flushTasks();

		// User started outside but released inside, so this is not a clean outside click.
		expect(popover).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('pointerdown+pointerup outside (clean outside click) DOES dismiss', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'auto' });
		const outside = document.createElement('div');
		const cleanup = appendToBody(popover, outside);

		popover.showPopover();
		flushTasks();
		outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		outside.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
		flushTasks();

		expect(popover).not.toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// Spec: https://html.spec.whatwg.org/multipage/popover.html#popover-stack-management
// Polyfill-only: defensive cleanup of stale stack entries left by tests that
// remove popovers from the DOM without calling hidePopover() first.
describe('disconnected popover pruning', () => {
	it('Escape skips disconnected popovers and closes the topmost connected one', () => {
		jest.useFakeTimers();
		const ghost = createPopover({ mode: 'auto' });
		const live = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(ghost, live);

		ghost.showPopover();
		flushTasks();
		jest.useFakeTimers();
		// Remove ghost from DOM without calling hidePopover. It should be pruned
		// from the open-auto-stack on the next Escape so live is closed cleanly.
		ghost.remove();
		live.showPopover();
		flushTasks();

		jest.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		flushTasks();

		expect(live).not.toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('light-dismiss skips disconnected popovers in the open stack', () => {
		jest.useFakeTimers();
		const ghost = createPopover({ mode: 'auto' });
		const live = createPopover({ mode: 'auto' });
		const outside = document.createElement('div');
		const cleanup = appendToBody(ghost, live, outside);

		ghost.showPopover();
		flushTasks();
		jest.useFakeTimers();
		ghost.remove();
		live.showPopover();
		flushTasks();

		jest.useFakeTimers();
		outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
		outside.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
		flushTasks();

		expect(live).not.toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// Spec: https://html.spec.whatwg.org/multipage/popover.html#light-dismiss-open-popovers
describe('light-dismiss responds to PointerEvent (not only MouseEvent)', () => {
	it('pointerdown+pointerup outside an open auto popover dismisses it', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'auto' });
		const outside = document.createElement('div');
		const cleanup = appendToBody(popover, outside);

		popover.showPopover();
		flushTasks();
		jest.useFakeTimers();
		// Use PointerEvent directly. Some test runners only fire pointer events.
		const pointerdown = new Event('pointerdown', { bubbles: true });
		const pointerup = new Event('pointerup', { bubbles: true });
		Object.defineProperty(pointerdown, 'target', { value: outside });
		Object.defineProperty(pointerup, 'target', { value: outside });
		outside.dispatchEvent(pointerdown);
		outside.dispatchEvent(pointerup);
		flushTasks();

		expect(popover).not.toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// Spec: https://html.spec.whatwg.org/multipage/popover.html#close-watcher
describe('Escape handler edge cases', () => {
	it('does nothing when no popovers are open', () => {
		jest.useFakeTimers();
		// Sanity: a stray Escape with empty stacks must not throw.
		expect(() => {
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		}).not.toThrow();
		flushTasks();
	});

	it('ignores keys other than Escape', () => {
		jest.useFakeTimers();
		const popover = createPopover({ mode: 'auto' });
		const cleanup = appendToBody(popover);

		popover.showPopover();
		flushTasks();
		jest.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
		flushTasks();

		expect(popover).toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// Spec: https://html.spec.whatwg.org/multipage/popover.html#popover-stack-management
describe('manual popover stack semantics', () => {
	it('opening a manual popover does not affect the auto stack', () => {
		jest.useFakeTimers();
		const auto = createPopover({ mode: 'auto' });
		const manual = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(auto, manual);

		auto.showPopover();
		flushTasks();
		jest.useFakeTimers();
		manual.showPopover();
		flushTasks();

		// Both stay open: manual lives outside the auto stack.
		expect(auto).toHaveAttribute('data-popover-open');
		expect(manual).toHaveAttribute('data-popover-open');

		cleanup();
	});

	it('Escape does not close manual popovers', () => {
		jest.useFakeTimers();
		const manual = createPopover({ mode: 'manual' });
		const cleanup = appendToBody(manual);

		manual.showPopover();
		flushTasks();
		jest.useFakeTimers();
		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		flushTasks();

		expect(manual).toHaveAttribute('data-popover-open');

		cleanup();
	});
});

// Spec: https://html.spec.whatwg.org/multipage/popover.html#dom-popover
describe('IDL `popover` setter round-trips through the getter', () => {
	it('setter accepts unknown values verbatim but the getter normalises to `manual`', () => {
		const popover = document.createElement('div');

		popover.popover = 'totally-bogus' as unknown as 'auto' | 'manual' | 'hint' | null;

		expect(popover).toHaveAttribute('popover', 'totally-bogus');
		expect(popover.popover).toBe('manual');
	});
});
