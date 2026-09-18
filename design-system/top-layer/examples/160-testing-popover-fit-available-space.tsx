/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Mirrors `useAnchoredPopover`'s `TPopoverAxisSize`, which is module-scoped and
 * so not importable from outside the package.
 */
type TAxisSize = 'content' | 'match-anchor' | 'min-anchor' | 'max-available';

const styles = cssMap({
	// The trigger is absolutely positioned so a test can control exactly how much
	// space is left on each side of it. `100vw`/`100vh` rather than `100%` so the
	// page never scrolls.
	page: {
		position: 'relative',
		width: '100vw',
		height: '100vh',
		margin: 0,
		overflow: 'hidden',
	},
	trigger: {
		position: 'absolute',
		// The UA border and padding are removed so the rendered box is exactly
		// this size in every engine.
		width: '80px',
		height: '20px',
		border: 'none',
		padding: 0,
		margin: 0,
	},
	// The OTHER real shape: a surface that refuses to scroll, as several
	// `<Popup shouldFitViewport popupComponent={…}>` containers do. The host's cap
	// can only reach it through the child min-size reset in `Popover`.
	nonScrollingSurface: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		overflow: 'visible',
	},
});

/**
 * Test fixture for `useAnchoredPopover`'s `'max-available'` sizing.
 *
 * ONE popover per page load, deliberately: measuring several open popovers on a
 * single page gave inconsistent readings while this recipe was being developed.
 *
 * Query params:
 *
 * - `axis`, `edge`, `align`: the placement (defaults `block` / `end` / `center`)
 * - `fit`: `true` to fit the available space, on BOTH axes
 * - `triggerBlockStart`, `triggerInlineStart`: absolute trigger offset in px, so
 *   a test can set the space on each side exactly. The trigger is 80x20.
 * - `contentBlockSize`, `contentInlineSize`: the content's intrinsic size in px
 * - `inlineSize`: `content` (default) / `min-anchor` / `match-anchor` /
 *   `max-available`, so the anchor-relative floors and their composition with the
 *   fit caps are reachable. An explicit value wins over `fit` on the inline axis,
 *   which is how `@atlaskit/popup` maps `shouldFitContainer` plus
 *   `shouldFitViewport`.
 * - `animate`: `true` to enable the exit animation, for the closed-state ghost check
 * - `forceFallback`: `true` to force the JavaScript positioning path
 * - `nonScrollingChild`: `true` to swap `PopoverSurface` for a surface that keeps
 *   `overflow: visible`, which is the shape a custom `popupComponent` usually has
 */
export default function TestingPopoverFitAvailableSpace(): ReactNode {
	const params = new URLSearchParams(window.location.search);
	const axis = (params.get('axis') ?? 'block') as 'block' | 'inline';
	const edge = (params.get('edge') ?? 'end') as 'start' | 'end';
	const align = (params.get('align') ?? 'center') as 'start' | 'center' | 'end';
	const shouldFit = params.get('fit') === 'true';
	const shouldAnimate = params.get('animate') === 'true';
	const shouldForceFallback = params.get('forceFallback') === 'true';
	const hasNonScrollingChild = params.get('nonScrollingChild') === 'true';
	const triggerBlockStart = Number(params.get('triggerBlockStart') ?? 0);
	const triggerInlineStart = Number(params.get('triggerInlineStart') ?? 0);
	const contentBlockSize = Number(params.get('contentBlockSize') ?? 100);
	const contentInlineSize = Number(params.get('contentInlineSize') ?? 100);
	const requestedInlineSize = params.get('inlineSize') as TAxisSize | null;

	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

	const placement = { axis, edge, align };

	// One axis would be enough (rule 1 mirrors), but both are spelled out so
	// `inlineSize` can override inline alone.
	const blockSize: TAxisSize = shouldFit ? 'max-available' : 'content';
	const inlineSize: TAxisSize = requestedInlineSize ?? blockSize;

	useAnchoredPopover({
		anchorRef: triggerRef,
		popoverRef,
		placement,
		isOpen,
		inlineSize,
		blockSize,
		forceFallbackPositioning: shouldForceFallback,
	});

	return (
		<div css={styles.page}>
			<button
				ref={triggerRef}
				css={styles.trigger}
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- the offset is a test parameter, so it cannot be a static style
					insetBlockStart: `${triggerBlockStart}px`,
					insetInlineStart: `${triggerInlineStart}px`,
				}}
				onClick={toggle}
				{...getAriaForTrigger({ role: 'dialog', isOpen, popoverId })}
				type="button"
				data-testid="popover-trigger"
			>
				Open
			</button>
			<Popover
				ref={popoverRef}
				id={popoverId}
				isOpen={isOpen}
				onClose={close}
				role="dialog"
				label="Fitting popover"
				shouldAnimate={shouldAnimate}
				placement={placement}
			>
				{/*
				 * `PopoverSurface` owns `overflow: auto` and the `box-shadow` on one
				 * element, so it is both what the cap has to reach and what scrolls.
				 * `nonScrollingChild` swaps in the other real shape.
				 */}
				{hasNonScrollingChild ? (
					<div css={styles.nonScrollingSurface} data-testid="popover-surface">
						<div
							data-testid="popover-content"
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- the content size is a test parameter, so it cannot be a static style
								blockSize: `${contentBlockSize}px`,
								inlineSize: `${contentInlineSize}px`,
							}}
						>
							Fitting content
						</div>
					</div>
				) : (
					<PopoverSurface>
						<div
							data-testid="popover-content"
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- the content size is a test parameter, so it cannot be a static style
								blockSize: `${contentBlockSize}px`,
								inlineSize: `${contentInlineSize}px`,
							}}
						>
							Fitting content
						</div>
					</PopoverSurface>
				)}
			</Popover>
		</div>
	);
}
