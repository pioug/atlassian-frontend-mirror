/**
 * Opening a dialog, hiding a popover and removing a popover close other popovers as Chrome 155
 * does. Each expectation here was first observed in Chrome with the same markup.
 *
 * Spec references:
 * - Dialog show steps (hide popovers until): https://html.spec.whatwg.org/multipage/interactive-elements.html#show-a-modal-dialog
 * - Hide popover algorithm (hide popover stack until): https://html.spec.whatwg.org/multipage/popover.html#hide-popover-algorithm
 * - Popover removing steps: https://html.spec.whatwg.org/multipage/popover.html#the-popover-attribute:html-element-removing-steps
 */
import { bindAll } from 'bind-event-listener';

import { screen } from '@atlassian/testing-library/screen';

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

function getOpenPopovers(): string[] {
	return screen
		.queryAllByTestId(/./)
		.filter((element) => element.matches(':popover-open'))
		.map((element) => element.dataset.testid ?? '');
}

/**
 * Records `beforetoggle` and `toggle` events on every element with a `data-testid`, as
 * `type:id:newState`.
 */
function recordToggleEvents() {
	const events: string[] = [];
	const unbinds = screen.queryAllByTestId(/./).map((element) =>
		bindAll(
			element,
			['beforetoggle', 'toggle'].map((type) => ({
				type,
				listener: (event: Event) => {
					const { newState } = event as Event & { newState?: string };
					events.push(`${type}:${element.dataset.testid ?? ''}:${String(newState)}`);
				},
			})),
		),
	);
	return {
		events,
		unbind: () => unbinds.forEach((unbind) => unbind()),
	};
}

