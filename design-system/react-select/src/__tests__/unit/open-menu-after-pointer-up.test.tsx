/* eslint-disable testing-library/no-node-access */
// @ts-nocheck
import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';
import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Select from '../../select';

/**
 * Coverage for `Select.openMenuAfterPointerUp`: the top-layer deferral that
 * opens the menu on `pointerup` instead of synchronously inside `mousedown`,
 * to avoid popover light-dismiss. Pins two regression-prone behaviours:
 *
 * 1. The `pointerup` listener is cancelled on unmount (no leaked listeners).
 * 2. Two rapid `mousedown` gestures do not stack listeners.
 *
 * Flag-OFF synchronous-open is covered indirectly by `select.test.tsx`.
 */

const options = [
	{ label: 'one', value: '1' },
	{ label: 'two', value: '2' },
];

const TEST_ID = 'react-select';

function renderSelect(extraProps: Record<string, unknown> = {}) {
	return render(
		<Select
			testId={TEST_ID}
			options={options}
			onInputChange={__noop}
			onMenuOpen={__noop}
			onMenuClose={__noop}
			aria-label="choose option"
			{...extraProps}
		/>,
	);
}

function getControl(): HTMLElement {
	// `react-select` does not expose a stable `data-testid` for the
	// control wrapper, so fall back to a structural query.
	const control = document.querySelector('[class*="control"]');
	if (control === null) {
		throw new Error('expected to find the Select control element');
	}
	return control as HTMLElement;
}

/**
 * Wraps `document.addEventListener` / `removeEventListener` to count
 * `pointerup` add and remove calls. Used to assert that the deferred
 * open registers exactly one listener and cleans it up correctly.
 */
function createPointerUpListenerSpy() {
	const originalAdd = document.addEventListener;
	const originalRemove = document.removeEventListener;
	const totals = { added: 0, removed: 0 };
	document.addEventListener = function trackedAdd(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions,
	) {
		if (type === 'pointerup') {
			totals.added += 1;
		}
		return originalAdd.call(this, type, listener, options);
	};
	document.removeEventListener = function trackedRemove(
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | EventListenerOptions,
	) {
		if (type === 'pointerup') {
			totals.removed += 1;
		}
		return originalRemove.call(this, type, listener, options);
	};
	return {
		counts(): { added: number; removed: number } {
			return { added: totals.added, removed: totals.removed };
		},
		restore() {
			document.addEventListener = originalAdd;
			document.removeEventListener = originalRemove;
		},
	};
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('openMenuAfterPointerUp - deferral plumbing (flag ON)', () => {
	// Install the listener spy via `beforeEach` and restore it via
	// `afterEach` so the prototype patch is reverted even when `renderSelect`
	// or `getControl` throw before any test body code runs. Restoring inline
	// in a `try/finally` cannot protect against setup-time throws.
	let spy: ReturnType<typeof createPointerUpListenerSpy>;

	beforeEach(() => {
		passGate('platform-dst-top-layer');
		spy = createPointerUpListenerSpy();
	});

	afterEach(() => {
		spy.restore();
	});

	it('cancels the pending `pointerup` listener when Select unmounts before pointerup fires', () => {
		const { unmount } = renderSelect();
		const control = getControl();

		// `mousedown` on the control queues the deferred open via a
		// `document` `pointerup` listener. We do NOT fire `pointerup`
		// so the listener is still pending.
		fireEvent.mouseDown(control, { button: 0 });

		const beforeUnmount = spy.counts();
		expect(beforeUnmount.added).toBeGreaterThanOrEqual(1);
		expect(beforeUnmount.removed).toBe(beforeUnmount.added - 1);

		unmount();

		const afterUnmount = spy.counts();
		expect(afterUnmount.removed).toBe(afterUnmount.added);
	});

	it('does not stack listeners across two rapid `mousedown` gestures', () => {
		renderSelect();
		const control = getControl();

		fireEvent.mouseDown(control, { button: 0 });
		const afterFirst = spy.counts();
		const netAfterFirst = afterFirst.added - afterFirst.removed;

		// A second mousedown before pointerup must replace the first
		// pending open, not queue an additional listener.
		fireEvent.mouseDown(control, { button: 0 });
		const afterSecond = spy.counts();
		const netAfterSecond = afterSecond.added - afterSecond.removed;

		expect(netAfterFirst).toBe(1);
		expect(netAfterSecond).toBe(1);
	});

	it('queues a `pointerup` listener that runs once and then self-removes', () => {
		renderSelect();
		const control = getControl();

		fireEvent.mouseDown(control, { button: 0 });
		const beforePointerUp = spy.counts();
		expect(beforePointerUp.added - beforePointerUp.removed).toBe(1);

		// `pointerup` runs the deferred open callback. Because the
		// listener is registered `{ once: true }`, the browser
		// removes it implicitly; `removeEventListener` is NOT
		// re-called, so `removed` does not increment.
		document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));

		// A second `pointerup` should NOT trigger anything (listener
		// already consumed). Counts stay where they are.
		document.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));
		const afterPointerUp = spy.counts();
		expect(afterPointerUp.added).toBe(beforePointerUp.added);
	});
});
