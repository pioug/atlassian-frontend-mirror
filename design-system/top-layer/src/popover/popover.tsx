/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, type Ref, useCallback, useId, useMemo, useRef } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';
import { bind, bindAll } from 'bind-event-listener';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import once from '@atlaskit/ds-lib/once';
import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';
import { token } from '@atlaskit/tokens';

import { requestCloseEventName } from '../internal/closable-popover-contract';
import { isNativeElementOpen } from '../internal/is-native-element-open';
import { layerShowOrder } from '../internal/layer-show';
import {
	resolvePlacement,
	type TPlacementAxis,
	type TPlacementEdge,
} from '../internal/resolve-placement';
import type { TBoostedSurfaceResetCheck } from '../internal/surface-reset';
import { useAnimatedVisibility } from '../internal/use-animated-visibility';
import { useFocusWrap } from '../internal/use-focus-wrap';
import { useInitialFocus } from '../internal/use-initial-focus';
import { type TPopoverCloseReason, type TPopoverForwardedProps } from './types';

/**
 * Native restoration only covers the first popover in an auto/hint stack, not each nested popover.
 * This fallback also supports manual popovers, which have no native restoration target.
 * See https://html.spec.whatwg.org/multipage/popover.html#show-popover (step 15.8).
 */
function restoreFocus({
	popover,
	focusRestorationTarget,
}: {
	popover: HTMLElement;
	focusRestorationTarget: HTMLElement | null;
}) {
	if (!focusRestorationTarget) {
		return;
	}

	const { ownerDocument } = popover;
	// Native restoration has finished. Preserve focus moved outside the popover.
	const activeElementAfterClose = ownerDocument.activeElement;
	// Before close, we checked that focus was inside. Body can now mean focus was lost during close.
	if (activeElementAfterClose === ownerDocument.body || popover.contains(activeElementAfterClose)) {
		// Match native popover restoration, which does not scroll the viewport.
		focusRestorationTarget.focus({ preventScroll: true });
	}
}

/**
 * Detects `popover="hint"` support via DOM reflection. SSR-safe, cached.
 */
const supportsPopoverHint = once((): boolean => {
	if (typeof document === 'undefined') {
		return false;
	}
	// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- feature detection
	const element = document.createElement('div');
	element.setAttribute('popover', 'hint');
	return element.popover === 'hint';
});

/**
 * **Surface reset**
 *
 * The host is still a DOM child of its trigger for inheritance, so it inherits
 * values like `pointer-events: none` or `white-space: nowrap`. Resets them to
 * what `<body>` gave the portal path. `font` and direction still inherit.
 * Not `all: initial`: that would also override the UA `[popover]` rules.
 *
 * `color` is a reset too: the UA `[popover]` rule sets `color: CanvasText`, so
 * the host never inherits a colour. `color.text` is what `<body>` gave the portal
 * path. Not `inherit`, which would take the trigger's colour (for example a link).
 * See `notes/decisions/surface-reset-color.md`.
 *
 * KEEP IN SYNC with `dialog/dialog-content.tsx` (ADS forbids shared styles).
 * The `satisfies` check below catches drift.
 */
const surfaceResetStyles = cssMap({
	root: {
		// Host boost, see `styles.root`.
		'&:defined:defined:defined': {
			pointerEvents: 'auto',
			whiteSpace: 'normal',
			wordBreak: 'normal',
			overflowWrap: 'normal',
			textAlign: 'start',
			textIndent: '0',
			textTransform: 'none',
			color: token('color.text'),
		},
	},
});

true satisfies TBoostedSurfaceResetCheck<
	typeof surfaceResetStyles.root,
	'&:defined:defined:defined'
>;