// The hooks are in a describe block, so that they run before the automatic accessibility check.
describe('polyfill popover stacks', () => {
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

	describe('opening a dialog hides the popovers it is not in', () => {
		it('hides open auto and hint popovers on showModal(), hints first, and keeps manual ones', () => {
			mount({
				html: '<div popover="auto" data-testid="auto"><button data-testid="in-auto">In auto</button></div><div popover="hint" data-testid="hint"></div><div popover="manual" data-testid="manual"></div><dialog data-testid="dialog"><button data-testid="in-dialog">In dialog</button></dialog>',
			});
			getElement({ id: 'auto' }).showPopover();
			getElement({ id: 'in-auto' }).focus();
			getElement({ id: 'hint' }).showPopover();
			getElement({ id: 'manual' }).showPopover();
			jest.runAllTimers();
			const { events, unbind } = recordToggleEvents();

			getDialog({ id: 'dialog' }).showModal();

			expect(getOpenPopovers()).toEqual(['manual']);
			expect(events).toEqual([
				'beforetoggle:dialog:open',
				'beforetoggle:hint:closed',
				'beforetoggle:auto:closed',
			]);
			expect(getElement({ id: 'in-dialog' })).toHaveFocus();
			jest.runAllTimers();
			expect(events.slice(3)).toEqual([
				'toggle:dialog:open',
				'toggle:hint:closed',
				'toggle:auto:closed',
			]);
			unbind();
		});

		it('hides open auto popovers on show()', () => {
			mount({
				html: '<div popover="auto" data-testid="auto"></div><dialog data-testid="dialog"></dialog>',
			});
			getElement({ id: 'auto' }).showPopover();

			getDialog({ id: 'dialog' }).show();

			expect(getOpenPopovers()).toEqual([]);
		});

		it('keeps the popover that the dialog is in, and its ancestors', () => {
			mount({
				html: '<div popover="auto" data-testid="parent"><div popover="auto" data-testid="child"><dialog data-testid="dialog"></dialog></div><div popover="auto" data-testid="other"></div></div>',
			});
			getElement({ id: 'parent' }).showPopover();
			getElement({ id: 'child' }).showPopover();

			getDialog({ id: 'dialog' }).show();

			expect(getOpenPopovers()).toEqual(['parent', 'child']);
		});

		it('hides a sibling auto popover and hints when the dialog is in an auto popover', () => {
			mount({
				html: '<div popover="auto" data-testid="auto"><dialog data-testid="dialog"></dialog></div><div popover="hint" data-testid="hint"></div>',
			});
			getElement({ id: 'auto' }).showPopover();
			getElement({ id: 'hint' }).showPopover();

			getDialog({ id: 'dialog' }).showModal();

			expect(getOpenPopovers()).toEqual(['auto']);
		});
	});

	describe('hiding a popover hides its child popovers first', () => {
		it('hides a nested child first, and returns focus from it', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="auto" data-testid="parent"><div popover="auto" data-testid="child"><button data-testid="in-child">In child</button></div></div>',
			});
			getElement({ id: 'trigger' }).focus();
			getElement({ id: 'parent' }).showPopover();
			getElement({ id: 'child' }).showPopover();
			getElement({ id: 'in-child' }).focus();
			jest.runAllTimers();
			const { events, unbind } = recordToggleEvents();

			getElement({ id: 'parent' }).hidePopover();

			expect(getOpenPopovers()).toEqual([]);
			expect(events).toEqual(['beforetoggle:child:closed', 'beforetoggle:parent:closed']);
			expect(getElement({ id: 'trigger' })).toHaveFocus();
			unbind();
		});

		it('hides a child opened from an invoker in the parent, without returning focus from it', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="auto" data-testid="parent"><button popovertarget="child-popover">Open child</button></div><div popover="auto" id="child-popover" data-testid="child"><button data-testid="in-child">In child</button></div>',
			});
			getElement({ id: 'trigger' }).focus();
			getElement({ id: 'parent' }).showPopover();
			getElement({ id: 'child' }).showPopover();
			expect(getOpenPopovers()).toEqual(['parent', 'child']);
			getElement({ id: 'in-child' }).focus();

			getElement({ id: 'parent' }).hidePopover();

			expect(getOpenPopovers()).toEqual([]);
			// Focus is in the child, which is not in the parent, so it does not return.
			expect(getElement({ id: 'in-child' })).toHaveFocus();
		});

		it('hides only the popovers above a popover in the middle of the stack', () => {
			mount({
				html: '<div popover="auto" data-testid="first"><div popover="auto" data-testid="second"><div popover="auto" data-testid="third"></div></div></div>',
			});
			['first', 'second', 'third'].forEach((id) => getElement({ id }).showPopover());
			const { events, unbind } = recordToggleEvents();

			getElement({ id: 'second' }).hidePopover();

			expect(getOpenPopovers()).toEqual(['first']);
			expect(events).toEqual(['beforetoggle:third:closed', 'beforetoggle:second:closed']);
			unbind();
		});

		it('hides a hint whose parent is the auto popover being hidden', () => {
			mount({
				html: '<div popover="auto" data-testid="auto"><div popover="hint" data-testid="hint"></div></div>',
			});
			getElement({ id: 'auto' }).showPopover();
			getElement({ id: 'hint' }).showPopover();
			expect(getOpenPopovers()).toEqual(['auto', 'hint']);

			getElement({ id: 'auto' }).hidePopover();

			expect(getOpenPopovers()).toEqual([]);
		});

		it('keeps a hint that is not a child of the auto popover being hidden', () => {
			mount({
				html: '<div popover="auto" data-testid="auto"></div><div popover="hint" data-testid="hint"></div>',
			});
			getElement({ id: 'auto' }).showPopover();
			getElement({ id: 'hint' }).showPopover();

			getElement({ id: 'auto' }).hidePopover();

			expect(getOpenPopovers()).toEqual(['hint']);
		});

		it('keeps an auto popover inside a manual popover that hides', () => {
			mount({
				html: '<div popover="manual" data-testid="manual"><div popover="auto" data-testid="auto"></div></div>',
			});
			getElement({ id: 'manual' }).showPopover();
			getElement({ id: 'auto' }).showPopover();

			getElement({ id: 'manual' }).hidePopover();

			expect(getOpenPopovers()).toEqual(['auto']);
		});
	});

	describe('removing an open popover hides it', () => {
		it('hides it at once, with no closing events and no focus return', () => {
			mount({
				html: '<button data-testid="trigger">Trigger</button><div popover="auto" data-testid="popover"><button data-testid="inside">Inside</button></div>',
			});
			const popover = getElement({ id: 'popover' });
			getElement({ id: 'trigger' }).focus();
			popover.showPopover();
			getElement({ id: 'inside' }).focus();
			jest.runAllTimers();
			const { events, unbind } = recordToggleEvents();

			popover.remove();

			expect(popover.matches(':popover-open')).toBe(false);
			expect(document.body).toHaveFocus();
			jest.runAllTimers();
			expect(events).toEqual([]);
			containers[0]?.appendChild(popover);
			expect(popover.matches(':popover-open')).toBe(false);
			unbind();
		});

		it('hides a popover whose ancestor is removed', () => {
			mount({
				html: '<div data-testid="wrapper"><div popover="manual" data-testid="popover"></div></div>',
			});
			const popover = getElement({ id: 'popover' });
			popover.showPopover();

			getElement({ id: 'wrapper' }).remove();

			expect(popover.matches(':popover-open')).toBe(false);
		});

		it('hides the child popovers of a removed popover, and keeps the parent of a removed child', () => {
			mount({
				html: '<div popover="auto" data-testid="parent"><div popover="auto" data-testid="child"><div popover="auto" data-testid="grandchild"></div></div></div>',
			});
			['parent', 'child', 'grandchild'].forEach((id) => getElement({ id }).showPopover());
			const grandchild = getElement({ id: 'grandchild' });
			const child = getElement({ id: 'child' });

			child.remove();

			expect(getOpenPopovers()).toEqual(['parent']);
			expect(child.matches(':popover-open')).toBe(false);
			expect(grandchild.matches(':popover-open')).toBe(false);
		});

		it('hides an open popover that is moved', () => {
			mount({
				html: '<div popover="auto" data-testid="popover"></div><div data-testid="other"></div>',
			});
			const popover = getElement({ id: 'popover' });
			popover.showPopover();

			getElement({ id: 'other' }).appendChild(popover);

			expect(popover.matches(':popover-open')).toBe(false);
		});
	});
});
