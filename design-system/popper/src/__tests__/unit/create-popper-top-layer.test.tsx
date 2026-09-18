import React, { useLayoutEffect, useRef, useState } from 'react';

import type { Instance, VirtualElement } from '@popperjs/core';

import { act, render, screen, userEvent } from '@atlassian/testing-library';

import { createPopperTopLayer } from '../../create-popper-top-layer';

/**
 * jsdom does not implement `CSS.supports`, so `@atlaskit/top-layer`'s support
 * probe reports "no CSS Anchor Positioning" and every call would take the JS
 * fallback. Stub it so this suite exercises the CSS path that modern browsers
 * take. The probe is `once()`-cached at module scope, so the stub has to be in
 * place before the first `createPopperTopLayer` call in this file.
 *
 * The JS fallback is deliberately not asserted here: the adapter contains no
 * positioning logic of its own, and the fallback only measures once a real
 * `ResizeObserver` fires, which jsdom never delivers. It is covered by
 * `@atlaskit/top-layer`'s own tests and by this package's Playwright specs.
 */
beforeAll(() => {
	(CSS as unknown as { supports: () => boolean }).supports = () => true;
});

/**
 * The adapter positions by rendering a React root internally, and it does not
 * force a synchronous flush (see `create-popper-top-layer.tsx`). These helpers
 * wrap each call in `act()` so React has committed — and the positioning hooks'
 * layout effects have run — before the assertions.
 */
function create(...args: Parameters<typeof createPopperTopLayer>): Instance {
	let instance!: Instance;
	act(() => {
		instance = createPopperTopLayer(...args);
	});
	return instance;
}

function committed(change: () => void): void {
	act(() => {
		change();
	});
}

/**
 * `destroy()` defers its teardown to a microtask so it never unmounts a React
 * root from inside a caller's commit phase (see `create-popper-top-layer.tsx`),
 * so assertions on the teardown have to await it.
 */
async function destroyed(instance: Instance): Promise<void> {
	await act(async () => {
		instance.destroy();
	});
}

function createAnchor(): HTMLButtonElement {
	const anchor = document.createElement('button');
	anchor.textContent = 'anchor';
	document.body.appendChild(anchor);
	return anchor;
}

function createSurface({ popover }: { popover?: string } = {}): HTMLDivElement {
	const surface = document.createElement('div');
	surface.textContent = 'surface';
	if (popover !== undefined) {
		surface.setAttribute('popover', popover);
	}
	document.body.appendChild(surface);
	return surface;
}

function createVirtualElement(rect: {
	top: number;
	left: number;
	width: number;
	height: number;
}): VirtualElement {
	return {
		getBoundingClientRect: () =>
			({
				...rect,
				right: rect.left + rect.width,
				bottom: rect.top + rect.height,
				x: rect.left,
				y: rect.top,
			}) as DOMRect,
	};
}

/**
 * The hidden stand-in top-layer creates when the reference is not an
 * `HTMLElement`. It is the only `aria-hidden` div appended directly to `<body>`.
 */
function getSyntheticAnchor(): HTMLElement | null {
	return document.body.querySelector<HTMLElement>(':scope > div[aria-hidden="true"]');
}

/**
 * The zero-specificity reset sheet the adapter injects when it promotes an
 * element into the top layer, to neutralise the UA `[popover]` rules.
 */
function getPromotedResetSheet(): HTMLStyleElement | null {
	return document.head.querySelector<HTMLStyleElement>('style[data-ds--popper-promoted]');
}

afterEach(() => {
	document.body.innerHTML = '';
});

