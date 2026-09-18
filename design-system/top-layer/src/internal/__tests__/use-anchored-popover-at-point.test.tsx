import React, { useRef } from 'react';

import { render, screen } from '@atlassian/testing-library';

import { useAnchoredPopover } from '../use-anchored-popover';
import { type TAnchorPoint, useAnchoredPopoverAtPoint } from '../use-anchored-popover-at-point';

// JSDOM does not implement `window.CSS`, and the hook caches its feature detect
// via `once()`, so a real `CSS.supports` has to exist BEFORE any test renders the
// hook or the cache pins to `false` for the rest of the file. The
// synthetic-anchor lifecycle asserted below does not consult the positioning
// path, so putting the whole file on the CSS path costs no coverage.
(window as unknown as { CSS: { supports: () => boolean } }).CSS = {
	supports: () => true,
};

/**
 * The hook is the only producer of `div[aria-hidden="true"]` children of
 * `<body>`, so this is a reliable signal that the lazy creation path ran. The
 * anchor has no accessible handles, so RTL cannot query it.
 */
function countSyntheticAnchors(): number {
	return document.body.querySelectorAll('div[aria-hidden="true"]').length;
}

/**
 * Throws unless there is exactly one, so an assertion about WHERE the anchor sits
 * cannot pass by reading a leaked or duplicated one. Its physical `left`/`top`
 * are the only observable record of the latched point: a re-latch leaves both the
 * original callback's call count and the anchor count unchanged.
 */
function getSyntheticAnchor(): HTMLElement {
	const anchors = Array.from(
		document.body.querySelectorAll<HTMLElement>('div[aria-hidden="true"]'),
	);
	const [anchor] = anchors;
	if (!anchor || anchors.length !== 1) {
		throw new Error(`Expected exactly one synthetic anchor, found ${anchors.length}`);
	}
	return anchor;
}

/**
 * The popover is rendered inline so the hook has a valid ref to write to, but
 * the tests only inspect the synthetic anchor.
 */
function TestComponent({
	isEnabled,
	getPoint,
}: {
	isEnabled: boolean;
	getPoint: () => TAnchorPoint | null;
}) {
	const popoverRef = useRef<HTMLDivElement | null>(null);

	useAnchoredPopoverAtPoint({
		isEnabled,
		getPoint,
		popoverRef,
		placement: { axis: 'block', align: 'start' },
		isOpen: true,
	});

	return (
		<div ref={popoverRef} data-testid="popover">
			popover
		</div>
	);
}

