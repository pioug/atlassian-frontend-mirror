/**
 * FF-on implementation of `@atlaskit/popper/unsafe-imperative`'s
 * `createPopper`.
 *
 * `@atlaskit/top-layer`'s positioning primitives are React hooks, and this
 * entry point is imperative. Rather than growing an imperative positioning API
 * on top-layer for a frozen escape hatch, this file brings its own React: it
 * owns a detached root rendering `AnchorBridge` / `PointBridge`, components that
 * render nothing and exist only to run `useAnchorPosition` /
 * `useAnchorPositionAtPoint` against the DOM nodes the caller already owns.
 *
 * The upside is that the imperative path consumes exactly the same public
 * top-layer API as the React `<Popper>` adapter in `popper-top-layer.tsx`, so
 * the CSS Anchor Positioning path, the JS fallback, and virtual-anchor handling
 * are shared rather than reimplemented — and `@atlaskit/top-layer` gains no new
 * public API for it.
 *
 * **This is deliberately not a full-parity Popper.js implementation.** The
 * entry point is frozen with a single grandfathered caller (editor's
 * `VanillaTooltip`) and the ratchet blocks new ones, so the goal is reasonable,
 * well-documented behaviour for a niche surface rather than byte-for-byte
 * engine equivalence. See
 * `top-layer/notes/migrations/popper-migration.md` -> "Imperative
 * `createPopper` adapter".
 */
import React, { useRef } from 'react';

import type {
	Instance,
	Modifier,
	Obj,
	OptionsGeneric,
	Placement,
	PositioningStrategy,
	Rect,
	State,
	VirtualElement,
} from '@popperjs/core';
import { createRoot } from 'react-dom/client';

import { getDocument } from '@atlaskit/browser-apis';
import { fromLegacyPlacement } from '@atlaskit/top-layer/placement-map/index';
import type { TPlacementOptions } from '@atlaskit/top-layer/resolve-placement';
import { useAnchorPosition } from '@atlaskit/top-layer/use-anchor-position';
import { useAnchorPositionAtPoint } from '@atlaskit/top-layer/use-anchor-position-at-point';

import { isPageRtl } from './internal/is-page-rtl';
import { rectPointForPlacement } from './internal/rect-point-for-placement';
import { toLegacyPlacement } from './internal/to-legacy-placement';

/**
 * Popper.js defaults, applied when the caller omits them.
 * <https://popper.js.org/docs/v2/constructors/#options>
 */
const DEFAULT_PLACEMENT: Placement = 'bottom';
const DEFAULT_STRATEGY: PositioningStrategy = 'absolute';

/**
 * Popper.js' `offset` modifier defaults to `[0, 0]` — no gap. This differs from
 * ADS `<Popper>` (`[0, 8]`) and from top-layer's own `space.100` default, so the
 * offset is always passed explicitly: a caller that asked for no offset keeps
 * getting none.
 */
const NO_OFFSET: [along: number, away: number] = [0, 0];

type TResolvedOptions = OptionsGeneric<Partial<Modifier<string, Obj>>>;

/**
 * Fills in Popper.js' option defaults so `state.options` is always complete,
 * matching what the real engine exposes.
 */
function resolveOptions(options: Partial<TResolvedOptions> | undefined): TResolvedOptions {
	return {
		placement: options?.placement ?? DEFAULT_PLACEMENT,
		modifiers: options?.modifiers ?? [],
		strategy: options?.strategy ?? DEFAULT_STRATEGY,
		onFirstUpdate: options?.onFirstUpdate,
	};
}

/**
 * Reads the `offset` modifier's `[skidding, distance]` tuple.
 *
 * Popper.js merges duplicate modifier entries by name with later entries
 * winning, so the last `offset` entry is the one that counts. A disabled
 * modifier, or a function-valued `offset` (which Popper.js resolves per-update
 * against live rects and CSS Anchor Positioning has no equivalent for), falls
 * back to no offset.
 */
function getOffset(modifiers: TResolvedOptions['modifiers']): [along: number, away: number] {
	const offsetModifier = modifiers.filter((modifier) => modifier?.name === 'offset').pop();

	if (!offsetModifier || offsetModifier.enabled === false) {
		return NO_OFFSET;
	}

	const offset = (offsetModifier.options as { offset?: unknown } | undefined)?.offset;
	if (!Array.isArray(offset)) {
		return NO_OFFSET;
	}

	const [along, away] = offset as Array<number | null | undefined>;
	return [along ?? 0, away ?? 0];
}