// A positioning primitive has no accessible content of its own; the package's
// a11y coverage lives in `accessibility.test.tsx`.
// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('createPopperTopLayer - top layer promotion', () => {
	it('lifts a plain element into the top layer as a manual popover', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface);

		expect(surface).toHaveAttribute('popover', 'manual');
		expect(surface).toBeVisible();

		await destroyed(instance);
	});

	it('leaves an element that is already a popover under caller control', async () => {
		const anchor = createAnchor();
		// Matches editor's `VanillaTooltip`, which owns `popover="hint"` and
		// drives `showPopover()` / `hidePopover()` itself.
		const surface = createSurface({ popover: 'hint' });
		surface.showPopover();

		const instance = create(anchor, surface);

		expect(surface).toHaveAttribute('popover', 'hint');

		await destroyed(instance);

		// `destroy()` must not strip the caller's own popover attribute.
		expect(surface).toHaveAttribute('popover', 'hint');
	});

	it('does not inline position on an element that is already a popover', async () => {
		const anchor = createAnchor();
		const surface = createSurface({ popover: 'manual' });
		surface.showPopover();

		const instance = create(anchor, surface);

		// The UA stylesheet already makes a popover `position: fixed`.
		expect(surface.style.getPropertyValue('position')).toBe('');

		await destroyed(instance);
	});

	it('leaves the element in normal flow when the browser has no Popover API', async () => {
		const anchor = createAnchor();
		const surface = createSurface();
		const showPopover = HTMLElement.prototype.showPopover;
		// @ts-expect-error -- simulating a browser without the Popover API
		delete HTMLElement.prototype.showPopover;

		try {
			// No promotion, and nothing is forced out of flow. Such a browser gets
			// nothing from `@atlaskit/top-layer` at all (the whole stack is built on
			// the Popover API), so this is not a gap specific to the adapter — and
			// leaving the element in flow keeps its content readable in place.
			const instance = create(anchor, surface);

			expect(surface).not.toHaveAttribute('popover');
			expect(surface.style.getPropertyValue('position')).toBe('');

			await destroyed(instance);
		} finally {
			// Restore in `finally`: a failing assertion above must not leak a
			// missing `showPopover` into every later test in this file.
			HTMLElement.prototype.showPopover = showPopover;
		}
	});

	it('reverses promotion on destroy', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface);
		await destroyed(instance);

		expect(surface).not.toHaveAttribute('popover');
		expect(surface.style.getPropertyValue('position-anchor')).toBe('');
	});

	it('is a no-op when destroy is called more than once', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface);
		await destroyed(instance);

		expect(() => instance.destroy()).not.toThrow();
	});

	it('neutralises the UA popover stylesheet for an element it promoted', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface);

		// The UA sheet gives every popover a border, padding, `overflow: auto`,
		// `fit-content` sizing and canvas colours. The reset is a zero-specificity
		// `:where()` rule so it beats the UA origin without beating the caller's
		// own stylesheet — which an inline style would.
		expect(surface).toHaveAttribute('data-ds--popper-promoted');
		const reset = getPromotedResetSheet();
		expect(reset?.textContent).toContain(':where([data-ds--popper-promoted])');
		expect(reset?.textContent).toContain('border-style:none');

		await destroyed(instance);

		expect(surface).not.toHaveAttribute('data-ds--popper-promoted');
	});

	it('does not neutralise anything on an element the caller already owns', async () => {
		const anchor = createAnchor();
		const surface = createSurface({ popover: 'hint' });
		surface.showPopover();

		const instance = create(anchor, surface);

		// No promotion happened, so the UA rules the caller already lives with are
		// left exactly as they are.
		expect(surface).not.toHaveAttribute('data-ds--popper-promoted');

		await destroyed(instance);
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('createPopperTopLayer - React lifecycle safety', () => {
	it('does not warn when destroy runs from a React effect cleanup', async () => {
		// The regression this guards: `root.unmount()` is synchronous, and React
		// logs "Attempted to synchronously unmount a root while React was already
		// rendering" when it is called during a commit. Effect cleanups run in the
		// commit phase, and destroying from one is the ordinary React caller
		// shape — `examples/12-flag-imperative-create-popper.tsx` does it.
		const errors: unknown[][] = [];
		const spy = jest.spyOn(console, 'error').mockImplementation((...args) => {
			errors.push(args);
		});

		function Fixture() {
			const anchorRef = useRef<HTMLButtonElement | null>(null);
			const popperRef = useRef<HTMLDivElement | null>(null);
			const [isDestroyed, setIsDestroyed] = useState(false);

			useLayoutEffect(() => {
				const anchor = anchorRef.current;
				const popper = popperRef.current;
				if (!anchor || !popper || isDestroyed) {
					return;
				}
				const instance = createPopperTopLayer(anchor, popper, { placement: 'right' });
				return () => instance.destroy();
			}, [isDestroyed]);

			return (
				<div>
					<button type="button" ref={anchorRef}>
						trigger
					</button>
					<div ref={popperRef}>surface</div>
					<button type="button" onClick={() => setIsDestroyed(true)}>
						destroy
					</button>
				</div>
			);
		}

		render(<Fixture />);
		await userEvent.click(screen.getByText('destroy'));
		// Let the deferred teardown land.
		await act(async () => {
			await Promise.resolve();
		});

		spy.mockRestore();
		expect(errors).toEqual([]);
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('createPopperTopLayer - anchor positioning', () => {
	it('wires the popper to the anchor via CSS Anchor Positioning', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, { placement: 'top' });

		// The name is generated by top-layer's hook from React's `useId()`.
		const anchorName = anchor.style.getPropertyValue('anchor-name');
		expect(anchorName).toMatch(/^--anchor-\S+$/);
		expect(surface.style.getPropertyValue('position-anchor')).toBe(anchorName);

		await destroyed(instance);
	});

	it('maps the offset modifier to the placement gap', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, {
			placement: 'top',
			modifiers: [{ name: 'offset', options: { offset: [0, 12] } }],
		});

		// `placement: 'top'` puts the popper above the anchor, so the gap lands
		// on the block-end margin.
		expect(surface.style.getPropertyValue('margin-block-end')).toBe('12px');

		await destroyed(instance);
	});

	it('keeps the Popper.js no-offset default rather than the top-layer 8px gap', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, { placement: 'top' });

		expect(surface.style.getPropertyValue('margin-block-end')).toBe('0px');

		await destroyed(instance);
	});

	it('ignores a disabled offset modifier', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, {
			placement: 'top',
			modifiers: [{ name: 'offset', enabled: false, options: { offset: [0, 12] } }],
		});

		expect(surface.style.getPropertyValue('margin-block-end')).toBe('0px');

		await destroyed(instance);
	});

	it('lets a later offset modifier win, matching Popper.js merge-by-name', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, {
			placement: 'top',
			modifiers: [
				{ name: 'offset', options: { offset: [0, 4] } },
				{ name: 'offset', options: { offset: [0, 16] } },
			],
		});

		expect(surface.style.getPropertyValue('margin-block-end')).toBe('16px');

		await destroyed(instance);
	});

	it('restores prior inline styles on the popper on destroy', async () => {
		const anchor = createAnchor();
		const surface = createSurface({ popover: 'manual' });
		surface.showPopover();
		surface.style.setProperty('margin-block-end', '99px');

		const instance = create(anchor, surface, {
			placement: 'top',
			modifiers: [{ name: 'offset', options: { offset: [0, 12] } }],
		});
		expect(surface.style.getPropertyValue('margin-block-end')).toBe('12px');

		await destroyed(instance);

		expect(surface.style.getPropertyValue('margin-block-end')).toBe('99px');
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('createPopperTopLayer - virtual reference', () => {
	it('anchors a VirtualElement via the top-layer synthetic point anchor', async () => {
		const surface = createSurface();
		const reference = createVirtualElement({ top: 40, left: 25, width: 10, height: 20 });

		// `placement: 'bottom'` (the Popper.js default) anchors at the rect's
		// bottom edge, centred on the inline axis: y = top + height, x = centre.
		const instance = create(reference, surface);

		const syntheticAnchor = getSyntheticAnchor();
		expect(syntheticAnchor).not.toBeNull();
		expect(syntheticAnchor?.style.top).toBe('60px');
		expect(syntheticAnchor?.style.left).toBe('30px');
		expect(surface.style.getPropertyValue('position-anchor')).toBe(
			syntheticAnchor?.style.getPropertyValue('anchor-name'),
		);

		await destroyed(instance);
	});

	it('re-reads the rect on forceUpdate', async () => {
		const surface = createSurface();
		let top = 40;
		const reference: VirtualElement = {
			getBoundingClientRect: () =>
				({
					top,
					left: 0,
					width: 10,
					height: 20,
					right: 10,
					bottom: top + 20,
					x: 0,
					y: top,
				}) as DOMRect,
		};

		const instance = create(reference, surface);
		expect(getSyntheticAnchor()?.style.top).toBe('60px');

		top = 120;
		committed(() => instance.forceUpdate());

		expect(getSyntheticAnchor()?.style.top).toBe('140px');

		await destroyed(instance);
	});

	it('removes the synthetic anchor on destroy', async () => {
		const surface = createSurface();
		const reference = createVirtualElement({ top: 0, left: 0, width: 1, height: 1 });

		const instance = create(reference, surface);
		expect(getSyntheticAnchor()).not.toBeNull();

		await destroyed(instance);

		expect(getSyntheticAnchor()).toBeNull();
	});

	it('does not create a synthetic anchor for an HTMLElement reference', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface);

		expect(getSyntheticAnchor()).toBeNull();

		await destroyed(instance);
	});
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('createPopperTopLayer - instance surface', () => {
	it('exposes a popper-shaped state', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, {
			placement: 'right-start',
			strategy: 'fixed',
		});

		expect(instance.state.elements).toEqual({ reference: anchor, popper: surface });
		expect(instance.state.placement).toBe('right-start');
		expect(instance.state.strategy).toBe('fixed');
		expect(instance.state.options.placement).toBe('right-start');
		// Modifier-pipeline fields are inert: there is no pipeline.
		expect(instance.state.orderedModifiers).toEqual([]);
		expect(instance.state.modifiersData).toEqual({});
		expect(instance.state.styles).toEqual({});
		expect(instance.state.attributes).toEqual({});

		await destroyed(instance);
	});

	it('defaults placement and strategy to the Popper.js defaults', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface);

		expect(instance.state.placement).toBe('bottom');
		expect(instance.state.strategy).toBe('absolute');

		await destroyed(instance);
	});

	it('refreshes rects on update and resolves with the state', async () => {
		const anchor = createAnchor();
		const surface = createSurface();
		jest
			.spyOn(anchor, 'getBoundingClientRect')
			.mockReturnValue({ top: 5, left: 7, width: 30, height: 40 } as DOMRect);

		const instance = create(anchor, surface);

		let updated;
		committed(() => {
			updated = instance.update();
		});
		await expect(updated).resolves.toBe(instance.state);
		expect(instance.state.rects.reference).toEqual({ x: 7, y: 5, width: 30, height: 40 });

		await destroyed(instance);
	});

	it('re-applies positioning when setOptions changes the placement', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, {
			placement: 'top',
			modifiers: [{ name: 'offset', options: { offset: [0, 12] } }],
		});
		expect(surface.style.getPropertyValue('margin-block-end')).toBe('12px');

		committed(() => instance.setOptions((options) => ({ ...options, placement: 'bottom' })));

		expect(instance.state.placement).toBe('bottom');
		// The gap moved to the other block edge, and the previous edge margin
		// was restored to its pre-positioning state (no inline value).
		expect(surface.style.getPropertyValue('margin-block-start')).toBe('12px');
		expect(surface.style.getPropertyValue('margin-block-end')).toBe('');

		await destroyed(instance);
	});

	it('reuses the generated anchor-name across setOptions calls', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, { placement: 'top' });
		const anchorName = anchor.style.getPropertyValue('anchor-name');

		committed(() => instance.setOptions({ placement: 'bottom' }));

		expect(anchor.style.getPropertyValue('anchor-name')).toBe(anchorName);
		expect(surface.style.getPropertyValue('position-anchor')).toBe(anchorName);

		await destroyed(instance);
	});

	it('accepts a plain object from setOptions and keeps unspecified options', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, {
			placement: 'top',
			strategy: 'fixed',
		});

		committed(() => instance.setOptions({ placement: 'left' }));

		expect(instance.state.placement).toBe('left');
		expect(instance.state.strategy).toBe('fixed');

		await destroyed(instance);
	});

	it('ignores setOptions after destroy', async () => {
		const anchor = createAnchor();
		const surface = createSurface();

		const instance = create(anchor, surface, { placement: 'top' });
		await destroyed(instance);

		committed(() => instance.setOptions({ placement: 'bottom' }));

		expect(instance.state.placement).toBe('top');
	});

	it('calls onFirstUpdate once, asynchronously, with the state', async () => {
		const anchor = createAnchor();
		const surface = createSurface();
		const onFirstUpdate = jest.fn();

		const instance = create(anchor, surface, { onFirstUpdate });

		expect(onFirstUpdate).not.toHaveBeenCalled();

		await Promise.resolve();

		expect(onFirstUpdate).toHaveBeenCalledTimes(1);
		expect(onFirstUpdate).toHaveBeenCalledWith(instance.state);

		committed(() => instance.update());
		await Promise.resolve();

		expect(onFirstUpdate).toHaveBeenCalledTimes(1);

		await destroyed(instance);
	});

	it('does not call onFirstUpdate when destroyed before it resolves', async () => {
		const anchor = createAnchor();
		const surface = createSurface();
		const onFirstUpdate = jest.fn();

		const instance = create(anchor, surface, { onFirstUpdate });
		await destroyed(instance);

		await Promise.resolve();

		expect(onFirstUpdate).not.toHaveBeenCalled();
	});
});