describe('useAnchoredPopoverAtPoint - lazy element creation', () => {
	it('should be accessible', async () => {
		const { container } = render(
			<TestComponent isEnabled={true} getPoint={() => ({ x: 75, y: 50 })} />,
		);
		await expect(container).toBeAccessible();
	});

	it('does NOT create a synthetic anchor when disabled', () => {
		const getPoint = jest.fn<TAnchorPoint | null, []>(() => ({
			x: 200,
			y: 100,
		}));

		render(<TestComponent isEnabled={false} getPoint={getPoint} />);

		expect(countSyntheticAnchors()).toBe(0);
		// `isEnabled: false` short-circuits before the callback runs.
		expect(getPoint).not.toHaveBeenCalled();
	});

	it('does NOT create a synthetic anchor when getPoint() returns null', () => {
		const getPoint = jest.fn<TAnchorPoint | null, []>(() => null);

		render(<TestComponent isEnabled={true} getPoint={getPoint} />);

		expect(countSyntheticAnchors()).toBe(0);

		// Called once per activation, and the hook is enabled on mount.
		expect(getPoint).toHaveBeenCalledTimes(1);
	});

	it('creates exactly one synthetic anchor for a point that resolves', () => {
		const getPoint = jest.fn<TAnchorPoint | null, []>(() => ({
			x: 75,
			y: 50,
		}));

		render(<TestComponent isEnabled={true} getPoint={getPoint} />);

		expect(countSyntheticAnchors()).toBe(1);
		expect(getPoint).toHaveBeenCalledTimes(1);
	});

	it('latches getPoint on isEnabled, not on the callback identity', () => {
		// `@atlaskit/popper` and `@atlaskit/tooltip` read mutable refs inside
		// `getPoint`, so re-reading it would move an already-open popover, and both
		// pass an inline arrow, so keying on identity would re-latch every render.
		const getPoint = jest.fn<TAnchorPoint | null, []>(() => ({ x: 10, y: 20 }));

		const { rerender } = render(<TestComponent isEnabled={true} getPoint={getPoint} />);
		expect(getPoint).toHaveBeenCalledTimes(1);

		const anchorBefore = getSyntheticAnchor();
		expect(anchorBefore.style.left).toBe('10px');
		expect(anchorBefore.style.top).toBe('20px');

		// The new callback returns a point 989px away on both axes, so a re-latch is
		// a 989px move rather than a rounding difference.
		rerender(<TestComponent isEnabled={true} getPoint={() => ({ x: 999, y: 999 })} />);

		expect(getPoint).toHaveBeenCalledTimes(1);
		expect(countSyntheticAnchors()).toBe(1);

		// The load-bearing assertions: a re-latch calls the NEW arrow and replaces
		// the anchor, so neither count above can see it.
		const anchorAfter = getSyntheticAnchor();
		expect(anchorAfter).toBe(anchorBefore);
		expect(anchorAfter.style.left).toBe('10px');
		expect(anchorAfter.style.top).toBe('20px');
	});

	it('re-latches when it is re-enabled', () => {
		// `false` -> `true` is the "next open" transition. `point` is mutable so the
		// second activation reads a DIFFERENT coordinate: the call count alone would
		// also pass for a hook that cached and replayed the first point.
		let point: TAnchorPoint = { x: 10, y: 20 };
		const getPoint = jest.fn<TAnchorPoint | null, []>(() => point);

		const { rerender } = render(<TestComponent isEnabled={true} getPoint={getPoint} />);
		expect(getPoint).toHaveBeenCalledTimes(1);
		expect(getSyntheticAnchor().style.left).toBe('10px');
		expect(getSyntheticAnchor().style.top).toBe('20px');

		rerender(<TestComponent isEnabled={false} getPoint={getPoint} />);
		expect(countSyntheticAnchors()).toBe(0);

		point = { x: 400, y: 300 };
		rerender(<TestComponent isEnabled={true} getPoint={getPoint} />);

		expect(getPoint).toHaveBeenCalledTimes(2);
		expect(countSyntheticAnchors()).toBe(1);
		expect(getSyntheticAnchor().style.left).toBe('400px');
		expect(getSyntheticAnchor().style.top).toBe('300px');
	});

	it('removes the synthetic anchor on unmount', () => {
		const getPoint = () => ({ x: 20, y: 10 });

		const { unmount } = render(<TestComponent isEnabled={true} getPoint={getPoint} />);

		expect(countSyntheticAnchors()).toBe(1);

		unmount();

		expect(countSyntheticAnchors()).toBe(0);
	});

	it('positions the popover against the synthetic anchor, not the trigger', () => {
		// The delegation: the inner `useAnchoredPopover` must write
		// `position-anchor` pointing at a name it put on OUR `<div>`.
		render(<TestComponent isEnabled={true} getPoint={() => ({ x: 30, y: 40 })} />);

		const positionAnchor = screen.getByTestId('popover').style.getPropertyValue('position-anchor');

		expect(positionAnchor.startsWith('--anchor-')).toBe(true);
		expect(getSyntheticAnchor().style.getPropertyValue('anchor-name')).toBe(positionAnchor);
	});
});

/**
 * ONE component, BOTH hooks, complementary `isEnabled`. The shape
 * `@atlaskit/tooltip` produces when a keyboard-shown `position="mouse"` tooltip
 * gets its first `onMouseMove`, and `@atlaskit/popper` when a consumer swaps
 * `referenceElement` from an `HTMLElement` to a `VirtualElement`.
 */
