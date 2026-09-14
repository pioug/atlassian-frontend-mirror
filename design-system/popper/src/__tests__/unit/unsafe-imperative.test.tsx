import type { Instance } from '@popperjs/core';
import { act } from '@atlassian/testing-library';

import { passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { createPopper } from '../../entry-points/unsafe-imperative';

/**
 * The FF-on adapter positions by rendering a React root internally and does not
 * force a synchronous flush, so each call is wrapped in `act()` to let React
 * commit before the assertions. See `create-popper-top-layer.test.tsx`.
 */
function create(...args: Parameters<typeof createPopper>): Instance {
	let instance!: Instance;
	act(() => {
		instance = createPopper(...args);
	});
	return instance;
}

function createAnchor(): HTMLButtonElement {
	const anchor = document.createElement('button');
	anchor.textContent = 'anchor';
	document.body.appendChild(anchor);
	return anchor;
}

function createSurface(): HTMLDivElement {
	const surface = document.createElement('div');
	surface.textContent = 'surface';
	document.body.appendChild(surface);
	return surface;
}

afterEach(() => {
	document.body.innerHTML = '';
});

// A positioning primitive has no accessible content of its own; the package's
// a11y coverage lives in `accessibility.test.tsx`.
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('createPopper (unsafe-imperative entry point)', () => {
	it('returns a top-layer backed instance when platform-dst-top-layer is on', () => {
		passGate('platform-dst-top-layer');
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, { placement: 'top' });

		// Only the top-layer path promotes the element into the top layer.
		expect(surface).toHaveAttribute('popover', 'manual');
		expect(instance.state.placement).toBe('top');

		act(() => instance.destroy());
	});

	it('returns the Popper.js engine when the gate is off', () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, { placement: 'top' });

		expect(surface).not.toHaveAttribute('popover');
		// The Popper.js engine owns positioning via `applyStyles`, so there are
		// no anchor-positioning properties on the element.
		expect(surface.style.getPropertyValue('position-anchor')).toBe('');
		expect(instance.state.orderedModifiers.length).toBeGreaterThan(0);

		act(() => instance.destroy());
	});
});
