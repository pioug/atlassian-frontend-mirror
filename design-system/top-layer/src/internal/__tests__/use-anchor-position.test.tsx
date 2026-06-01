import React, { type RefObject, useRef } from 'react';

import { render, screen } from '@atlassian/testing-library';

import { useAnchorPosition } from '../use-anchor-position';

// JSDOM does not implement `window.CSS`. The hook caches its
// `CSS.supports('anchor-name', '--a')` feature detect via `once()`, so
// we must provide a real `CSS.supports` BEFORE any test renders the
// hook. Otherwise the cache pins the result to `false` for the rest of
// the file. This is environment setup, not module mocking; the hook
// itself is exercised unmodified.
(window as unknown as { CSS: { supports: () => boolean } }).CSS = {
	supports: () => true,
};

function OnePopoverOnAnchor({
	placement = {},
}: {
	placement?: Parameters<typeof useAnchorPosition>[0]['placement'];
}) {
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);

	useAnchorPosition({
		anchorRef,
		popoverRef,
		placement,
		// Force JS fallback so the test does not depend on CSS.supports
		forceFallbackPositioning: true,
	});

	return (
		<>
			<button ref={anchorRef} data-testid="trigger">
				trigger
			</button>
			<div ref={popoverRef} data-testid="popover">
				popover
			</div>
		</>
	);
}

function MultiplePopoversOnSameAnchor() {
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const popoverAboveRef = useRef<HTMLDivElement | null>(null);
	const popoverBelowRef = useRef<HTMLDivElement | null>(null);

	useAnchorPosition({
		anchorRef,
		popoverRef: popoverAboveRef,
		placement: { axis: 'block', edge: 'start' },
	});

	useAnchorPosition({
		anchorRef,
		popoverRef: popoverBelowRef,
		placement: { axis: 'block', edge: 'end' },
	});

	return (
		<>
			<button ref={anchorRef} data-testid="trigger">
				trigger
			</button>
			<div ref={popoverAboveRef} data-testid="popover-above">
				above
			</div>
			<div ref={popoverBelowRef} data-testid="popover-below">
				below
			</div>
		</>
	);
}

/**
 * One popover, conditionally rendered. Lets the test unmount the popover
 * subtree (and therefore tear down its `useAnchorPosition` effect)
 * without unmounting the trigger.
 *
 * Placement is held in a ref so the prop is referentially stable across
 * renders. Otherwise the inline object literal would change on every
 * parent render and force `useAnchorPosition`'s `useLayoutEffect` to
 * re-run, which would mask any bug where one popover's cleanup wipes
 * shared trigger state used by another.
 */
function PopoverWithAnchorPosition({
	popoverRef,
	testId,
	placement,
	anchorRef,
}: {
	popoverRef: RefObject<HTMLDivElement>;
	anchorRef: RefObject<HTMLButtonElement>;
	testId: string;
	placement: Parameters<typeof useAnchorPosition>[0]['placement'];
}) {
	const stablePlacement = useRef(placement).current;

	useAnchorPosition({
		anchorRef,
		popoverRef,
		placement: stablePlacement,
	});

	return (
		<div ref={popoverRef} data-testid={testId}>
			{testId}
		</div>
	);
}

/**
 * Trigger plus up to three independently-mountable popovers, each with
 * its own `useAnchorPosition`. The `show*` flags drive a `rerender()`
 * to mount/unmount popovers without touching the trigger, so the test
 * can verify that one popover's cleanup does not strip the trigger's
 * `anchor-name` while another popover still depends on it.
 */
