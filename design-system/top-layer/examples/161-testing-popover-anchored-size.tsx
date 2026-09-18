/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode, useCallback, useRef, useState } from 'react';

import { jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { getAriaForTrigger } from '@atlaskit/top-layer/get-aria-for-trigger';
import { PopoverSurface } from '@atlaskit/top-layer/popover-surface';
import { Popover } from '@atlaskit/top-layer/popover/popover';
import { type TPlacementOptions } from '@atlaskit/top-layer/resolve-placement';
import { useAnchoredPopover } from '@atlaskit/top-layer/use-anchored-popover';
import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';

/**
 * Mirrors `useAnchoredPopover`'s `TPopoverAxisSize`, which is module-scoped and
 * so not importable from outside the package.
 */
type TAxisSize = 'content' | 'match-anchor' | 'min-anchor' | 'max-available';

const AXIS_SIZES: TAxisSize[] = ['content', 'match-anchor', 'min-anchor', 'max-available'];

const styles = cssMap({
	// The trigger is absolutely positioned so a test can control exactly how much
	// space is left on each side of it. `100vw`/`100vh` rather than `100%` so the
	// page never scrolls, and `overflow: hidden` so the trigger can be LARGER than
	// the viewport, which is what the unconditional backstop is for.
	page: {
		position: 'relative',
		width: '100vw',
		height: '100vh',
		margin: 0,
		overflow: 'hidden',
	},
	// The user-agent border and padding are removed so the rendered box is exactly
	// the requested size in every engine, and a test can derive the space on each
	// side from the offset alone.
	trigger: {
		position: 'absolute',
		border: 'none',
		padding: 0,
		margin: 0,
	},
	// No inline size, so the popover's width comes from its content and CAN wrap.
	wrappableContent: {
		whiteSpace: 'normal',
	},
	wrappableWord: {
		display: 'inline-block',
		inlineSize: '120px',
	},
});

/**
 * Validates rather than casting, so an unknown value cannot reach the hook.
 */
function readAxisSize({ params, name }: { params: URLSearchParams; name: string }): TAxisSize {
	const raw = params.get(name);
	return AXIS_SIZES.find((value) => value === raw) ?? 'content';
}

function readAlign({ params }: { params: URLSearchParams }): 'start' | 'center' | 'end' {
	const raw = params.get('align');
	if (raw === 'start') {
		return 'start';
	}
	if (raw === 'end') {
		return 'end';
	}
	return 'center';
}

function readPlacement({ params }: { params: URLSearchParams }): TPlacementOptions {
	const minSize = params.get('minSize');
	return {
		axis: params.get('axis') === 'inline' ? 'inline' : 'block',
		edge: params.get('edge') === 'start' ? 'start' : 'end',
		align: readAlign({ params }),
		// An absent param must stay ABSENT rather than becoming `0`: that is what
		// lets the default flip floor apply, and `0` is the opt-out.
		...(minSize === null ? {} : { minSize: Number(minSize) }),
	};
}

function readNumber({
	params,
	name,
	fallback,
}: {
	params: URLSearchParams;
	name: string;
	fallback: number;
}): number {
	const raw = params.get(name);
	return raw === null ? fallback : Number(raw);
}

/**
 * Test fixture for `useAnchoredPopover`'s PER-AXIS sizing. Where
 * `160-testing-popover-fit-available-space` drives one whole-popover `fit`
 * switch, this names each axis independently and exposes `placement.minSize`, so
 * the rules that only appear when the two axes DISAGREE are reachable.
 *
 * ONE popover per page load, deliberately: measuring several open popovers on a
 * single page gave inconsistent readings.
 *
 * Query params:
 *
 * - `axis`, `edge`, `align`: the placement (defaults `block` / `end` / `center`)
 * - `inlineSize`, `blockSize`: `content` (default) / `match-anchor` /
 *   `min-anchor` / `max-available`
 * - `minSize`: `placement.minSize` in px. Omit for "not specified", which lets
 *   the default flip floor apply; `0` opts out of it.
 * - `triggerBlockStart`, `triggerInlineStart`: absolute trigger offset in px.
 *   Negative values are allowed.
 * - `triggerBlockSize`, `triggerInlineSize`: the trigger's size in px (defaults
 *   20 x 80, deliberately not square so a wrong-axis read is visible). Larger
 *   than the viewport is allowed.
 * - `contentBlockSize`, `contentInlineSize`: the content's intrinsic size in px
 * - `wrappableContent`: `true` renders two 120px inline blocks instead of the
 *   fixed box, so the popover CAN wrap (max-content 240px, min-content 120px,
 *   independent of the font). A fixed box's min-content width IS its max-content
 *   width, which makes "wrapped" and "overflowed" indistinguishable.
 * - `forceFallback`: `true` to force the JavaScript positioning path
 */
export default function TestingPopoverAnchoredSize(): ReactNode {
	const params = new URLSearchParams(window.location.search);
	const placement = readPlacement({ params });
	const inlineSize = readAxisSize({ params, name: 'inlineSize' });
	const blockSize = readAxisSize({ params, name: 'blockSize' });
	const shouldForceFallback = params.get('forceFallback') === 'true';
	const triggerBlockStart = readNumber({ params, name: 'triggerBlockStart', fallback: 0 });
	const triggerInlineStart = readNumber({ params, name: 'triggerInlineStart', fallback: 0 });
	const triggerBlockSize = readNumber({ params, name: 'triggerBlockSize', fallback: 20 });
	const triggerInlineSize = readNumber({ params, name: 'triggerInlineSize', fallback: 80 });
	const contentBlockSize = readNumber({ params, name: 'contentBlockSize', fallback: 100 });
	const contentInlineSize = readNumber({ params, name: 'contentInlineSize', fallback: 100 });
	const hasWrappableContent = params.get('wrappableContent') === 'true';

	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const popoverRef = useRef<HTMLDivElement>(null);
	const popoverId = usePopoverId();
	const toggle = useCallback(() => setIsOpen((previous) => !previous), []);
	const close = useCallback(() => setIsOpen(false), []);

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
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- the offset and size are test parameters, so they cannot be static styles
					insetBlockStart: `${triggerBlockStart}px`,
					insetInlineStart: `${triggerInlineStart}px`,
					blockSize: `${triggerBlockSize}px`,
					inlineSize: `${triggerInlineSize}px`,
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
				label="Anchored popover"
				placement={placement}
			>
				{/*
				 * `PopoverSurface` owns `overflow: auto` and the `box-shadow` on one
				 * element, so it is both what the cap has to reach and what scrolls.
				 */}
				<PopoverSurface>
					{hasWrappableContent ? (
						// max-content 240px and min-content 120px whatever font the engine
						// has, so wrap-vs-overflow does not ride on text metrics.
						<div data-testid="popover-content" css={styles.wrappableContent}>
							<span css={styles.wrappableWord}>first</span>{' '}
							<span css={styles.wrappableWord}>second</span>
						</div>
					) : (
						<div
							data-testid="popover-content"
							style={{
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- the content size is a test parameter, so it cannot be a static style
								blockSize: `${contentBlockSize}px`,
								inlineSize: `${contentInlineSize}px`,
							}}
						>
							Anchored content
						</div>
					)}
				</PopoverSurface>
			</Popover>
		</div>
	);
}