const styles = cssMap({
	root: {
		/**
		 * **Host specificity boost**
		 *
		 * The host renders inline, so consumer rules like `.toolbar > div` can land on
		 * it. Tripling the selector makes it (0,4,0): one class level above the most
		 * specific such rule in AFM (0,3,1), but below IDs, so consumers can still opt
		 * out. Not `!important`, which breaks 33 of 48 measured sites. Values match the
		 * unstyled host, so nothing changes until a rule competes. Inline styles and
		 * animations still win. `display` is keyed on `:popover-open`; the rest on
		 * `:defined`, which always matches a built-in element, so it holds during the
		 * exit. Not `[popover]`, for consistency with `Dialog`, which has no
		 * always-present attribute. Not `&&&&`, which needs a `no-unsafe-selectors`
		 * disable that the ratchet counts.
		 * See `notes/decisions/host-specificity-boost.md`.
		 */
		'&:popover-open:popover-open:popover-open': {
			/**
			 * Lets a size cap on the host reach the child. Only while open: an author
			 * `display` beats the UA closed `display: none`.
			 * See notes/decisions/fit-available-space.md
			 */
			display: 'flex',
		},
		'&:defined:defined:defined': {
			// The child fill below needs a single row: `flex-shrink` is main-axis only.
			flexDirection: 'row',
			flexWrap: 'nowrap',
			alignItems: 'normal',
			justifyContent: 'normal',
			// The JavaScript fallback writes viewport coordinates.
			position: 'fixed',
			border: 'none',
			padding: 0,
			margin: 0,
			inset: 'auto',
			// For anchor-width matching. See notes/decisions/width-from-anchor-floors.md
			width: 'fit-content',
			// Prevents a WebKit flex collapse. See notes/decisions/safari-popover-flex-collapse.md
			height: 'auto',
			minWidth: 'auto',
			maxWidth: 'none',
			minHeight: 'auto',
			maxHeight: 'none',
			// `position-area` resolves `normal` to its implied alignment.
			alignSelf: 'normal',
			justifySelf: 'normal',
			transform: 'none',
			translate: 'none',
			scale: 'none',
			rotate: 'none',
			opacity: 1,
			overflow: 'visible',
			// Unstyled; consumers apply their own surface.
			background: 'transparent',
		},
		/**
		 * **Content-sized flip floor**
		 *
		 * `useAnchoredPopover` writes its fixed flip floor to
		 * `--ds-popover-flip-floor` and the viewport clamp to
		 * `--ds-popover-flip-floor-limit`, and its `min-{axis}-size` reads this
		 * property first. Where `calc-size()` is supported, the floor is the
		 * content's own size up to the clamp. The popover keeps its size, and flips
		 * whenever its content does not fit. Elsewhere this property is not defined
		 * and the fixed floor applies. Here because an inline style cannot hold
		 * `@supports`.
		 *
		 * KEEP IN SYNC with `getPlacementAxisFloorDeclarations` in
		 * `internal/anchored-popover-size.tsx`.
		 * See notes/decisions/fit-available-space.md
		 */
		'@supports (min-block-size: calc-size(max-content, size))': {
			'--ds-popover-content-sized-flip-floor':
				'calc-size(max-content, min(size, var(--ds-popover-flip-floor-limit)))',
		},
		// `flex-grow` makes the single child fill the host on the main axis, which
		// block flow did for free and a flex item does not.
		//
		// The min-size reset is what makes the host's cap REACH the child: a flex
		// item's automatic minimum size stays content-based while its `overflow` is
		// `visible` (css-flexbox-1 §4.5), and a min beats a max, so a non-scrolling
		// child would stop shrinking at its min-content size.
		//
		// `:where()` contributes no specificity, so a minimum the child sets itself
		// wins. Without it, both are author rules of one class and the cascade falls
		// through to stylesheet order, which Compiled does not sort by specificity.
		// The leading `*` adds no specificity either; it is there only because
		// `cssMap` rejects a selector starting with `:`.
		//
		// Single child is the documented contract (see `children` in `types.tsx`);
		// two element children are two flex items in a ROW at half width each.
		//
		// Not grid: a `minmax(0, 1fr)` track stretches an auto-sized child to the cap
		// but cannot shrink one with an explicit `width`, which `flex-shrink` can.
		// Measured on all three engines; see the decision note.
		//
		// The content-sized flip floor above is reset here so it is not inherited.
		// Its value is resolved against THIS host's floor, so an element further in
		// that `useAnchoredPopover` sizes, without this stylesheet, would take this
		// host's floor instead of its own.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- the child is consumer-owned, so only the host can make it fill; `:where` is the point, see above
		'*:where(&) > *': {
			flexGrow: 1,
			minInlineSize: 0,
			minBlockSize: 0,
			'--ds-popover-content-sized-flip-floor': 'initial',
		},
	},
	motion: {
		// This transition keeps the element visible and in the top layer while the
		// exit animation plays. It needs to be always applied because there can
		// be a delay before entering the `exiting` phase after the popover is dismissed.
		transitionProperty: 'overlay, display',
		transitionDuration: token('motion.duration.xshort'),
		transitionBehavior: 'allow-discrete',
		animationFillMode: 'both',
		'@media (prefers-reduced-motion: reduce)': {
			animationName: 'none',
			transitionDuration: token('motion.duration.instant'),
		},
	},
	enter: {
		animation: 'var(--ds-popover-motion-enter)',
	},
	exit: {
		animation: 'var(--ds-popover-motion-exit)',
	},
});