/**
 * Maps resolved Popper.js options onto top-layer's placement input.
 *
 * Called from the bridge components' render, not memoized: the bridge remounts
 * on every option change (see `createPopperTopLayer`), so a `useMemo` cache
 * could never be read, and `useAnchorPosition` already re-derives a stable
 * placement from the primitive fields so a fresh object identity per render
 * costs nothing downstream.
 */
function toTopLayerPlacement(options: TResolvedOptions): TPlacementOptions {
	return fromLegacyPlacement({
		legacy: toLegacyPlacement(options.placement),
		offset: getOffset(options.modifiers),
	});
}

/**
 * Neutralises the UA stylesheet's `[popover]` rules for an element this adapter
 * promoted, so promotion is a change of paint order and nothing else.
 *
 * The UA sheet gives every popover `border: solid`, `padding: 0.25em`,
 * `overflow: auto`, `width` / `height: fit-content`, `color: CanvasText` and
 * `background-color: Canvas`. `<Popover>` overrides these in its own Compiled
 * class, but the element here belongs to the caller, so inline styles are the
 * wrong tool: they would beat the caller's own stylesheet rather than only the
 * UA's. A zero-specificity `:where()` rule in the author origin is exactly the
 * right precedence — it always beats the UA sheet and always loses to any
 * caller selector.
 *
 * `inline-size` is deliberately left at the UA default, matching `<Popover>`
 * (which keeps it for anchor-width matching).
 */
const PROMOTED_ATTRIBUTE = 'data-ds--popper-promoted';

function ensurePromotedStyles(element: HTMLElement): void {
	// Injected into the element's own document rather than a module-cached one,
	// so a caller positioning inside an iframe still gets the reset.
	const document = element.ownerDocument;
	if (document.querySelector(`style[${PROMOTED_ATTRIBUTE}]`)) {
		return;
	}
	const style = document.createElement('style');
	style.setAttribute(PROMOTED_ATTRIBUTE, 'true');
	style.textContent = `:where([${PROMOTED_ATTRIBUTE}]){border-style:none;padding:0;overflow:visible;block-size:auto;color:inherit;background-color:transparent;}`;
	document.head.appendChild(style);
}

/**
 * Lifts the caller's element into the browser top layer.
 *
 * Uses `popover="manual"` so the element gets top-layer promotion without light
 * dismiss and without joining the auto-dismiss stack - the caller keeps owning
 * visibility, which matches Popper.js' contract (and mirrors the
 * `<Popover mode="manual">` the React `<Popper>` FF-on path uses).
 *
 * Returns `undefined` when no promotion happened: the element is already a
 * popover / `<dialog>` (the caller owns the top layer already), or the browser
 * has no Popover API. The latter is unpositioned flag-on — but so is every
 * other `@atlaskit/top-layer` consumer, because the whole stack is built on the
 * Popover API. It is not a gap specific to this adapter.
 */
function promoteToTopLayer(element: HTMLElement): (() => void) | undefined {
	if (element.hasAttribute('popover') || element.tagName === 'DIALOG') {
		return undefined;
	}
	if (typeof element.showPopover !== 'function') {
		return undefined;
	}

	ensurePromotedStyles(element);
	element.setAttribute(PROMOTED_ATTRIBUTE, 'true');
	element.setAttribute('popover', 'manual');
	try {
		element.showPopover();
	} catch {
		// `showPopover()` throws `InvalidStateError` for a disconnected element.
		// Leave the element in normal flow rather than stranding it as a hidden,
		// never-shown popover.
		element.removeAttribute('popover');
		element.removeAttribute(PROMOTED_ATTRIBUTE);
		return undefined;
	}

	return function undoPromotion() {
		try {
			element.hidePopover();
		} catch {}
		element.removeAttribute('popover');
		element.removeAttribute(PROMOTED_ATTRIBUTE);
	};
}

const EMPTY_RECT: Rect = { width: 0, height: 0, x: 0, y: 0 };

/**
 * `VirtualElement.getBoundingClientRect()` is typed as `ClientRect | DOMRect`,
 * and `ClientRect` has no `x` / `y` - so read the physical edges instead.
 */
function toRect(rect: { width: number; height: number; left: number; top: number }): Rect {
	return { width: rect.width, height: rect.height, x: rect.left, y: rect.top };
}

