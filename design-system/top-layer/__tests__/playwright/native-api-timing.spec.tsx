/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
/**
 * Browser tests that validate native popover and dialog API timing in Chromium.
 *
 * These tests serve as the source of truth for the jsdom polyfill at
 * build/configs/jest-config/setup/setup-top-layer.js.
 * Every assertion in the unit test file (setup-top-layer-polyfill.tsx)
 * should have a matching assertion here.
 *
 * Spec references:
 * - Popover API: https://html.spec.whatwg.org/multipage/popover.html
 * - HTMLDialogElement: https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element
 * - Toggle events: https://html.spec.whatwg.org/multipage/popover.html#queue-a-popover-toggle-event-task
 * - ToggleEvent: https://html.spec.whatwg.org/multipage/interaction.html#toggleevent
 */

import { expect, test } from '@af/integration-testing';

test.describe('native popover and dialog API timing', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample<typeof import('../../examples/150-testing-native-api-timing.tsx')>(
			'design-system',
			'top-layer',
			'testing-native-api-timing',
		);
	});

	// ─── showPopover() ────────────────────────────────────────────────────

	test('showPopover: should throw when element has no popover attribute', async ({ page }) => {
		const threw = await page.evaluate(() => {
			const element = document.createElement('div');
			document.body.appendChild(element);
			try {
				element.showPopover();
				return false;
			} catch (error) {
				return (error as DOMException).name === 'NotSupportedError';
			} finally {
				element.remove();
			}
		});

		expect(threw).toBe(true);
	});

	test('showPopover: should throw when element is not connected', async ({ page }) => {
		const threw = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			try {
				element.showPopover();
				return false;
			} catch (error) {
				return (error as DOMException).name === 'InvalidStateError';
			}
		});

		expect(threw).toBe(true);
	});

	test('showPopover: should be a no-op when already showing', async ({ page }) => {
		const count = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			element.showPopover();
			let eventCount = 0;
			element.addEventListener('beforetoggle', () => {
				eventCount++;
			});
			element.showPopover();
			element.remove();
			return eventCount;
		});

		expect(count).toBe(0);
	});

	// ─── hidePopover() ────────────────────────────────────────────────────

	test('hidePopover: should throw when element has no popover attribute', async ({ page }) => {
		const threw = await page.evaluate(() => {
			const element = document.createElement('div');
			document.body.appendChild(element);
			try {
				element.hidePopover();
				return false;
			} catch (error) {
				return (error as DOMException).name === 'NotSupportedError';
			} finally {
				element.remove();
			}
		});

		expect(threw).toBe(true);
	});

	test('hidePopover: should be a no-op when already hidden', async ({ page }) => {
		const count = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			let eventCount = 0;
			element.addEventListener('beforetoggle', () => {
				eventCount++;
			});
			element.hidePopover();
			element.remove();
			return eventCount;
		});

		expect(count).toBe(0);
	});

	// ─── popover beforetoggle event ───────────────────────────────────────

	test('popover beforetoggle: should fire synchronously during showPopover', async ({ page }) => {
		const log = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			const entries: string[] = [];
			element.addEventListener('beforetoggle', () => {
				entries.push('beforetoggle');
			});
			entries.push('before-show');
			element.showPopover();
			entries.push('after-show');
			element.remove();
			return entries;
		});

		expect(log).toEqual(['before-show', 'beforetoggle', 'after-show']);
	});

	test('popover beforetoggle: should fire synchronously during hidePopover', async ({ page }) => {
		const log = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			element.showPopover();
			const entries: string[] = [];
			element.addEventListener('beforetoggle', () => {
				entries.push('beforetoggle');
			});
			entries.push('before-hide');
			element.hidePopover();
			entries.push('after-hide');
			element.remove();
			return entries;
		});

		expect(log).toEqual(['before-hide', 'beforetoggle', 'after-hide']);
	});

	test('popover beforetoggle: should report closed→open on show', async ({ page }) => {
		const captured = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			let result: { oldState: string; newState: string } | null = null;
			element.addEventListener('beforetoggle', ((event: ToggleEvent) => {
				result = { oldState: event.oldState, newState: event.newState };
			}) as EventListener);
			element.showPopover();
			element.remove();
			return result;
		});

		expect(captured).toEqual({ oldState: 'closed', newState: 'open' });
	});

	test('popover beforetoggle: should report open→closed on hide', async ({ page }) => {
		const captured = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			element.showPopover();
			let result: { oldState: string; newState: string } | null = null;
			element.addEventListener('beforetoggle', ((event: ToggleEvent) => {
				result = { oldState: event.oldState, newState: event.newState };
			}) as EventListener);
			element.hidePopover();
			element.remove();
			return result;
		});

		expect(captured).toEqual({ oldState: 'open', newState: 'closed' });
	});

	test('popover beforetoggle: should be cancelable on show (auto popover)', async ({ page }) => {
		const cancelable = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'auto');
			document.body.appendChild(element);
			let result: boolean | null = null;
			element.addEventListener('beforetoggle', ((event: ToggleEvent) => {
				result = event.cancelable;
			}) as EventListener);
			element.showPopover();
			element.remove();
			return result;
		});

		expect(cancelable).toBe(true);
	});

	test('popover beforetoggle: should not be cancelable on hide', async ({ page }) => {
		const cancelable = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			element.showPopover();
			let result: boolean | null = null;
			element.addEventListener('beforetoggle', ((event: ToggleEvent) => {
				result = event.cancelable;
			}) as EventListener);
			element.hidePopover();
			element.remove();
			return result;
		});

		expect(cancelable).toBe(false);
	});

	test('popover beforetoggle: should not bubble', async ({ page }) => {
		const bubbles = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			let result: boolean | null = null;
			element.addEventListener('beforetoggle', ((event: ToggleEvent) => {
				result = event.bubbles;
			}) as EventListener);
			element.showPopover();
			element.remove();
			return result;
		});

		expect(bubbles).toBe(false);
	});

	test('popover beforetoggle: should prevent showing when cancelled via preventDefault (auto popover)', async ({
		page,
	}) => {
		const isVisible = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'auto');
			document.body.appendChild(element);
			element.addEventListener('beforetoggle', ((event: ToggleEvent) => {
				event.preventDefault();
			}) as EventListener);
			element.showPopover();
			const visible = element.matches(':popover-open');
			element.remove();
			return visible;
		});

		expect(isVisible).toBe(false);
	});

	// ─── popover toggle event ─────────────────────────────────────────────

	test('popover toggle: should fire as a task, after microtasks drain', async ({ page }) => {
		const log = await page.evaluate(() => {
			return new Promise<string[]>((resolve) => {
				const element = document.createElement('div');
				element.setAttribute('popover', 'manual');
				document.body.appendChild(element);
				const entries: string[] = [];
				element.addEventListener('toggle', () => {
					entries.push('toggle');
					element.remove();
					resolve(entries);
				});
				element.showPopover();
				entries.push('sync');
				Promise.resolve().then(() => {
					entries.push('microtask');
				});
			});
		});

		expect(log).toEqual(['sync', 'microtask', 'toggle']);
	});

	test('popover toggle: should report closed→open on show', async ({ page }) => {
		const captured = await page.evaluate(() => {
			return new Promise<{ oldState: string; newState: string }>((resolve) => {
				const element = document.createElement('div');
				element.setAttribute('popover', 'manual');
				document.body.appendChild(element);
				element.addEventListener('toggle', ((event: ToggleEvent) => {
					element.remove();
					resolve({ oldState: event.oldState, newState: event.newState });
				}) as EventListener);
				element.showPopover();
			});
		});

		expect(captured).toEqual({ oldState: 'closed', newState: 'open' });
	});

	test('popover toggle: should report open→closed on hide', async ({ page }) => {
		const captured = await page.evaluate(() => {
			return new Promise<{ oldState: string; newState: string }>((resolve) => {
				const element = document.createElement('div');
				element.setAttribute('popover', 'manual');
				document.body.appendChild(element);
				element.showPopover();
				// Wait for the show toggle event to fire first
				setTimeout(() => {
					element.addEventListener('toggle', ((event: ToggleEvent) => {
						element.remove();
						resolve({ oldState: event.oldState, newState: event.newState });
					}) as EventListener);
					element.hidePopover();
				}, 0);
			});
		});

		expect(captured).toEqual({ oldState: 'open', newState: 'closed' });
	});

	test('popover toggle: should not be cancelable', async ({ page }) => {
		const cancelable = await page.evaluate(() => {
			return new Promise<boolean>((resolve) => {
				const element = document.createElement('div');
				element.setAttribute('popover', 'manual');
				document.body.appendChild(element);
				element.addEventListener('toggle', ((event: ToggleEvent) => {
					element.remove();
					resolve(event.cancelable);
				}) as EventListener);
				element.showPopover();
			});
		});

		expect(cancelable).toBe(false);
	});

	test('popover toggle: should not bubble', async ({ page }) => {
		const bubbles = await page.evaluate(() => {
			return new Promise<boolean>((resolve) => {
				const element = document.createElement('div');
				element.setAttribute('popover', 'manual');
				document.body.appendChild(element);
				element.addEventListener('toggle', ((event: ToggleEvent) => {
					element.remove();
					resolve(event.bubbles);
				}) as EventListener);
				element.showPopover();
			});
		});

		expect(bubbles).toBe(false);
	});

	// ─── popover toggle event coalescing ──────────────────────────────────

	test('popover toggle coalescing: should coalesce show+hide into one toggle event', async ({
		page,
	}) => {
		const events = await page.evaluate(() => {
			return new Promise<string[]>((resolve) => {
				const element = document.createElement('div');
				element.setAttribute('popover', 'manual');
				document.body.appendChild(element);
				const entries: string[] = [];
				element.addEventListener('toggle', ((event: ToggleEvent) => {
					entries.push(`${event.oldState}->${event.newState}`);
				}) as EventListener);
				element.showPopover();
				element.hidePopover();
				// Wait for the coalesced toggle event to fire
				setTimeout(() => {
					element.remove();
					resolve(entries);
				}, 0);
			});
		});

		expect(events).toEqual(['closed->closed']);
	});

	test('popover toggle coalescing: should coalesce show+hide+show+hide into one toggle event', async ({
		page,
	}) => {
		const events = await page.evaluate(() => {
			return new Promise<string[]>((resolve) => {
				const element = document.createElement('div');
				element.setAttribute('popover', 'manual');
				document.body.appendChild(element);
				const entries: string[] = [];
				element.addEventListener('toggle', ((event: ToggleEvent) => {
					entries.push(`${event.oldState}->${event.newState}`);
				}) as EventListener);
				element.showPopover();
				element.hidePopover();
				element.showPopover();
				element.hidePopover();
				setTimeout(() => {
					element.remove();
					resolve(entries);
				}, 0);
			});
		});

		expect(events).toEqual(['closed->closed']);
	});

	test('popover toggle coalescing: should fire separate events when separated by a task boundary', async ({
		page,
	}) => {
		const events = await page.evaluate(() => {
			return new Promise<string[]>((resolve) => {
				const element = document.createElement('div');
				element.setAttribute('popover', 'manual');
				document.body.appendChild(element);
				const entries: string[] = [];
				element.addEventListener('toggle', ((event: ToggleEvent) => {
					entries.push(`${event.oldState}->${event.newState}`);
				}) as EventListener);
				element.showPopover();
				// Wait for the first toggle event, then hide
				setTimeout(() => {
					element.hidePopover();
					// Wait for the second toggle event
					setTimeout(() => {
						element.remove();
						resolve(entries);
					}, 0);
				}, 0);
			});
		});

		expect(events).toEqual(['closed->open', 'open->closed']);
	});

	// ─── togglePopover() ──────────────────────────────────────────────────

	test('togglePopover: should open a closed popover and return true', async ({ page }) => {
		const result = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			const returnValue = element.togglePopover();
			const isOpen = element.matches(':popover-open');
			element.remove();
			return { returnValue, isOpen };
		});

		expect(result).toEqual({ returnValue: true, isOpen: true });
	});

	test('togglePopover: should close an open popover and return false', async ({ page }) => {
		const result = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			element.showPopover();
			const returnValue = element.togglePopover();
			const isOpen = element.matches(':popover-open');
			element.remove();
			return { returnValue, isOpen };
		});

		expect(result).toEqual({ returnValue: false, isOpen: false });
	});

	test('togglePopover: should open when force=true and closed', async ({ page }) => {
		const result = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			const returnValue = element.togglePopover(true);
			const isOpen = element.matches(':popover-open');
			element.remove();
			return { returnValue, isOpen };
		});

		expect(result).toEqual({ returnValue: true, isOpen: true });
	});

	test('togglePopover: should be a no-op when force=true and already open', async ({ page }) => {
		const result = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			element.showPopover();
			const returnValue = element.togglePopover(true);
			const isOpen = element.matches(':popover-open');
			element.remove();
			return { returnValue, isOpen };
		});

		expect(result).toEqual({ returnValue: true, isOpen: true });
	});

	test('togglePopover: should close when force=false and open', async ({ page }) => {
		const result = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			element.showPopover();
			const returnValue = element.togglePopover(false);
			const isOpen = element.matches(':popover-open');
			element.remove();
			return { returnValue, isOpen };
		});

		expect(result).toEqual({ returnValue: false, isOpen: false });
	});

	test('togglePopover: should be a no-op when force=false and already closed', async ({ page }) => {
		const result = await page.evaluate(() => {
			const element = document.createElement('div');
			element.setAttribute('popover', 'manual');
			document.body.appendChild(element);
			const returnValue = element.togglePopover(false);
			const isOpen = element.matches(':popover-open');
			element.remove();
			return { returnValue, isOpen };
		});

		expect(result).toEqual({ returnValue: false, isOpen: false });
	});

	// ─── dialog.showModal() ───────────────────────────────────────────────

	test('dialog showModal: should throw when dialog is not connected', async ({ page }) => {
		const threw = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			try {
				dialog.showModal();
				return false;
			} catch (error) {
				return (error as DOMException).name === 'InvalidStateError';
			}
		});

		expect(threw).toBe(true);
	});

	test('dialog showModal: should throw when dialog is already open non-modally', async ({
		page,
	}) => {
		const threw = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			document.body.appendChild(dialog);
			dialog.show();
			try {
				dialog.showModal();
				return false;
			} catch (error) {
				return (error as DOMException).name === 'InvalidStateError';
			} finally {
				dialog.close();
				dialog.remove();
			}
		});

		expect(threw).toBe(true);
	});

	test('dialog showModal: should open the dialog', async ({ page }) => {
		const isOpen = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			document.body.appendChild(dialog);
			dialog.showModal();
			const hasOpen = dialog.hasAttribute('open');
			dialog.close();
			dialog.remove();
			return hasOpen;
		});

		expect(isOpen).toBe(true);
	});

	test('dialog showModal: should fire beforetoggle synchronously with closed→open', async ({
		page,
	}) => {
		const log = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			document.body.appendChild(dialog);
			const entries: string[] = [];
			dialog.addEventListener('beforetoggle', ((event: ToggleEvent) => {
				entries.push(`beforetoggle:${event.oldState}->${event.newState}`);
			}) as EventListener);
			entries.push('before');
			dialog.showModal();
			entries.push('after');
			// Snapshot before cleanup (dialog.close() would fire another beforetoggle)
			const result = [...entries];
			dialog.close();
			dialog.remove();
			return result;
		});

		expect(log).toEqual(['before', 'beforetoggle:closed->open', 'after']);
	});

	test('dialog showModal: should fire toggle as a task with closed→open', async ({ page }) => {
		const log = await page.evaluate(() => {
			return new Promise<string[]>((resolve) => {
				const dialog = document.createElement('dialog');
				document.body.appendChild(dialog);
				const entries: string[] = [];
				dialog.addEventListener('toggle', ((event: ToggleEvent) => {
					entries.push(`toggle:${event.oldState}->${event.newState}`);
					dialog.close();
					dialog.remove();
					resolve(entries);
				}) as EventListener);
				dialog.showModal();
				entries.push('sync');
				Promise.resolve().then(() => {
					entries.push('microtask');
				});
			});
		});

		expect(log).toEqual(['sync', 'microtask', 'toggle:closed->open']);
	});

	test('dialog showModal: should fire beforetoggle that is not cancelable', async ({ page }) => {
		const cancelable = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			document.body.appendChild(dialog);
			let result: boolean | null = null;
			dialog.addEventListener('beforetoggle', ((event: ToggleEvent) => {
				result = event.cancelable;
			}) as EventListener);
			dialog.showModal();
			dialog.close();
			dialog.remove();
			return result;
		});

		expect(cancelable).toBe(false);
	});

	// ─── dialog.show() ────────────────────────────────────────────────────

	test('dialog show: should fire beforetoggle synchronously with closed→open', async ({ page }) => {
		const log = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			document.body.appendChild(dialog);
			const entries: string[] = [];
			dialog.addEventListener('beforetoggle', ((event: ToggleEvent) => {
				entries.push(`beforetoggle:${event.oldState}->${event.newState}`);
			}) as EventListener);
			entries.push('before');
			dialog.show();
			entries.push('after');
			// Snapshot before cleanup (dialog.close() would fire another beforetoggle)
			const result = [...entries];
			dialog.close();
			dialog.remove();
			return result;
		});

		expect(log).toEqual(['before', 'beforetoggle:closed->open', 'after']);
	});

	test('dialog show: should fire toggle as a task with closed→open', async ({ page }) => {
		const captured = await page.evaluate(() => {
			return new Promise<{ oldState: string; newState: string }>((resolve) => {
				const dialog = document.createElement('dialog');
				document.body.appendChild(dialog);
				dialog.addEventListener('toggle', ((event: ToggleEvent) => {
					dialog.close();
					dialog.remove();
					resolve({ oldState: event.oldState, newState: event.newState });
				}) as EventListener);
				dialog.show();
			});
		});

		expect(captured).toEqual({ oldState: 'closed', newState: 'open' });
	});

	// ─── dialog.close() ───────────────────────────────────────────────────

	test('dialog close: should be a no-op when already closed', async ({ page }) => {
		const events = await page.evaluate(() => {
			return new Promise<string[]>((resolve) => {
				const dialog = document.createElement('dialog');
				document.body.appendChild(dialog);
				const entries: string[] = [];
				dialog.addEventListener('toggle', () => {
					entries.push('toggle');
				});
				dialog.addEventListener('close', () => {
					entries.push('close');
				});
				dialog.close();
				// Wait to confirm no events fire
				setTimeout(() => {
					dialog.remove();
					resolve(entries);
				}, 50);
			});
		});

		expect(events).toEqual([]);
	});

	test('dialog close: should fire toggle(open→closed) followed by close event', async ({
		page,
	}) => {
		const log = await page.evaluate(() => {
			return new Promise<string[]>((resolve) => {
				const dialog = document.createElement('dialog');
				document.body.appendChild(dialog);
				dialog.showModal();
				// Wait for the open toggle event to fire before adding close listeners
				let openToggleFired = false;
				dialog.addEventListener('toggle', () => {
					openToggleFired = true;
				});
				const waitForOpenToggle = () => {
					if (openToggleFired) {
						const entries: string[] = [];
						dialog.addEventListener('toggle', ((event: ToggleEvent) => {
							entries.push(`toggle:${event.oldState}->${event.newState}`);
						}) as EventListener);
						dialog.addEventListener('close', () => {
							entries.push('close');
							dialog.remove();
							resolve(entries);
						});
						dialog.close();
					} else {
						requestAnimationFrame(waitForOpenToggle);
					}
				};
				requestAnimationFrame(waitForOpenToggle);
			});
		});

		expect(log).toEqual(['toggle:open->closed', 'close']);
	});

	test('dialog close: should fire close event as a task, after sync code and microtasks', async ({
		page,
	}) => {
		const log = await page.evaluate(() => {
			return new Promise<string[]>((resolve) => {
				const dialog = document.createElement('dialog');
				document.body.appendChild(dialog);
				dialog.showModal();
				// Wait for the open toggle event first
				setTimeout(() => {
					const entries: string[] = [];
					dialog.addEventListener('close', () => {
						entries.push('close');
						dialog.remove();
						resolve(entries);
					});
					dialog.close();
					entries.push('sync');
					Promise.resolve().then(() => {
						entries.push('microtask');
					});
				}, 0);
			});
		});

		expect(log).toEqual(['sync', 'microtask', 'close']);
	});

	test('dialog close: should fire close event that does not bubble and is not cancelable', async ({
		page,
	}) => {
		const result = await page.evaluate(() => {
			return new Promise<{ bubbles: boolean; cancelable: boolean }>((resolve) => {
				const dialog = document.createElement('dialog');
				document.body.appendChild(dialog);
				dialog.showModal();
				// Wait for the open toggle event first
				setTimeout(() => {
					dialog.addEventListener('close', (event) => {
						dialog.remove();
						resolve({ bubbles: event.bubbles, cancelable: event.cancelable });
					});
					dialog.close();
				}, 0);
			});
		});

		expect(result).toEqual({ bubbles: false, cancelable: false });
	});

	test('dialog close: should fire beforetoggle synchronously with open→closed', async ({
		page,
	}) => {
		const log = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			document.body.appendChild(dialog);
			dialog.showModal();
			const entries: string[] = [];
			dialog.addEventListener('beforetoggle', ((event: ToggleEvent) => {
				entries.push(`beforetoggle:${event.oldState}->${event.newState}`);
			}) as EventListener);
			entries.push('before-close');
			dialog.close();
			entries.push('after-close');
			dialog.remove();
			return entries;
		});

		expect(log).toEqual(['before-close', 'beforetoggle:open->closed', 'after-close']);
	});

	test('dialog close: beforetoggle should not be cancelable', async ({ page }) => {
		const cancelable = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			document.body.appendChild(dialog);
			dialog.showModal();
			let result: boolean | null = null;
			dialog.addEventListener('beforetoggle', ((event: ToggleEvent) => {
				result = event.cancelable;
			}) as EventListener);
			dialog.close();
			dialog.remove();
			return result;
		});

		expect(cancelable).toBe(false);
	});

	// ─── dialog.returnValue ───────────────────────────────────────────────

	test('dialog returnValue: should default to empty string', async ({ page }) => {
		const value = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			document.body.appendChild(dialog);
			const result = dialog.returnValue;
			dialog.remove();
			return result;
		});

		expect(value).toBe('');
	});

	test('dialog returnValue: should be settable', async ({ page }) => {
		const value = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			document.body.appendChild(dialog);
			dialog.returnValue = 'test-value';
			const result = dialog.returnValue;
			dialog.remove();
			return result;
		});

		expect(value).toBe('test-value');
	});

	test('dialog returnValue: should be set by close(returnValue)', async ({ page }) => {
		const value = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			document.body.appendChild(dialog);
			dialog.showModal();
			dialog.close('from-close');
			const result = dialog.returnValue;
			dialog.remove();
			return result;
		});

		expect(value).toBe('from-close');
	});

	test('dialog returnValue: should not be changed by close() without argument', async ({
		page,
	}) => {
		const value = await page.evaluate(() => {
			const dialog = document.createElement('dialog');
			document.body.appendChild(dialog);
			dialog.returnValue = 'existing';
			dialog.showModal();
			dialog.close();
			const result = dialog.returnValue;
			dialog.remove();
			return result;
		});

		expect(value).toBe('existing');
	});
});