// Intentionally using `Record<string, string>` instead of `React.CSSProperties`
// to avoid type errors about the CSS variables not being valid property names
const popupMotionStyles: Record<TPlacementAxis, Record<TPlacementEdge, Record<string, string>>> = {
	block: {
		start: {
			'--ds-popover-motion-enter': token('motion.popup.enter.top'),
			'--ds-popover-motion-exit': token('motion.popup.exit.top'),
		},
		end: {
			'--ds-popover-motion-enter': token('motion.popup.enter.bottom'),
			'--ds-popover-motion-exit': token('motion.popup.exit.bottom'),
		},
	},
	inline: {
		start: {
			'--ds-popover-motion-enter': token('motion.popup.enter.left'),
			'--ds-popover-motion-exit': token('motion.popup.exit.left'),
		},
		end: {
			'--ds-popover-motion-enter': token('motion.popup.enter.right'),
			'--ds-popover-motion-exit': token('motion.popup.exit.right'),
		},
	},
};

type TPopoverMode = 'auto' | 'hint' | 'manual';

/**
 * Unopinionated top-layer primitive. Owns visibility and animation only;
 * compose with `useAnchoredPopover` for positioning and sizing.
 *
 * ### 🔌 Visibility
 *
 * - `isOpen={true}` calls `showPopover()` (entry via a keyframe animation).
 * - `isOpen={false}` calls `hidePopover()` (exit via a keyframe animation, kept
 *   visible by an `allow-discrete` transition).
 *
 * ### 📜 Browser dismiss is non-cancellable
 *
 * Per the popover spec, `beforetoggle` is cancellable on open transitions
 * only, not on close. Consumers should update controlled intent by setting
 * `isOpen` to `false` from `onClose`. If controlled intent remains open after
 * native close, the Popover remains closed until the prop changes.
 * `Dialog` asks first instead; see `notes/decisions/dialog-close-flow.md`.
 *
 * - Spec: <https://html.spec.whatwg.org/multipage/popover.html#the-popover-attribute>
 * - <https://github.com/whatwg/html/issues/8973>
 *
 * ### ⚠️ Open from `onClick`, not `onPointerDown`
 *
 * The light-dismiss algorithm captures the pointerdown target before the
 * popover exists and dismisses on the matching pointerup if that target is
 * not in the popover's ancestor chain. Opening during pointerdown hides
 * the popover on the next pointerup.
 *
 * Legacy triggers that must open on mousedown (e.g. `@atlaskit/react-select`)
 * should defer the open past the in-flight gesture; see
 * `Select.openMenuAfterPointerUp`.
 *
 * ### 🪆 Nesting
 *
 * A `Popover` inside another `Popover` or a `Dialog` (in the DOM) shows after
 * it, also when both open in the same commit. So the inner layer is above the
 * outer one, and takes its initial focus after it.
 *
 * Do not design nested layers to open in the same commit. The show order is a
 * defensive fix for React's effect order, not support for the pattern: the API
 * cannot prevent it, and React can show nested layers again together (a
 * Suspense reveal, or an Activity show). See `notes/architecture/layer-show-order.md`.
 */
