import React, { type RefObject, useRef } from 'react';

import { hydrateRoot, type Root } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { act, render, screen } from '@atlassian/testing-library';

import { useAnchoredPopover } from '../use-anchored-popover';

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
	placement?: Parameters<typeof useAnchoredPopover>[0]['placement'];
}) {
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const popoverRef = useRef<HTMLDivElement | null>(null);

	useAnchoredPopover({
		anchorRef: anchorRef,
		popoverRef,
		placement,
		// Force JS fallback so the test does not depend on CSS.supports
		forceFallbackPositioning: true,
		isOpen: true,
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

	useAnchoredPopover({
		anchorRef: anchorRef,
		popoverRef: popoverAboveRef,
		placement: { axis: 'block', edge: 'start' },
		isOpen: true,
	});

	useAnchoredPopover({
		anchorRef: anchorRef,
		popoverRef: popoverBelowRef,
		placement: { axis: 'block', edge: 'end' },
		isOpen: true,
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
 * subtree (and therefore tear down its `useAnchoredPopover` effect)
 * without unmounting the trigger.
 *
 * Placement is held in a ref so the prop is referentially stable across
 * renders. Otherwise the inline object literal would change on every
 * parent render and force `useAnchoredPopover`'s `useLayoutEffect` to
 * re-run, which would mask any bug where one popover's cleanup wipes
 * shared trigger state used by another.
 */
function PopoverWithAnchoredPopover({
	popoverRef,
	testId,
	placement,
	anchorRef,
}: {
	popoverRef: RefObject<HTMLDivElement>;
	anchorRef: RefObject<HTMLButtonElement>;
	testId: string;
	placement: Parameters<typeof useAnchoredPopover>[0]['placement'];
}) {
	const stablePlacement = useRef(placement).current;

	useAnchoredPopover({
		anchorRef: anchorRef,
		popoverRef,
		placement: stablePlacement,
		isOpen: true,
	});

	return (
		<div ref={popoverRef} data-testid={testId}>
			{testId}
		</div>
	);
}

/**
 * Trigger plus up to three independently-mountable popovers, each with
 * its own `useAnchoredPopover`. The `show*` flags drive a `rerender()`
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
				<PopoverWithAnchoredPopover
					anchorRef={anchorRef}
					popoverRef={popoverARef}
					testId="popover-a"
					placement={{ axis: 'block', edge: 'start' }}
				/>
			) : null}
			{showB ? (
				<PopoverWithAnchoredPopover
					anchorRef={anchorRef}
					popoverRef={popoverBRef}
					testId="popover-b"
					placement={{ axis: 'block', edge: 'end' }}
				/>
			) : null}
			{showC ? (
				<PopoverWithAnchoredPopover
					anchorRef={anchorRef}
					popoverRef={popoverCRef}
					testId="popover-c"
					placement={{ axis: 'inline', edge: 'end' }}
				/>
			) : null}
		</>
	);
}

describe('useAnchoredPopover', () => {
	it('should be accessible', async () => {
		const { container } = render(<OnePopoverOnAnchor />);
		await expect(container).toBeAccessible();
	});

	describe('isEnabled: false', () => {
		function OptionalAnchor({ isAnchored }: { isAnchored: boolean }) {
			const anchorRef = useRef<HTMLButtonElement | null>(null);
			const popoverRef = useRef<HTMLDivElement | null>(null);

			useAnchoredPopover({
				anchorRef,
				isEnabled: isAnchored,
				popoverRef,
				placement: { axis: 'block', edge: 'end' },
				isOpen: true,
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

		it('applies no positioning at all, so another strategy can own the popover', () => {
			render(<OptionalAnchor isAnchored={false} />);

			const trigger = screen.getByTestId('trigger');
			const popover = screen.getByTestId('popover');

			expect(popover.style.getPropertyValue('position-anchor')).toBe('');
			expect(popover.style.getPropertyValue('inset')).toBe('');
			expect(trigger.style.getPropertyValue('anchor-name')).toBe('');
		});

		it('starts positioning once an anchor is supplied', () => {
			const { rerender } = render(<OptionalAnchor isAnchored={false} />);

			rerender(<OptionalAnchor isAnchored={true} />);

			const trigger = screen.getByTestId('trigger');
			const popover = screen.getByTestId('popover');

			expect(trigger.style.getPropertyValue('anchor-name').startsWith('--anchor-')).toBe(true);
			expect(popover.style.getPropertyValue('position-anchor')).toBe(
				trigger.style.getPropertyValue('anchor-name'),
			);
		});
	});

	describe('sizing', () => {
		function SizedPopover({
			inlineSize,
			blockSize,
			minSize,
			forceFallbackPositioning = false,
			shouldPreserveInlineSize = false,
		}: {
			inlineSize?: Parameters<typeof useAnchoredPopover>[0]['inlineSize'];
			blockSize?: Parameters<typeof useAnchoredPopover>[0]['blockSize'];
			minSize?: number;
			forceFallbackPositioning?: boolean;
			shouldPreserveInlineSize?: boolean;
		}) {
			const anchorRef = useRef<HTMLButtonElement | null>(null);
			const popoverRef = useRef<HTMLDivElement | null>(null);

			useAnchoredPopover({
				anchorRef: anchorRef,
				popoverRef,
				placement: { axis: 'block', edge: 'end', minSize },
				inlineSize,
				blockSize,
				forceFallbackPositioning,
				shouldPreserveInlineSize,
				isOpen: true,
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

		it('writes the viewport backstop on both axes with no sizing options at all', () => {
			render(<SizedPopover />);

			const popover = screen.getByTestId('popover');

			expect(popover.style.getPropertyValue('max-inline-size')).toBe('calc(100dvw - 2 * 5px)');
			expect(popover.style.getPropertyValue('max-block-size')).toBe('calc(100dvh - 2 * 5px)');
			expect(popover.style.getPropertyValue('min-block-size')).toBe('');
		});

		it("caps the placement axis to the cell and floors it when 'max-available'", () => {
			render(<SizedPopover blockSize="max-available" />);

			const popover = screen.getByTestId('popover');

			expect(popover.style.getPropertyValue('max-block-size')).toBe(
				'calc(100% - 5px - var(--ds-space-100, 8px))',
			);
			// The default floor is clamped against the anchor's size, which is why a
			// fitting popover resolves `anchor-size()` with no anchor-relative axis.
			expect(popover.style.getPropertyValue('min-block-size')).toBe(
				'min(150px, max(0px, calc((100dvh - anchor-size(self-block)) / 2 - var(--ds-space-100, 8px) - 5px)))',
			);
		});

		it('writes the natural width by default, so a narrow cell is overflowed rather than wrapped into', () => {
			render(<SizedPopover />);

			expect(screen.getByTestId('popover').style.getPropertyValue('inline-size')).toBe(
				'max-content',
			);
		});

		it('leaves inline-size alone with shouldPreserveInlineSize, for a consumer-owned element', () => {
			render(<SizedPopover shouldPreserveInlineSize />);

			const popover = screen.getByTestId('popover');
			expect(popover.style.getPropertyValue('inline-size')).toBe('');
			// Everything else is still written.
			expect(popover.style.getPropertyValue('max-inline-size')).toBe('calc(100dvw - 2 * 5px)');
		});

		it('lets minSize: 0 opt out of the floor', () => {
			render(<SizedPopover blockSize="max-available" minSize={0} />);

			expect(screen.getByTestId('popover').style.getPropertyValue('min-block-size')).toBe('0px');
		});

		it("uses anchor-size() for 'match-anchor' on the CSS path", () => {
			render(<SizedPopover inlineSize="match-anchor" />);

			expect(screen.getByTestId('popover').style.getPropertyValue('inline-size')).toBe(
				'anchor-size(self-inline)',
			);
		});

		it('removes the size declarations on unmount', () => {
			const { unmount } = render(<SizedPopover inlineSize="match-anchor" />);

			const popover = screen.getByTestId('popover');
			expect(popover.style.getPropertyValue('inline-size')).not.toBe('');

			unmount();

			expect(popover.style.getPropertyValue('inline-size')).toBe('');
			expect(popover.style.getPropertyValue('max-inline-size')).toBe('');
		});

		describe('the measured anchor size on the fallback', () => {
			// `offsetWidth` / `offsetHeight` are physical, so the fallback picks the
			// axis from the popover's `writing-mode`. jsdom lays nothing out, so both
			// are stubbed, along with `getComputedStyle` for the mode.
			function renderMeasured({ writingMode }: { writingMode: string }): HTMLElement {
				const offsetWidth = jest
					.spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
					.mockReturnValue(240);
				const offsetHeight = jest
					.spyOn(HTMLElement.prototype, 'offsetHeight', 'get')
					.mockReturnValue(40);
				const computedStyle = jest
					.spyOn(window, 'getComputedStyle')
					.mockReturnValue({ writingMode } as CSSStyleDeclaration);

				try {
					render(<SizedPopover inlineSize="match-anchor" forceFallbackPositioning />);
					return screen.getByTestId('popover');
				} finally {
					offsetWidth.mockRestore();
					offsetHeight.mockRestore();
					computedStyle.mockRestore();
				}
			}

			it('reads the anchor WIDTH as its inline size in a horizontal writing mode', () => {
				expect(
					renderMeasured({ writingMode: 'horizontal-tb' }).style.getPropertyValue('inline-size'),
				).toBe('240px');
			});

			it('reads the anchor HEIGHT as its inline size in a vertical writing mode', () => {
				// The swap: in `vertical-rl` the inline axis runs top to bottom, so the
				// anchor's inline size is its `offsetHeight`.
				expect(
					renderMeasured({ writingMode: 'vertical-rl' }).style.getPropertyValue('inline-size'),
				).toBe('40px');
			});

			it('caps the inline axis against the viewport HEIGHT in a vertical writing mode', () => {
				// The same swap for the viewport unit.
				const popover = renderMeasured({ writingMode: 'vertical-rl' });
				expect(popover.style.getPropertyValue('max-inline-size')).toBe('calc(100dvh - 2 * 5px)');
				expect(popover.style.getPropertyValue('max-block-size')).toBe('calc(100dvw - 2 * 5px)');
			});
		});
	});

	describe('re-opening across a host remount', () => {
		// `Popover` unmounts its host while closed and mounts a NEW element on the
		// next open. `isOpen` is in the effect's dependencies purely so the styles
		// follow that new element.
		function ReopeningPopover({ isOpen }: { isOpen: boolean }) {
			const anchorRef = useRef<HTMLButtonElement | null>(null);
			const popoverRef = useRef<HTMLDivElement | null>(null);

			useAnchoredPopover({
				anchorRef,
				popoverRef,
				placement: { axis: 'block', edge: 'end' },
				blockSize: 'max-available',
				isOpen,
			});

			return (
				<>
					<button ref={anchorRef} data-testid="trigger">
						trigger
					</button>
					{isOpen ? (
						<div ref={popoverRef} data-testid="popover">
							popover
						</div>
					) : null}
				</>
			);
		}

		it('positions and sizes the NEW host element on the second open', () => {
			const { rerender } = render(<ReopeningPopover isOpen={true} />);

			const firstHost = screen.getByTestId('popover');
			expect(firstHost.style.getPropertyValue('position-anchor')).not.toBe('');

			rerender(<ReopeningPopover isOpen={false} />);
			expect(screen.queryByTestId('popover')).toBeNull();

			rerender(<ReopeningPopover isOpen={true} />);

			const secondHost = screen.getByTestId('popover');
			// A genuinely new element, so nothing carried over from the first open.
			expect(secondHost).not.toBe(firstHost);

			const trigger = screen.getByTestId('trigger');
			expect(secondHost.style.getPropertyValue('position-anchor')).toBe(
				trigger.style.getPropertyValue('anchor-name'),
			);
			expect(secondHost.style.getPropertyValue('max-block-size')).toBe(
				'calc(100% - 5px - var(--ds-space-100, 8px))',
			);
			expect(secondHost.style.getPropertyValue('min-block-size')).not.toBe('');
		});
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

		it("restores a consumer's own inline top / left / opacity rather than removing them", () => {
			const { unmount } = render(<OnePopoverOnAnchor />);

			const popover = screen.getByTestId('popover');

			// The popover element is not always ours: `@atlaskit/popper`'s
			// imperative `createPopper` adapter positions an element that the
			// caller created and that the caller hides itself. Cleanup must restore
			// whatever the consumer had inline, not remove the property outright.
			popover.style.setProperty('opacity', '0');
			popover.style.setProperty('top', '11px');
			popover.style.setProperty('left', '22px');

			unmount();

			expect(popover.style.getPropertyValue('opacity')).toBe('0');
			expect(popover.style.getPropertyValue('top')).toBe('11px');
			expect(popover.style.getPropertyValue('left')).toBe('22px');
		});
	});

	describe('an anchor-name the consumer set from a stylesheet', () => {
		// CSS path: `OnePopoverOnAnchor` forces the fallback, which writes no names.
		function CssPositioned() {
			const anchorRef = useRef<HTMLButtonElement | null>(null);
			const popoverRef = useRef<HTMLDivElement | null>(null);

			useAnchoredPopover({ anchorRef, popoverRef, placement: {}, isOpen: true });

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

		// jsdom does not cascade `anchor-name`, so the computed value is stubbed:
		// `element.style` stays empty, exactly as for a class-applied name.
		function withComputedAnchorName<T>(value: string, run: () => T): T {
			const original = window.getComputedStyle;
			const spy = jest.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
				const computed = original.call(window, element);
				if ((element as HTMLElement).dataset.testid === 'trigger') {
					return { ...computed, getPropertyValue: () => value } as CSSStyleDeclaration;
				}
				return computed;
			});
			try {
				return run();
			} finally {
				spy.mockRestore();
			}
		}

		it('anchors to it and does not write an inline name over it', () => {
			// Reading only `element.style` misses a class-applied name, and the minted
			// inline name would then win the cascade for every other rule anchored to
			// the element.
			withComputedAnchorName('--from-stylesheet', () => {
				render(<CssPositioned />);
			});

			const trigger = screen.getByTestId('trigger');
			const popover = screen.getByTestId('popover');

			expect(popover.style.getPropertyValue('position-anchor')).toBe('--from-stylesheet');
			expect(trigger.style.getPropertyValue('anchor-name')).toBe('');
		});

		it('anchors to the FIRST name of a list', () => {
			// `anchor-name` is a list; `position-anchor` takes one ident.
			withComputedAnchorName('--first, --second', () => {
				render(<CssPositioned />);
			});

			expect(screen.getByTestId('popover').style.getPropertyValue('position-anchor')).toBe(
				'--first',
			);
		});

		it("treats the initial value 'none' as no name and mints one", () => {
			withComputedAnchorName('none', () => {
				render(<CssPositioned />);
			});

			const trigger = screen.getByTestId('trigger');
			expect(trigger.style.getPropertyValue('anchor-name').startsWith('--anchor-')).toBe(true);
		});
	});

	describe('anchor names across React roots', () => {
		// CSS path, so a name is minted and written. `OnePopoverOnAnchor` forces the
		// fallback, which writes none.
		function RootScopedPopover({ testId }: { testId: string }) {
			const anchorRef = useRef<HTMLButtonElement | null>(null);
			const popoverRef = useRef<HTMLDivElement | null>(null);

			useAnchoredPopover({ anchorRef, popoverRef, placement: {}, isOpen: true });

			return (
				<>
					<button ref={anchorRef} data-testid={`${testId}-trigger`}>
						trigger
					</button>
					<div ref={popoverRef} data-testid={`${testId}-popover`}>
						popover
					</div>
				</>
			);
		}

		function expectDistinctNames(): void {
			const firstName = screen.getByTestId('first-trigger').style.getPropertyValue('anchor-name');
			const secondName = screen.getByTestId('second-trigger').style.getPropertyValue('anchor-name');

			expect(firstName.startsWith('--anchor-')).toBe(true);
			expect(secondName.startsWith('--anchor-')).toBe(true);
			expect(secondName).not.toBe(firstName);

			// Each popover targets its own trigger, not the last anchor in tree order.
			expect(screen.getByTestId('first-popover').style.getPropertyValue('position-anchor')).toBe(
				firstName,
			);
			expect(screen.getByTestId('second-popover').style.getPropertyValue('position-anchor')).toBe(
				secondName,
			);
		}

		it('mints a different name in each client-rendered root', () => {
			// Each `render()` call mounts into its own container with its own React
			// root. A client-rendered root draws `useId()` from a counter global to
			// `react-dom`, so two roots never share a name without any host help.
			render(<RootScopedPopover testId="first" />);
			render(<RootScopedPopover testId="second" />);

			expectDistinctNames();
		});

		it('mints a different name in each HYDRATED root once the host sets an identifierPrefix', () => {
			// A hydrated root derives `useId()` from tree position, so two roots
			// hydrating the same markup mint identical ids, and would mint one name for
			// two anchors. React's remedy is a per-root `identifierPrefix`, on the
			// server render and on `hydrateRoot`. The hook documents that as the host's
			// job, the same job it already has for the popover's `id`; this pins that
			// the name honours it. The prefixes carry a space and a `.`, which a CSS
			// `<dashed-ident>` cannot, to pin the sanitising too.
			function renderMarkup({
				testId,
				identifierPrefix,
			}: {
				testId: string;
				identifierPrefix: string;
			}): string {
				// React 18 warns that `useLayoutEffect` does nothing on the server;
				// React 19 does not. Swallowed so the test reads the same on both.
				const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
				try {
					return renderToString(<RootScopedPopover testId={testId} />, { identifierPrefix });
				} finally {
					consoleError.mockRestore();
				}
			}

			const mounts = ['first', 'second'].map((testId) => {
				const identifierPrefix = `${testId} root.`;
				const mountNode = document.createElement('div');
				mountNode.innerHTML = renderMarkup({ testId, identifierPrefix });
				document.body.appendChild(mountNode);
				return { testId, identifierPrefix, mountNode };
			});

			const roots: Root[] = [];
			act(() => {
				mounts.forEach(({ testId, identifierPrefix, mountNode }) => {
					roots.push(
						hydrateRoot(mountNode, <RootScopedPopover testId={testId} />, { identifierPrefix }),
					);
				});
			});

			try {
				expectDistinctNames();

				const dashedIdent = /^--anchor-[A-Za-z0-9_-]+$/;
				expect(screen.getByTestId('first-trigger').style.getPropertyValue('anchor-name')).toMatch(
					dashedIdent,
				);
				expect(screen.getByTestId('second-trigger').style.getPropertyValue('anchor-name')).toMatch(
					dashedIdent,
				);
			} finally {
				act(() => {
					roots.forEach((root) => root.unmount());
				});
				mounts.forEach(({ mountNode }) => mountNode.remove());
			}
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

			// Anchor name follows the hook's `--anchor-{id}` convention, minted from
			// `useId()`.
			expect(triggerAnchorName.startsWith('--anchor-')).toBe(true);
			// Both popovers must reference the same anchor name as the
			// trigger. That is the whole point of the fix. Previously the
			// second call generated its own id and overwrote
			// `trigger.style.anchorName`, leaving the first popover's
			// `position-anchor` pointing at a stale name.
			expect(aboveAnchor).toBe(triggerAnchorName);
			expect(belowAnchor).toBe(triggerAnchorName);
		});

		describe('cleanup behaviour when popovers unmount', () => {
			// The invariant we are protecting: after any popover unmounts,
			// every remaining popover's `position-anchor` must still
			// reference a non-empty `anchor-name` on the trigger.
			//
			// `useAnchoredPopover` writes `anchor-name` to the trigger and
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
				// `use-anchored-popover.tsx` for the rationale.
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
				// `useAnchoredPopover` never removes `anchor-name` from the
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
		// `useAnchoredPopover` resolves the placement and compares the
		// shape, so a shape-equal new reference must not cause the
		// `useLayoutEffect` to tear down and re-run all the DOM style writes.
		// These tests pin that behaviour.

		function Probe({
			placement,
			onRender,
		}: {
			placement: Parameters<typeof useAnchoredPopover>[0]['placement'];
			onRender: () => void;
		}) {
			const anchorRef = useRef<HTMLButtonElement | null>(null);
			const popoverRef = useRef<HTMLDivElement | null>(null);

			useAnchoredPopover({
				anchorRef: anchorRef,
				popoverRef,
				placement,
				forceFallbackPositioning: true,
				isOpen: true,
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

		it('does not re-run the effect when a shape-equal placement object is passed', () => {
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

		it('does not re-run the effect on a re-render that changes nothing', () => {
			// Every dependency is either a stable ref object or a primitive, so a
			// parent re-render on its own must not re-apply any style.
			const onRender = jest.fn();
			const placement = { axis: 'block', edge: 'end' } as const;

			const { rerender } = render(<Probe placement={placement} onRender={onRender} />);

			const popover = screen.getByTestId('popover');
			const setPropertySpy = jest.spyOn(popover.style, 'setProperty');

			rerender(<Probe placement={placement} onRender={onRender} />);

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

		it('"just works" with an empty placement - applies defaults and stays stable across re-renders', () => {
			const onRender = jest.fn();

			// `placement` is required, but every field inside it is optional, so
			// `{}` must apply the full default placement (centered below the
			// trigger, `space.100` gap, no shift).
			const { rerender } = render(<Probe placement={{}} onRender={onRender} />);

			const popover = screen.getByTestId('popover');

			// The popover must have been positioned (the JS fallback
			// sets `inset: auto` and `margin: 0` as base styles -
			// JSDom normalises `0` to `0px` for the `margin` shorthand).
			expect(popover.style.getPropertyValue('margin')).toBe('0px');
			expect(popover.style.getPropertyValue('inset')).toBe('auto');

			// Re-rendering with the same empty placement must not re-run the
			// effect - a fresh `{}` resolves to the same shape as last time.
			const setPropertySpy = jest.spyOn(popover.style, 'setProperty');
			rerender(<Probe placement={{}} onRender={onRender} />);
			expect(setPropertySpy).not.toHaveBeenCalled();
			setPropertySpy.mockRestore();
		});

		it('does re-run the effect when the placement shape actually changes', () => {
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

		it('does re-run the effect when only minSize changes', () => {
			const onRender = jest.fn();

			const { rerender } = render(
				<Probe placement={{ axis: 'block', edge: 'end', minSize: 10 }} onRender={onRender} />,
			);

			const popover = screen.getByTestId('popover');
			const setPropertySpy = jest.spyOn(popover.style, 'setProperty');

			rerender(
				<Probe placement={{ axis: 'block', edge: 'end', minSize: 20 }} onRender={onRender} />,
			);

			expect(setPropertySpy).toHaveBeenCalled();

			setPropertySpy.mockRestore();
		});
	});
});
