/* eslint-disable testing-library/no-node-access */
// @ts-nocheck
import React from 'react';

import { act, createEvent, fireEvent, render, screen } from '@testing-library/react';

import __noop from '@atlaskit/ds-lib/noop';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import Select from '../../select';
import StateManagedSelect from '../../state-manager';

/**
 * Unit-test coverage for the `MenuPortal` flag-routing wrapper.
 *
 * Detailed top-layer DOM contract (`:popover-open`, light-dismiss, stacking,
 * ARIA wiring) is covered by the Playwright suite under
 * `__tests__/playwright/`. These unit tests cover:
 *
 * 1. Flag OFF + no `menuPortalTarget` + `position="absolute"` renders inline.
 * 2. The flag-on branch is exercised at module load (any crash surfaces here).
 *
 * Note: `MenuPortal` reads `controlRef` at render time, so the menu wrapper
 * does not appear on the very first render in jsdom (the ref callback fires
 * post-commit). This affects the legacy path too; the browser suite covers
 * those rows.
 */

const options = [
	{ label: 'one', value: '1' },
	{ label: 'two', value: '2' },
];

const TEST_ID = 'react-select';

function isInTopLayerPopover(node: HTMLElement | null): boolean {
	return Boolean(node?.closest('[popover]'));
}