function FlippingAnchor({ kind }: { kind: 'element' | 'point' }) {
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);

	const shared = {
		popoverRef,
		placement: { axis: 'block', edge: 'end' },
		isOpen: true,
	} as const;

	useAnchoredPopover({
		...shared,
		anchorRef: triggerRef,
		isEnabled: kind === 'element',
	});

	useAnchoredPopoverAtPoint({
		...shared,
		isEnabled: kind === 'point',
		getPoint: () => ({ x: 120, y: 80 }),
	});

	return (
		<>
			<button ref={triggerRef} data-testid="trigger">
				trigger
			</button>
			<div ref={popoverRef} data-testid="popover">
				popover
			</div>
		</>
	);
}

function getTriggerAnchorName(): string {
	return screen.getByTestId('trigger').style.getPropertyValue('anchor-name');
}

function getPositionAnchor(): string {
	return screen.getByTestId('popover').style.getPropertyValue('position-anchor');
}

/**
 * The two hooks must never share an `anchor-name`. Names are never removed (see
 * `notes/decisions/anchor-name-lifetime.md`), so a shared one would sit on both
 * elements at once, and css-anchor-position-1 resolves a duplicate to the last
 * acceptable anchor in tree order. Each hook instance draws its own `useId()`, so
 * within one root the collision is impossible by construction - these tests pin
 * that.
 */
describe('useAnchoredPopoverAtPoint - anchor-name isolation', () => {
	it('gives the synthetic anchor a name distinct from the trigger, and targets it', () => {
		const { rerender } = render(<FlippingAnchor kind="element" />);

		const triggerName = getTriggerAnchorName();
		expect(triggerName.startsWith('--anchor-')).toBe(true);
		expect(getPositionAnchor()).toBe(triggerName);

		rerender(<FlippingAnchor kind="point" />);

		// Nothing is cleaned up, so both elements carry a name at the same time.
		expect(getTriggerAnchorName()).toBe(triggerName);

		const syntheticName = getSyntheticAnchor().style.getPropertyValue('anchor-name');
		expect(syntheticName.startsWith('--anchor-')).toBe(true);

		// Two names, so tree order cannot decide the target.
		expect(syntheticName).not.toBe(triggerName);

		// Nor a SUBSTRING of the other: `post-office`'s `useElementByAnchorName`
		// resolves an anchor with a `[style*="anchor-name: --name"]` match.
		expect(syntheticName.includes(triggerName)).toBe(false);
		expect(triggerName.includes(syntheticName)).toBe(false);

		// The popover follows whichever hook is enabled.
		expect(getPositionAnchor()).toBe(syntheticName);
	});

	it('re-points position-anchor at the trigger when the anchor flips back', () => {
		const { rerender } = render(<FlippingAnchor kind="element" />);
		const triggerName = getTriggerAnchorName();

		rerender(<FlippingAnchor kind="point" />);
		expect(getPositionAnchor()).not.toBe(triggerName);

		rerender(<FlippingAnchor kind="element" />);

		// Back on the element name, and the synthetic anchor is gone with it.
		expect(getPositionAnchor()).toBe(triggerName);
		expect(countSyntheticAnchors()).toBe(0);
	});

	it('keeps both names stable across a re-render that changes nothing else', () => {
		const { rerender } = render(<FlippingAnchor kind="element" />);
		rerender(<FlippingAnchor kind="point" />);

		const triggerName = getTriggerAnchorName();
		const syntheticName = getSyntheticAnchor().style.getPropertyValue('anchor-name');
		const anchorElement = getSyntheticAnchor();

		// So the `toBe` assertions below cannot pass on `'' === ''`.
		expect(triggerName).not.toBe('');
		expect(syntheticName).not.toBe('');

		rerender(<FlippingAnchor kind="point" />);

		// A moving name would break every popover already pointing at the old one.
		expect(getTriggerAnchorName()).toBe(triggerName);
		expect(getSyntheticAnchor().style.getPropertyValue('anchor-name')).toBe(syntheticName);
		expect(getPositionAnchor()).toBe(syntheticName);

		// The name assertions above cannot see a re-latch: the minted name is
		// captured once per hook instance, so a replacement `<div>` carries the
		// same one.
		expect(getSyntheticAnchor()).toBe(anchorElement);
	});
});