// Both bridges below render nothing. They exist purely so top-layer's
// positioning hooks can run against elements that live outside any React tree,
// and they mirror the anchor resolution in `popper-top-layer.tsx`. Which one is
// used is decided when the instance is created and never changes, so each calls
// exactly one hook unconditionally.
//
// Every prop is constant for the lifetime of a mount: the elements are fixed at
// creation, and an option change remounts the bridge (see
// `createPopperTopLayer`). So props go straight into refs with no re-assignment,
// and closures over them cannot go stale.

/**
 * Real DOM anchor: `useAnchorPosition` gives it `anchor-name` on the CSS Anchor
 * Positioning path, and measures it on the JS fallback.
 */
function AnchorBridge({
	anchor,
	popover,
	options,
}: {
	anchor: HTMLElement;
	popover: HTMLElement;
	options: TResolvedOptions;
}): null {
	const anchorRef = useRef<HTMLElement | null>(anchor);
	const popoverRef = useRef<HTMLElement | null>(popover);

	useAnchorPosition({
		anchorRef,
		popoverRef,
		placement: toTopLayerPlacement(options),
		isOpen: true,
	});

	return null;
}

/**
 * Anything that is not a real DOM element (a Popper.js `VirtualElement`, an SVG
 * element, an element from another realm) cannot carry `anchor-name`, so its
 * rect is reduced to the geometrically-equivalent point for the requested
 * placement and handed to `useAnchorPositionAtPoint`, which owns the synthetic
 * anchor.
 */
function PointBridge({
	reference,
	popover,
	options,
}: {
	reference: Element | VirtualElement;
	popover: HTMLElement;
	options: TResolvedOptions;
}): null {
	const popoverRef = useRef<HTMLElement | null>(popover);
	const placement = toTopLayerPlacement(options);

	useAnchorPositionAtPoint({
		popoverRef,
		placement,
		isOpen: true,
		getPoint: () =>
			rectPointForPlacement({
				rect: reference.getBoundingClientRect() as DOMRect,
				placement,
				isRtl: isPageRtl(),
			}),
	});

	return null;
}

/**
 * FF-on `createPopper`. Gated behind `platform-dst-top-layer` from
 * `entry-points/unsafe-imperative.tsx`.
 *
 * ### Option handling
 *
 * | Tier      | Options                                                    |
 * | --------- | ---------------------------------------------------------- |
 * | **Keep**  | `placement`, the `offset` modifier's `[skidding, distance]` |
 * | **No-op** | `strategy`, every other modifier (`flip`, `preventOverflow`, `eventListeners`, `arrow`, custom) |
 * | **Drop**  | the Popper.js modifier pipeline itself                      |
 *
 * No-op options are accepted for source compatibility and produce no dev
 * warning: flipping and overflow handling move to CSS
 * `position-try-fallbacks`, and top-layer rendering is always browser-fixed so
 * `strategy` has nothing to select.
 *
 * ### Instance surface
 *
 * `update` / `forceUpdate` / `setOptions` remount the bridge by bumping its
 * `key`, which is what re-runs the positioning hook from scratch. The remount is
 * load-bearing on both bridges:
 *
 * - `PointBridge` — `useAnchorPositionAtPoint` latches its point once per
 *   activation, so nothing else re-reads a virtual reference's rect.
 * - `AnchorBridge` — on the JS fallback, the hook only measures when its effect
 *   runs (plus its own scroll / resize listeners), so a remount is how
 *   `update()` honours its "re-measure now" contract for an anchor that moved
 *   for some other reason. On the CSS path the browser tracks the anchor and the
 *   remount is a no-op rewrite of the same properties.
 *
 * `state` carries live `elements`, `options`, `placement`, `strategy` and
 * `rects`; the modifier-pipeline fields (`styles`, `attributes`,
 * `modifiersData`, `orderedModifiers`, `scrollParents`) are inert because there
 * is no pipeline.
 *
 * ### ⏱️ Positioning and teardown are asynchronous
 *
 * Every call that changes positioning (`createPopper`, `setOptions`, `update`,
 * `forceUpdate`) renders the bridge and returns before React commits, so the
 * styles land on the next tick. Popper.js behaves the same way — its first
 * update is async — so callers that already tolerate that are unaffected. A
 * caller that reveals its element in the same task should keep it hidden until
 * at least the next frame (as editor's `VanillaTooltip` does).
 *
 * `destroy()` is the same shape: it takes effect on a microtask (see the
 * comment on the call itself), so the caller's element keeps its positioning
 * styles until then.
 */