function renderSelect(extraProps: Record<string, unknown> = {}) {
	return render(
		<Select testId={TEST_ID} options={options} onInputChange={__noop} {...extraProps} />,
	);
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('MenuPortal - inline render path (flag OFF only)', () => {
	it('flag OFF, no portal target, position absolute - inline menu (no popover)', () => {
		failGate('platform-dst-top-layer');
		renderSelect({ menuIsOpen: true });
		const list = screen.getByTestId(`${TEST_ID}-select--listbox-container`);
		expect(isInTopLayerPopover(list)).toBe(false);
	});

	it('flag OFF, no portal target, menu closed - no popover element exists', () => {
		failGate('platform-dst-top-layer');
		renderSelect({ menuIsOpen: false });
		expect(document.querySelector('[popover]')).toBeNull();
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('MenuPortal - flag-routing wrapper module-level smoke', () => {
	it('flag ON: Select renders without crashing (menu closed)', () => {
		passGate('platform-dst-top-layer');
		expect(() => renderSelect({ menuIsOpen: false })).not.toThrow();
	});
});

/**
 * Close-propagation contract: when the popover is closed programmatically
 * (e.g. the open-layer observer dismissing it because a Modal opened),
 * `handlePopoverClose` must propagate `onMenuClose` so `Select.menuIsOpen`
 * stays in sync. Native outside-click / Escape dismissal uses the same bridge
 * so React state updates only after the auto popover has closed.
 */
function getOnlyPopover(): HTMLElement {
	const elements = document.querySelectorAll('[popover]');
	if (elements.length !== 1) {
		throw new Error(`expected exactly one popover element, found ${elements.length}`);
	}
	return elements[0] as HTMLElement;
}

/**
 * The polyfill coalesces popover toggle events via `setTimeout` (so they
 * fire as a task, matching browser timing). Flush the timer and the
 * follow-up microtask so the assertion sees the post-dismiss state.
 */
async function flushPopoverScheduling(): Promise<void> {
	await act(async () => {
		jest.runAllTimers();
		await Promise.resolve();
	});
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('MenuPortalTopLayer - close propagation (flag ON)', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('propagates onMenuClose when the popover is closed programmatically', async () => {
		const onMenuClose = jest.fn();
		renderSelect({ menuIsOpen: true, onMenuClose, 'aria-label': 'choose option' });
		const popover = getOnlyPopover();
		expect(popover.matches(':popover-open')).toBe(true);

		popover.hidePopover();

		await flushPopoverScheduling();

		expect(popover.matches(':popover-open')).toBe(false);
		expect(onMenuClose).toHaveBeenCalledTimes(1);
	});

	it('leaves Escape to the native popover and updates menu state after native dismissal', async () => {
		const callbackOrder: string[] = [];
		const onKeyDown = jest.fn();
		const onInputChange = jest.fn(() => callbackOrder.push('onInputChange'));
		const onMenuClose = jest.fn(() => callbackOrder.push('onMenuClose'));
		render(
			<div role="presentation" onKeyDown={onKeyDown}>
				<StateManagedSelect
					testId={TEST_ID}
					options={options}
					defaultMenuIsOpen
					onInputChange={onInputChange}
					onMenuClose={onMenuClose}
					shouldPreventEscapePropagation
				/>
			</div>,
		);

		const popover = getOnlyPopover();
		const input = screen.getByTestId(`${TEST_ID}-select--input`);
		const escapeEvent = createEvent.keyDown(input, {
			key: 'Escape',
			bubbles: true,
			cancelable: true,
		});

		fireEvent(input, escapeEvent);

		expect(escapeEvent.defaultPrevented).toBe(false);
		expect(onKeyDown).toHaveBeenCalledTimes(1);
		expect(onInputChange).not.toHaveBeenCalled();
		expect(onMenuClose).not.toHaveBeenCalled();
		expect(callbackOrder).toEqual([]);
		expect(popover.matches(':popover-open')).toBe(false);
		expect(screen.getByTestId(`${TEST_ID}-select--listbox-container`)).toBeInTheDocument();

		await flushPopoverScheduling();

		expect(onInputChange).toHaveBeenCalledTimes(1);
		expect(onInputChange).toHaveBeenCalledWith('', {
			action: 'menu-close',
			prevInputValue: '',
		});
		expect(onMenuClose).toHaveBeenCalledTimes(1);
		expect(callbackOrder).toEqual(['onInputChange', 'onMenuClose']);
		expect(screen.queryByTestId(`${TEST_ID}-select--listbox-container`)).not.toBeInTheDocument();
	});

	it('restores a hidden input when Escape closes a controlled top-layer menu', () => {
		const select = (menuIsOpen: boolean) => (
			<Select
				testId={TEST_ID}
				options={options}
				value={[options[0]]}
				isMulti
				menuIsOpen={menuIsOpen}
				onInputChange={__noop}
				onMenuClose={__noop}
			/>
		);
		const { rerender } = render(select(false));
		const input = screen.getByTestId(`${TEST_ID}-select--input`);

		fireEvent.keyDown(input, { key: 'ArrowLeft' });
		expect(input).toHaveStyle({ opacity: '0' });

		rerender(select(true));
		fireEvent.keyDown(input, { key: 'Escape' });
		rerender(select(false));

		expect(input).not.toHaveStyle({ opacity: '0' });
	});

	it('does not cancel or stop Escape when the top-layer menu is closed', () => {
		const onKeyDown = jest.fn();
		render(
			<div role="presentation" onKeyDown={onKeyDown}>
				<StateManagedSelect testId={TEST_ID} options={options} />
			</div>,
		);
		const input = screen.getByTestId(`${TEST_ID}-select--input`);
		const escapeEvent = createEvent.keyDown(input, {
			key: 'Escape',
			bubbles: true,
			cancelable: true,
		});

		fireEvent(input, escapeEvent);

		expect(escapeEvent.defaultPrevented).toBe(false);
		expect(onKeyDown).toHaveBeenCalledTimes(1);
	});
});

/**
 * Contract for `MenuPortalCloseContext`: default value is `undefined` and
 * consumers must guard with `if (closeSelect)`. Together this lets
 * `MenuPortalTopLayer` render outside the provider chain without crashing.
 * Pin the default here so a future change cannot silently break that guard.
 */
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('MenuPortalCloseContext - default value', () => {
	it('default value is `undefined` (consumer is responsible for guarding)', () => {
		// Importing inline so the context module is only loaded for this test.
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const { MenuPortalCloseContext } = require('../../internal/menu-portal-close-context');
		const captured: { value: unknown } = { value: 'unset' };
		function Probe() {
			captured.value = React.useContext(MenuPortalCloseContext);
			return null;
		}
		render(<Probe />);
		expect(captured.value).toBeUndefined();
	});
});