export const Popover: React.ForwardRefExoticComponent<
	TPopoverForwardedProps & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, TPopoverForwardedProps>(function Popover(
	{
		children,
		mode: modeProp = 'auto',
		onClose,
		onEnterFinish,
		onExitFinish,
		shouldAnimate = false,
		placement,
		testId,
		isOpen,
		enteringAnimationXcss,
		exitingAnimationXcss,
		initialFocusRef,
		UNSAFE__disableInitialAutoFocus = false,
		// ARIA
		role,
		label,
		labelledBy,
		id: idProp,
	},
	ref,
) {
	const autoId = useId();
	const ownRef = useRef<HTMLDivElement>(null);
	const combinedRef = mergeRefs(
		[ownRef, ref as Ref<HTMLDivElement>].filter(Boolean) as Array<Ref<HTMLDivElement>>,
	);
	// `useId()` colons are invalid in CSS selectors and popover target attributes.
	const popoverId = idProp ?? `popover-${autoId.replace(/:/g, '')}`;

	// Keep the semantic callback current without rebinding native lifecycle
	// listeners during the same commit that calls showPopover()/hidePopover().
	const onCloseRef = useRef(onClose);
	useLayoutEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	// A popover with `onClose` is closable (see `closable-popover-contract`).
	// `requestClosePopovers()` asks it to close; the consumer decides.
	const isClosable = Boolean(onClose);

	// `hint` falls back to `auto` when unsupported: closest behavior (light
	// dismiss works), but `auto` participates in the auto-dismiss stack so it
	// will close other `auto` popovers when opened. Acceptable trade-off given
	// shrinking browser set without `hint` support.
	const mode: TPopoverMode = modeProp === 'hint' && !supportsPopoverHint() ? 'auto' : modeProp;

	const popupMotionStyle = useMemo(() => {
		if (!placement || !shouldAnimate) {
			return undefined;
		}
		const { axis, edge } = resolvePlacement({ placement });
		return popupMotionStyles[axis][edge];
	}, [placement, shouldAnimate]);

	// Tracks the close reason, including our own hidePopover() calls.
	const closeReasonRef = useRef<TPopoverCloseReason>('light-dismiss');

	// The last Escape `keydown` while open, kept until its `keyup` (see the listener).
	const escapeKeydownRef = useRef<KeyboardEvent | null>(null);

	// Pre-open focus target, cleared before close when restoration is not eligible.
	const focusRestorationTargetRef = useRef<HTMLElement | null>(null);

	const handleBeforeToggle = useCallback((event: ToggleEvent) => {
		const popover = event.currentTarget;
		if (!(popover instanceof HTMLElement)) {
			return;
		}

		const { ownerDocument } = popover;
		const { activeElement } = ownerDocument;
		if (event.newState === 'open') {
			// The target is never inside the popover. Focus is already inside when StrictMode shows the
			// popover again after content effects moved focus in, or when it reopens during its close.
			// Keep the target from before.
			if (popover.contains(activeElement)) {
				return;
			}
			focusRestorationTargetRef.current =
				activeElement instanceof HTMLElement ? activeElement : null;
			return;
		}

		/**
		 * The browser closes the topmost popover on an Escape `keydown` that no listener prevented,
		 * before the `keyup`. So a close between that `keydown` and its `keyup` is an Escape close,
		 * wherever focus was (for example on the trigger). Our own `hidePopover()` keeps
		 * `programmatic`.
		 *
		 * Known gap: if that Escape closes another layer, and the close of that layer then closes
		 * this popover before the `keyup` (for example its `onClose` opens a modal dialog), this
		 * close is also reported as `escape`.
		 */
		const escapeKeydown = escapeKeydownRef.current;
		escapeKeydownRef.current = null;
		if (
			closeReasonRef.current === 'light-dismiss' &&
			escapeKeydown &&
			!escapeKeydown.defaultPrevented
		) {
			closeReasonRef.current = 'escape';
		}

		/**
		 * Like native restoration, leave external focus alone and skip light dismiss.
		 * Check before closing so focus already on body is not mistaken for focus lost during close.
		 * See https://html.spec.whatwg.org/multipage/popover.html#hide-popover-algorithm (step 20.2).
		 */
		if (closeReasonRef.current === 'light-dismiss' || !popover.contains(activeElement)) {
			focusRestorationTargetRef.current = null;
		}
	}, []);

	const handleToggleClosed = useCallback((event: ToggleEvent) => {
		const popover = event.currentTarget;
		if (!(popover instanceof HTMLElement)) {
			return;
		}

		const focusRestorationTarget = focusRestorationTargetRef.current;
		focusRestorationTargetRef.current = null;
		const reason = closeReasonRef.current;
		// Reset reason so a stale 'escape' from a race with Escape keydown
		// does not corrupt the next browser-dismiss cycle.
		closeReasonRef.current = 'light-dismiss';

		// Run after native restoration, before notifying the consumer, which may move focus itself.
		restoreFocus({ popover, focusRestorationTarget });

		// Programmatic closes are already known to the consumer.
		if (reason !== 'programmatic') {
			onCloseRef.current?.({ reason });
		}
	}, []);

	const { phase, isMounted, onBeforeToggle, onToggle } = useAnimatedVisibility({
		isOpen,
		shouldAnimate,
		elementRef: ownRef,
		onEnterFinish,
		onExitFinish,
	});

	// Focus management: Tab cycling for dialog roles. Initial focus is below,
	// and runs once the popover has shown. Restoration is native for outermost
	// popovers; nested popovers are handled above via the `beforetoggle`
	// snapshot. Passing `phase` keeps `useFocusWrap` attached through the
	// animated-exit window (WCAG 2.4.3 guard). See notes/architecture/focus.md.
	useFocusWrap({ elementRef: ownRef, role, phase });

	// Bind via `useLayoutEffect`, and BEFORE the show/hide layout effect
	// below, so listeners are attached when `showPopover()` synchronously
	// dispatches `beforetoggle`. A regular `useEffect` would miss that
	// first dispatch, dropping the `focusRestorationTargetRef` snapshot
	// and breaking nested-popover focus restoration on close. React runs
	// layout effects in source order on the same commit.
	useLayoutEffect(() => {
		const element = ownRef.current;
		if (!element) {
			return;
		}

		/**
		 * Record an Escape `keydown` for `beforetoggle` to check. On the document, not the popover:
		 * the browser closes the topmost popover on Escape wherever focus is, for example on the
		 * trigger. It closes it before the `keyup`, so forget the record on `keyup`. Then an Escape
		 * that closed another layer, or that a listener prevented, cannot tag a later close of this
		 * one.
		 */
		const unbindEscape = bindAll(
			element.ownerDocument,
			[
				{
					type: 'keydown',
					listener: (event: KeyboardEvent) => {
						// Only an Escape while this popover is open can close it.
						if (event.key !== 'Escape' || !isNativeElementOpen({ element })) {
							return;
						}
						escapeKeydownRef.current = event;
					},
				},
				{
					type: 'keyup',
					listener: (event: KeyboardEvent) => {
						if (event.key === 'Escape') {
							escapeKeydownRef.current = null;
						}
					},
				},
			],
			{ capture: true },
		);
		// The `keyup` does not come here when focus leaves the window, so forget the record then too.
		const unbindBlur = bind(element.ownerDocument.defaultView ?? window, {
			type: 'blur',
			listener: () => {
				escapeKeydownRef.current = null;
			},
		});
		const unbindToggle = bind(element, {
			type: 'toggle',
			listener: (event: ToggleEvent) => {
				if (event.newState === 'closed') {
					handleToggleClosed(event);
				}
				onToggle(event);
			},
		});
		// Snapshot the active element before `useInitialFocus` moves it,
		// then advance the shared visibility lifecycle.
		const unbindBeforeToggle = bind(element, {
			type: 'beforetoggle',
			listener: (event: ToggleEvent) => {
				handleBeforeToggle(event);
				onBeforeToggle(event);
			},
		});

		// `requestClosePopovers()` asks the consumer to close. Nothing is
		// hidden here, so a consumer that keeps `isOpen` stays in sync.
		const unbindRequestClose = bind(element, {
			type: requestCloseEventName,
			listener: () => {
				onCloseRef.current?.({ reason: 'programmatic' });
			},
		});

		return () => {
			unbindEscape();
			unbindBlur();
			unbindToggle();
			unbindBeforeToggle();
			unbindRequestClose();
		};
	}, [handleBeforeToggle, handleToggleClosed, isMounted, onBeforeToggle, onToggle]);

	/**
	 * Initial focus (role-dependent). The show below calls it right after `showPopover()` (a hidden
	 * popover cannot take focus), also when this popover waits for a parent layer (see
	 * `layer-show.tsx`). So a popover's own focus lands before the popovers inside it show and take
	 * focus, in the same task as the open, before the browser paints.
	 */
	const takeInitialFocus = useInitialFocus({
		elementRef: ownRef,
		isEnabled: !UNSAFE__disableInitialAutoFocus,
		initialFocusRef,
		role,
	});

	// Show/hide based on isOpen. `showPopover`/`hidePopover` are no-ops when
	// already in the target state. Try/catch guards `InvalidStateError` on
	// disconnected elements (StrictMode/concurrent/unmount edge cases).
	useLayoutEffect(() => {
		const element = ownRef.current;
		if (!element) {
			return;
		}

		if (isOpen) {
			// Clear stale 'escape' from a prior cycle: the ref outlives
			// the host element, and interrupted close lifecycles may not reach
			// `handleToggleClosed` to reset it.
			closeReasonRef.current = 'light-dismiss';
			escapeKeydownRef.current = null;
			// Shows after a parent layer that opens in the same commit. A defensive fix for React's effect
			// order, not support for the pattern (see `layer-show.tsx`).
			const cancelShow = layerShowOrder.queueOrShow({
				element,
				show() {
					try {
						element.showPopover();
					} catch {}
					takeInitialFocus();
				},
			});
			return () => {
				cancelShow();
				closeReasonRef.current = 'programmatic';
				try {
					element.hidePopover();
				} catch {}
			};
		}

		closeReasonRef.current = 'programmatic';
		try {
			element.hidePopover();
		} catch {}
	}, [isOpen, takeInitialFocus]);

	// Unmount the host once exit completes so it does not leave an empty
	// `role`/`popover` element in the accessibility tree. The element
	// remounts on the next open; the `popoverId` is stable across opens.
	if (!isMounted) {
		return null;
	}

	return (
		<div
			ref={combinedRef}
			id={popoverId}
			// @ts-expect-error -- popover attribute not yet in React types
			// eslint-disable-next-line react/no-unknown-property -- popover attribute not yet in React types
			popover={mode}
			role={role}
			// Keep in sync with `closablePopoverAttribute` (internal/closable-popover-contract).
			data-top-layer-closable={isClosable ? '' : undefined}
			// Keep in sync with `openRequestedAttribute` (internal/open-requested-attribute).
			data-top-layer-open-requested={isOpen ? '' : undefined}
			aria-label={label}
			aria-labelledby={labelledBy}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Motion styles are selected at runtime from the placement.
			style={popupMotionStyle}
			css={[
				styles.root,
				surfaceResetStyles.root,
				shouldAnimate && phase === 'entering' && styles.enter,
				shouldAnimate && phase === 'exiting' && styles.exit,
				shouldAnimate && styles.motion,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(
				shouldAnimate && phase === 'entering' && enteringAnimationXcss,
				shouldAnimate && phase === 'exiting' && exitingAnimationXcss,
			)}
		>
			{children}
		</div>
	);
});
