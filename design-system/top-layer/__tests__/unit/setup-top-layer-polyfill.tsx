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

function createPopover({ mode }: { mode: 'manual' | 'auto' }): HTMLDivElement {
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
