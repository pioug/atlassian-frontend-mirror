/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	forwardRef,
	type Ref,
	useCallback,
	useId,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';

import { cssMap, cx, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import once from '@atlaskit/ds-lib/once';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/use-notify-open-layer-observer';
import { token } from '@atlaskit/tokens';

import { isNativeElementOpen } from '../internal/is-native-element-open';
import {
	resolvePlacement,
	type TPlacementAxis,
	type TPlacementEdge,
} from '../internal/resolve-placement';
import {
	type TRoleRequiringAccessibleName,
	type TRoleWithImplicitName,
} from '../internal/role-types';
import type { TSurfaceResetCheck } from '../internal/surface-reset';
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

// Surface reset — neutralises inherited interaction and text-layout properties
// (e.g. `pointer-events: none` from an overlaid controls container and
// `white-space: nowrap` from an `@atlaskit/select` option) that leak into a
// top-layer element because, for CSS inheritance, it is still a DOM child of its
// trigger (top-layer promotion is paint/stacking only; the legacy portal path
// avoided this by rendering at `<body>`). Excludes `color`/`font` (theming) and
// `direction`/`unicode-bidi` (RTL must inherit).
//
// Not `all: initial`: the target is what `<body>` gave the portal path, not the
// spec initial values (UA serif, black, `color-scheme: normal`), and as an author
// declaration it would also override the UA `[popover]` rules (`position: fixed`,
// `display: none` when closed).
//
// KEEP IN SYNC with the identical `surfaceResetStyles` in `dialog/dialog-content.tsx`.
// ADS forbids sharing styles across files (`no-exported-styles` /
// `no-imported-style-values` — Compiled styles are null at runtime), so the reset is
// co-located and duplicated deliberately. The `satisfies` check below fails the
// build if either copy drifts.
const surfaceResetStyles = cssMap({
	root: {
		pointerEvents: 'auto',
		whiteSpace: 'normal',
		wordBreak: 'normal',
		overflowWrap: 'normal',
		textAlign: 'start',
		textIndent: '0',
		textTransform: 'none',
	},
});

true satisfies TSurfaceResetCheck<typeof surfaceResetStyles.root>;

const styles = cssMap({
	root: {
		border: 'none',
		padding: 0,
		margin: 0,
		inset: 'auto',
		overflow: 'visible',
		// Override the UA default `height: fit-content` to prevent a WebKit flex
		// collapse. Width is left as the UA default for anchor-width matching.
		// See notes/decisions/safari-popover-flex-collapse.md
		height: 'auto',
		// Unstyled; consumers apply their own surface.
		background: 'transparent',
		// Lets a size cap on this host reach the popover's content: without a
		// formatting context, percentage resolution uses the parent's COMPUTED size
		// (`auto`), so the child lays out at its intrinsic size and spills out. `row`
		// (the default) is required, because `flex-shrink` applies only to the main
		// axis.
		//
		// Must be scoped to `:popover-open`, so it can be neither an inline style nor
		// a hook: an author `display` beats the UA
		// `[popover]:not(:popover-open) { display: none }` rule, leaving a closed
		// popover laid out at full size as a hit-testable ghost.
		//
		// See notes/decisions/fit-available-space.md.
		'&:popover-open': {
			display: 'flex',
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
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- the child is consumer-owned, so only the host can make it fill; `:where` is the point, see above
		'*:where(&) > *': {
			flexGrow: 1,
			minInlineSize: 0,
			minBlockSize: 0,
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
 * Roles registered with the open layer observer as `popup`, so `closeLayers()`
 * dismisses them. `modal` comes from Dialog only; other layer types are unused.
 */
const POPUP_ROLES: Set<TRoleRequiringAccessibleName | TRoleWithImplicitName> = new Set([
	'menu',
	'listbox',
	'dialog',
	'alertdialog',
	'tree',
	'grid',
]);

/**
 * Unopinionated top-layer primitive. Owns visibility and animation only;
 * compose with `useAnchoredPopover` for positioning and sizing.
 *
 * ### 🔌 Visibility
 *
 * - `isOpen={true}` calls `showPopover()` (entry via `@starting-style`).
 * - `isOpen={false}` calls `hidePopover()` (exit via `allow-discrete`).
 *
 * ### 📜 Browser dismiss is non-cancellable
 *
 * Per the popover spec, `beforetoggle` is cancellable on open transitions
 * only, not on close. Consumers should update controlled intent by setting
 * `isOpen` to `false` from `onClose`. If controlled intent remains open after
 * native close, the Popover remains closed until the prop changes.
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

	// Register with open layer observer so `closeLayers()` and open-count
	// subscriptions work. Only popup-like roles register as `popup`; passive
	// roles (tooltip, status, etc.) leave `type` undefined.
	const handleObserverClose = useCallback(() => {
		onCloseRef.current?.({ reason: 'programmatic' });
	}, []);

	useNotifyOpenLayerObserver({
		type: role && POPUP_ROLES.has(role) ? 'popup' : undefined,
		isOpen,
		onClose: handleObserverClose,
	});

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
			focusRestorationTargetRef.current =
				activeElement instanceof HTMLElement ? activeElement : null;
			return;
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

	// Focus management: initial focus on entry (role-dependent), Tab cycling
	// for dialog roles. Restoration is native for outermost popovers; nested
	// popovers are handled above via the `beforetoggle` snapshot.
	// Passing `phase` keeps `useFocusWrap` attached through the animated-exit
	// window (WCAG 2.4.3 guard). See notes/architecture/focus.md.
	useFocusWrap({ elementRef: ownRef, role, phase });
	useInitialFocus({ elementRef: ownRef, phase, role });

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

		// Tag Escape before the browser processes light dismiss.
		const unbindEscape = bind(element, {
			type: 'keydown',
			listener: (event: KeyboardEvent) => {
				// Ignore Escape events dispatched after native close.
				if (event.key === 'Escape' && isNativeElementOpen({ element })) {
					closeReasonRef.current = 'escape';
				}
			},
			options: { capture: true },
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

		return () => {
			unbindEscape();
			unbindToggle();
			unbindBeforeToggle();
		};
	}, [handleBeforeToggle, handleToggleClosed, isMounted, onBeforeToggle, onToggle]);

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
			try {
				element.showPopover();
			} catch {}
			return () => {
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
	}, [isOpen]);

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