export function createPopperTopLayer(
	reference: Element | VirtualElement,
	popper: HTMLElement,
	options?: Partial<TResolvedOptions>,
): Instance {
	let currentOptions = resolveOptions(options);
	let isDestroyed = false;
	// Used as the bridge's `key` and bumped by every call that re-positions, so
	// the bridge remounts and its hook re-runs from scratch. See "Instance
	// surface" above for why that is load-bearing on both bridges.
	let generation = 0;

	// Which bridge to render is fixed here, for the instance's lifetime.
	const anchor: HTMLElement | null = reference instanceof HTMLElement ? reference : null;

	// Promote BEFORE the first render so the popover is already open when the
	// hooks' layout effects run - `useAnchorPosition`'s JS fallback detects an
	// already-open popover and measures immediately instead of waiting for a
	// `toggle` event it would otherwise have missed.
	const undoPromotion = promoteToTopLayer(popper);

	// React host for the bridge. The bridge renders `null`, so this container
	// stays empty and is deliberately never appended to the document: React only
	// needs an element to own, and effects run either way.
	const container = getDocument()?.createElement('div');
	const root = container ? createRoot(container) : null;

	const state: State = {
		elements: { reference, popper },
		options: currentOptions,
		placement: currentOptions.placement,
		strategy: currentOptions.strategy,
		orderedModifiers: [],
		rects: { reference: EMPTY_RECT, popper: EMPTY_RECT },
		scrollParents: { reference: [], popper: [] },
		styles: {},
		attributes: {},
		modifiersData: {},
		reset: false,
	};

	function render(): void {
		if (!root || isDestroyed) {
			return;
		}

		// Deliberately NOT wrapped in `flushSync`. React commits this on its own
		// schedule, so positioning lands on the next tick rather than before this
		// call returns. Popper.js is the same (its first update is async), and
		// forcing a sync flush is not an option: a React consumer calling
		// `createPopper` from an effect would trip
		// "flushSync was called from inside a lifecycle method", which React
		// downgrades to an async commit anyway — so the flush buys a console
		// error and nothing else.
		root.render(
			anchor ? (
				<AnchorBridge key={generation} anchor={anchor} popover={popper} options={currentOptions} />
			) : (
				<PointBridge
					key={generation}
					reference={reference}
					popover={popper}
					options={currentOptions}
				/>
			),
		);

		// Measured at call time, so `rects.popper` reflects the position before
		// this render commits. Popper.js' `state` is likewise only as fresh as the
		// last completed update.
		state.rects = {
			reference: toRect(reference.getBoundingClientRect()),
			popper: toRect(popper.getBoundingClientRect()),
		};
	}

	render();

	// Popper.js resolves `onFirstUpdate` asynchronously, after the first update
	// completes. Match that timing so callers that mutate state in the callback
	// do not do so during their own `createPopper()` call.
	const { onFirstUpdate } = currentOptions;
	if (onFirstUpdate) {
		Promise.resolve().then(() => {
			if (!isDestroyed) {
				onFirstUpdate(state);
			}
		});
	}

	return {
		state,
		update() {
			generation += 1;
			render();
			return Promise.resolve(state);
		},
		forceUpdate() {
			generation += 1;
			render();
		},
		setOptions(setOptionsAction) {
			if (isDestroyed) {
				return Promise.resolve(state);
			}

			const next =
				typeof setOptionsAction === 'function'
					? setOptionsAction(currentOptions)
					: setOptionsAction;
			currentOptions = resolveOptions({ ...currentOptions, ...next });

			state.options = currentOptions;
			state.placement = currentOptions.placement;
			state.strategy = currentOptions.strategy;

			generation += 1;
			render();

			return Promise.resolve(state);
		},
		destroy() {
			if (isDestroyed) {
				return;
			}
			// Set synchronously so a `render()` already in flight is dropped and
			// `onFirstUpdate` never fires after `destroy()`.
			isDestroyed = true;

			// Deferred to a microtask, NOT run inline. `root.unmount()` is
			// synchronous, and React logs "Attempted to synchronously unmount a
			// root while React was already rendering" when it is called during a
			// commit — which is exactly where a React caller destroys, since
			// effect cleanups run in the commit phase. React also downgrades the
			// unmount to an async commit there, so inline teardown would restore
			// the hooks' styles *after* `undoPromotion()` had already run,
			// inverting the order below. A microtask leaves the commit and gets
			// both: no warning, and teardown in the right order.
			queueMicrotask(() => {
				// Unmounting runs the hooks' cleanups, which restore every inline
				// style they wrote and remove any synthetic anchor.
				root?.unmount();
				undoPromotion?.();
			});
		},
	};
}