function ConditionalPopoversOnSameAnchor({
	showA = true,
	showB = true,
	showC = false,
}: {
	showA?: boolean;
	showB?: boolean;
	showC?: boolean;
}) {
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const popoverARef = useRef<HTMLDivElement | null>(null);
	const popoverBRef = useRef<HTMLDivElement | null>(null);
	const popoverCRef = useRef<HTMLDivElement | null>(null);

	return (
		<>
			<button ref={anchorRef} data-testid="trigger">
				trigger
			</button>
			{showA ? (
				<PopoverWithAnchorPosition
					anchorRef={anchorRef}
					popoverRef={popoverARef}
					testId="popover-a"
					placement={{ axis: 'block', edge: 'start' }}
				/>
			) : null}
			{showB ? (
				<PopoverWithAnchorPosition
					anchorRef={anchorRef}
					popoverRef={popoverBRef}
					testId="popover-b"
					placement={{ axis: 'block', edge: 'end' }}
				/>
			) : null}
			{showC ? (
				<PopoverWithAnchorPosition
					anchorRef={anchorRef}
					popoverRef={popoverCRef}
					testId="popover-c"
					placement={{ axis: 'inline', edge: 'end' }}
				/>
			) : null}
		</>
	);
}

describe('useAnchorPosition', () => {
	it('should be accessible', async () => {
		const { container } = render(<OnePopoverOnAnchor />);
		await expect(container).toBeAccessible();
	});

	describe('cleanup', () => {
		it('should remove positioning styles synchronously on unmount', () => {
			const { unmount } = render(<OnePopoverOnAnchor />);

			const popover = screen.getByTestId('popover');

			// The fallback path sets margin and inset styles.
			// JSDOM normalizes '0' → '0px' for shorthand properties like margin.
			expect(popover.style.getPropertyValue('margin')).toBe('0px');
			expect(popover.style.getPropertyValue('inset')).toBe('auto');

			// Unmount - cleanup runs synchronously
			unmount();

			// Styles should be removed immediately after unmount
			expect(popover.style.getPropertyValue('margin')).toBe('');
			expect(popover.style.getPropertyValue('inset')).toBe('');
		});
	});

	describe('multiple popovers on same anchor', () => {
		it('all popovers share the trigger anchor name', () => {
			render(<MultiplePopoversOnSameAnchor />);

			const trigger = screen.getByTestId('trigger');
			const popoverAbove = screen.getByTestId('popover-above');
			const popoverBelow = screen.getByTestId('popover-below');

			const triggerAnchorName = trigger.style.getPropertyValue('anchor-name');
			const aboveAnchor = popoverAbove.style.getPropertyValue('position-anchor');
			const belowAnchor = popoverBelow.style.getPropertyValue('position-anchor');

			// Anchor name follows the `--anchor-{useId}` convention used by
			// the hook (colons stripped).
			expect(triggerAnchorName.startsWith('--anchor-')).toBe(true);
			// Both popovers must reference the same anchor name as the
			// trigger. That is the whole point of the fix. Previously the
			// second `useAnchorPosition` call generated its own id and
			// overwrote `trigger.style.anchorName`, leaving the first
			// popover's `position-anchor` pointing at a stale name.
			expect(aboveAnchor).toBe(triggerAnchorName);
			expect(belowAnchor).toBe(triggerAnchorName);
		});

		describe('cleanup behaviour when popovers unmount', () => {
			// The invariant we are protecting: after any popover unmounts,
			// every remaining popover's `position-anchor` must still
			// reference a non-empty `anchor-name` on the trigger.
			//
			// `useAnchorPosition` writes `anchor-name` to the trigger and
			// intentionally never removes it. This avoids dangling
			// `position-anchor` references when popovers unmount in any
			// order across separate components. As a consequence, the
			// trigger's `anchor-name` persists even after every popover
			// has unmounted; the tests below pin that behaviour so a
			// future refactor cannot accidentally re-introduce removal.

			it('keeps the trigger anchored when one of two popovers unmounts (B unmounts first)', () => {
				const { rerender } = render(<ConditionalPopoversOnSameAnchor showA={true} showB={true} />);

				const trigger = screen.getByTestId('trigger');
				const initialAnchorName = trigger.style.getPropertyValue('anchor-name');

				expect(initialAnchorName.startsWith('--anchor-')).toBe(true);

				rerender(<ConditionalPopoversOnSameAnchor showA={true} showB={false} />);

				const popoverA = screen.getByTestId('popover-a');
				const triggerAnchorAfter = trigger.style.getPropertyValue('anchor-name');

				expect(triggerAnchorAfter.startsWith('--anchor-')).toBe(true);
				expect(popoverA.style.getPropertyValue('position-anchor')).toBe(triggerAnchorAfter);
				expect(screen.queryByTestId('popover-b')).toBeNull();
			});

			it('keeps the trigger anchored when one of two popovers unmounts (A unmounts first)', () => {
				const { rerender } = render(<ConditionalPopoversOnSameAnchor showA={true} showB={true} />);

				const trigger = screen.getByTestId('trigger');

				rerender(<ConditionalPopoversOnSameAnchor showA={false} showB={true} />);

				const popoverB = screen.getByTestId('popover-b');
				const triggerAnchorAfter = trigger.style.getPropertyValue('anchor-name');

				expect(triggerAnchorAfter.startsWith('--anchor-')).toBe(true);
				expect(popoverB.style.getPropertyValue('position-anchor')).toBe(triggerAnchorAfter);
				expect(screen.queryByTestId('popover-a')).toBeNull();
			});

			it('keeps the trigger anchored through middle-popover unmount (3 → 2)', () => {
				const { rerender } = render(
					<ConditionalPopoversOnSameAnchor showA={true} showB={true} showC={true} />,
				);

				const trigger = screen.getByTestId('trigger');

				rerender(<ConditionalPopoversOnSameAnchor showA={true} showB={false} showC={true} />);

				const popoverA = screen.getByTestId('popover-a');
				const popoverC = screen.getByTestId('popover-c');
				const triggerAnchorAfter = trigger.style.getPropertyValue('anchor-name');

				expect(triggerAnchorAfter.startsWith('--anchor-')).toBe(true);
				expect(popoverA.style.getPropertyValue('position-anchor')).toBe(triggerAnchorAfter);
				expect(popoverC.style.getPropertyValue('position-anchor')).toBe(triggerAnchorAfter);
			});

			it('keeps the trigger anchored through sequential unmounts until only one popover remains', () => {
				const { rerender } = render(
					<ConditionalPopoversOnSameAnchor showA={true} showB={true} showC={true} />,
				);

				const trigger = screen.getByTestId('trigger');

				rerender(<ConditionalPopoversOnSameAnchor showA={true} showB={false} showC={true} />);
				expect(trigger.style.getPropertyValue('anchor-name').startsWith('--anchor-')).toBe(true);

				rerender(<ConditionalPopoversOnSameAnchor showA={false} showB={false} showC={true} />);

				const popoverC = screen.getByTestId('popover-c');
				const triggerAnchorAfter = trigger.style.getPropertyValue('anchor-name');

				expect(triggerAnchorAfter.startsWith('--anchor-')).toBe(true);
				expect(popoverC.style.getPropertyValue('position-anchor')).toBe(triggerAnchorAfter);
			});

			it('keeps the trigger anchor name set after the last popover unmounts', () => {
				const { rerender } = render(<ConditionalPopoversOnSameAnchor showA={true} showB={true} />);

				const trigger = screen.getByTestId('trigger');
				expect(trigger.style.getPropertyValue('anchor-name')).not.toBe('');

				rerender(<ConditionalPopoversOnSameAnchor showA={true} showB={false} />);
				expect(trigger.style.getPropertyValue('anchor-name')).not.toBe('');

				rerender(<ConditionalPopoversOnSameAnchor showA={false} showB={false} />);

				// Intentional: the anchor-name is owned by the trigger,
				// not by any individual popover, so it persists.
				expect(trigger.style.getPropertyValue('anchor-name').startsWith('--anchor-')).toBe(true);
			});

			it('keeps the trigger anchor name set after the only popover unmounts', () => {
				const { rerender } = render(<ConditionalPopoversOnSameAnchor showA={true} showB={false} />);

				const trigger = screen.getByTestId('trigger');
				expect(trigger.style.getPropertyValue('anchor-name')).not.toBe('');

				rerender(<ConditionalPopoversOnSameAnchor showA={false} showB={false} />);

				// Intentional: the anchor-name is owned by the trigger,
				// not by the popover, so unmounting the last popover does
				// not clear it. See the source comment in
				// `use-anchor-position.tsx` for the rationale.
				expect(trigger.style.getPropertyValue('anchor-name').startsWith('--anchor-')).toBe(true);
			});

			it('keeps the second popover in sync when it mounts after the first', () => {
				const { rerender } = render(<ConditionalPopoversOnSameAnchor showA={true} showB={false} />);

				const trigger = screen.getByTestId('trigger');

				// Add a second popover while the first is still mounted.
				rerender(<ConditionalPopoversOnSameAnchor showA={true} showB={true} />);

				const popoverA = screen.getByTestId('popover-a');
				const popoverB = screen.getByTestId('popover-b');
				const triggerAnchorName = trigger.style.getPropertyValue('anchor-name');

				expect(triggerAnchorName.startsWith('--anchor-')).toBe(true);
				expect(popoverA.style.getPropertyValue('position-anchor')).toBe(triggerAnchorName);
				expect(popoverB.style.getPropertyValue('position-anchor')).toBe(triggerAnchorName);
			});

			it('reuses the lingering anchor name when a new popover mounts after the previous one unmounted', () => {
				const { rerender } = render(<ConditionalPopoversOnSameAnchor showA={true} showB={false} />);

				const trigger = screen.getByTestId('trigger');
				const originalAnchorName = trigger.style.getPropertyValue('anchor-name');

				// Tear down all popovers, then mount a fresh one. Because
				// `useAnchorPosition` never removes `anchor-name` from the
				// trigger, the new popover will see the lingering value
				// and reuse it instead of generating a new one.
				rerender(<ConditionalPopoversOnSameAnchor showA={false} showB={false} />);
				expect(trigger.style.getPropertyValue('anchor-name')).toBe(originalAnchorName);

				rerender(<ConditionalPopoversOnSameAnchor showA={false} showB={true} />);

				const popoverB = screen.getByTestId('popover-b');
				const finalAnchorName = trigger.style.getPropertyValue('anchor-name');

				expect(finalAnchorName).toBe(originalAnchorName);
				expect(popoverB.style.getPropertyValue('position-anchor')).toBe(originalAnchorName);
			});

			it('unmounts cleanly without throwing when the whole component is removed', () => {
				const { unmount, container } = render(
					<ConditionalPopoversOnSameAnchor showA={true} showB={true} />,
				);

				const triggerBeforeUnmount = screen.getByTestId('trigger');
				expect(triggerBeforeUnmount.style.getPropertyValue('anchor-name')).not.toBe('');

				unmount();

				// The trigger element is detached from the DOM together
				// with everything else; any leftover `anchor-name` is
				// scoped to the detached node, so this is a teardown
				// smoke test rather than an anchor-name assertion.
				expect(container.firstChild).toBeNull();
			});
		});
	});

	describe('placement stability', () => {
		// Consumers commonly pass an inline `placement={{ ... }}` literal,
		// which produces a new object reference on every parent render.
		// `useAnchorPosition` resolves the placement and compares the
		// shape, so a shape-equal new reference must not cause the
		// positioning `useLayoutEffect` to tear down and re-run all the
		// DOM style writes. These tests pin that behaviour.

		function Probe({
			placement,
			onRender,
		}: {
			placement: Parameters<typeof useAnchorPosition>[0]['placement'];
			onRender: () => void;
		}) {
			const anchorRef = useRef<HTMLButtonElement | null>(null);
			const popoverRef = useRef<HTMLDivElement | null>(null);

			useAnchorPosition({
				anchorRef,
				popoverRef,
				placement,
				forceFallbackPositioning: true,
			});

			onRender();

			return (
				<>
					<button ref={anchorRef} data-testid="trigger">
						trigger
					</button>
					<div ref={popoverRef} data-testid="popover">
						popover
					</div>
				</>
			);
		}

		it('does not re-run the positioning effect when a shape-equal placement object is passed', () => {
			const onRender = jest.fn();
			const placementA = { axis: 'block', edge: 'end' } as const;

			const { rerender } = render(<Probe placement={placementA} onRender={onRender} />);

			const popover = screen.getByTestId('popover');

			// Track style writes after the initial mount. If the effect
			// re-runs, we will see additional `setProperty` calls (the
			// effect calls `setStyle`, which in turn calls `setProperty`
			// for every style entry).
			const setPropertySpy = jest.spyOn(popover.style, 'setProperty');

			// Pass a NEW object reference with the SAME resolved shape.
			rerender(<Probe placement={{ axis: 'block', edge: 'end' }} onRender={onRender} />);

			expect(setPropertySpy).not.toHaveBeenCalled();

			setPropertySpy.mockRestore();
		});

		it('treats omitted defaults as equal to explicit defaults', () => {
			const onRender = jest.fn();

			// `{}` resolves to the same placement as the explicit defaults
			// (`axis: 'block'`, `edge: 'end'`, `align: 'center'`).
			const { rerender } = render(<Probe placement={{}} onRender={onRender} />);

			const popover = screen.getByTestId('popover');
			const setPropertySpy = jest.spyOn(popover.style, 'setProperty');

			rerender(
				<Probe placement={{ axis: 'block', edge: 'end', align: 'center' }} onRender={onRender} />,
			);

			expect(setPropertySpy).not.toHaveBeenCalled();

			setPropertySpy.mockRestore();
		});

		it('"just works" when no placement is provided - applies defaults and stays stable across re-renders', () => {
			const onRender = jest.fn();

			// Calling `useAnchorPosition` without a `placement` prop must
			// "just work": the hook applies the full default placement
			// (centered below the trigger, `space.100` gap, no shift).
			const { rerender } = render(<Probe placement={undefined} onRender={onRender} />);

			const popover = screen.getByTestId('popover');

			// The popover must have been positioned (the JS fallback
			// sets `inset: auto` and `margin: 0` as base styles -
			// JSDom normalises `0` to `0px` for the `margin` shorthand).
			expect(popover.style.getPropertyValue('margin')).toBe('0px');
			expect(popover.style.getPropertyValue('inset')).toBe('auto');

			// Re-rendering with still-undefined placement must not
			// re-run the positioning effect - `undefined` collapses to
			// `{}` which resolves to the same shape as last time.
			const setPropertySpy = jest.spyOn(popover.style, 'setProperty');
			rerender(<Probe placement={undefined} onRender={onRender} />);
			expect(setPropertySpy).not.toHaveBeenCalled();
			setPropertySpy.mockRestore();
		});

		it('does re-run the positioning effect when the placement shape actually changes', () => {
			const onRender = jest.fn();

			const { rerender } = render(
				<Probe placement={{ axis: 'block', edge: 'end' }} onRender={onRender} />,
			);

			const popover = screen.getByTestId('popover');
			const setPropertySpy = jest.spyOn(popover.style, 'setProperty');

			rerender(<Probe placement={{ axis: 'block', edge: 'start' }} onRender={onRender} />);

			// Shape changed, so the effect must re-run and write styles.
			expect(setPropertySpy).toHaveBeenCalled();

			setPropertySpy.mockRestore();
		});
	});
});
