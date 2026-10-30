/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, type Ref, useCallback, useId, useMemo, useRef } from 'react';

import { cssMap, cx, jsx } from '@compiled/react';
import { bindAll } from 'bind-event-listener';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import once from '@atlaskit/ds-lib/once';
import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';
import { token } from '@atlaskit/tokens';

import { requestCloseEventName } from '../internal/closable-popover-contract';
import { isNativeElementOpen } from '../internal/is-native-element-open';
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
 * Moves focus back to the element that had focus before the popover opened.
 *
 * Native restoration covers only the first popover in an `auto` or `hint` stack, not each nested
 * popover. Manual popovers have no native restoration target. This fallback covers both cases.
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
	// Native restoration has run. Do not move focus that is now outside the popover.
	const activeElementAfterClose = ownerDocument.activeElement;
	// `handleBeforeToggle` checked that focus was inside, so `<body>` means focus was lost on close.
	if (activeElementAfterClose === ownerDocument.body || popover.contains(activeElementAfterClose)) {
		// Native restoration does not scroll the viewport, so this does not either.
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
 * The host renders inline, so it inherits values such as `pointer-events: none` or
 * `white-space: nowrap` from its DOM ancestors (often the trigger). These rules reset them to the
 * values that `<body>` gave the portal path. `font` and `direction` still inherit. Not
 * `all: initial`: that would also override the UA `[popover]` rules.
 *
 * `color` is a reset too. The UA `[popover]` rule sets `color: CanvasText`, so the host never
 * inherits a color. `color.text` is the color that `<body>` gave the portal path. Not `inherit`,
 * which would take the trigger's color (for example a link).
 * See `notes/decisions/surface-reset-color.md`.
 *
 * KEEP IN SYNC with `dialog/dialog-content.tsx` (ADS forbids shared styles). The `satisfies`
 * check below catches drift.
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
		 * The host renders inline, so consumer rules such as `.toolbar > div` can match it. The
		 * tripled selector is (0,4,0): one class level above the most specific such rule in AFM
		 * (0,3,1), and below IDs, so consumers can still opt out. The values match the unstyled
		 * host, so nothing changes until a rule competes. Inline styles and animations still win.
		 *
		 * - `display` is keyed on `:popover-open`. The rest is keyed on `:defined`, which always
		 *   matches a built-in element, so it holds during the exit.
		 * - Not `!important`: it breaks 33 of 48 measured sites.
		 * - Not `[popover]`: `Dialog` has no attribute that is always present, and both hosts use
		 *   the same selector.
		 * - Not `&&&&`: it needs a `no-unsafe-selectors` disable, which the ratchet counts.
		 *
		 * See `notes/decisions/host-specificity-boost.md`.
		 */
		'&:popover-open:popover-open:popover-open': {
			/**
			 * Lets a size cap on the host reach the child. Only while open: an author `display`
			 * beats the UA closed `display: none`.
			 * See `notes/decisions/fit-available-space.md`.
			 */
			display: 'flex',
		},
		'&:defined:defined:defined': {
			// The child fill below needs a single row: `flex-shrink` is main-axis only.
			flexDirection: 'row',
			flexWrap: 'nowrap',
			alignItems: 'normal',
			justifyContent: 'normal',
			// The JavaScript positioning fallback writes viewport coordinates.
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
		 * **Child fill**
		 *
		 * `flex-grow` makes the single child fill the host on the main axis. Block flow did this
		 * for free; a flex item does not.
		 *
		 * The min-size reset is what lets the host's size cap REACH the child. A flex item's
		 * automatic minimum size stays content-based while its `overflow` is `visible`
		 * (css-flexbox-1 §4.5), and a minimum beats a maximum, so a child that does not scroll
		 * would stop shrinking at its min-content size.
		 *
		 * `:where()` adds no specificity, so a minimum that the child sets itself wins. Without
		 * it, both are author rules with one class, and the cascade falls back to stylesheet
		 * order, which Compiled does not sort by specificity. The leading `*` adds no specificity
		 * either. It is there only because `cssMap` rejects a selector that starts with `:`.
		 *
		 * One child is the documented contract (see `children` in `types.tsx`). Two element
		 * children are two flex items in a ROW, at half width each.
		 *
		 * Not grid: a `minmax(0, 1fr)` track stretches an auto-sized child to the cap, but cannot
		 * shrink a child that has an explicit `width`. `flex-shrink` can. Measured on all three
		 * engines. See `notes/decisions/fit-available-space.md`.
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- the child is consumer-owned, so only the host can make it fill; `:where` is the point, see above
		'*:where(&) > *': {
			flexGrow: 1,
			minInlineSize: 0,
			minBlockSize: 0,
		},
	},
	motion: {
		/**
		 * Keeps the element visible and in the top layer while the exit animation plays. Always
		 * applied, not only in the `exiting` phase: that phase can start some time after the
		 * popover is dismissed.
		 */
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

/**
 * The default slide direction for each placement, as the CSS variables that `styles.enter` and
 * `styles.exit` read. `Record<string, string>`, not `React.CSSProperties`: CSS variables are not
 * valid `CSSProperties` keys.
 */
const motionStylesByPlacement: Record<
	TPlacementAxis,
	Record<TPlacementEdge, Record<string, string>>
> = {
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

/**
 * Unopinionated top-layer primitive. It owns visibility, animation and focus. Compose it with
 * `useAnchoredPopover` for position and size.
 *
 * **Visibility**
 *
 * - `isOpen={true}` calls `showPopover()`. With `shouldAnimate`, the entry is a keyframe
 *   animation.
 * - `isOpen={false}` calls `hidePopover()`. With `shouldAnimate`, the exit is a keyframe
 *   animation, kept visible by an `allow-discrete` transition.
 *
 * **Browser dismiss cannot be cancelled**
 *
 * Per the popover spec, `beforetoggle` can be cancelled only when the popover opens, not when it
 * closes. Set `isOpen` to `false` from `onClose`. If `isOpen` stays `true` after a native close,
 * the popover stays closed until the prop changes. `Dialog` asks first instead; see
 * `notes/decisions/dialog-close-flow.md`.
 *
 * - Spec: <https://html.spec.whatwg.org/multipage/popover.html#the-popover-attribute>
 * - <https://github.com/whatwg/html/issues/8973>
 *
 * **Open from `onClick`, not `onPointerDown`**
 *
 * Light dismiss records the `pointerdown` target before the popover exists. On the matching
 * `pointerup`, it dismisses the popover if that target is not in the popover's ancestor chain. So
 * a popover that opens during `pointerdown` closes on the next `pointerup`.
 *
 * Legacy triggers that must open on `mousedown` (for example `@atlaskit/react-select`) must defer
 * the open to the `pointerup` of the same gesture. A timer is not enough. See
 * `notes/pointerdown-open-light-dismiss-report.md`.
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
		// ARIA
		role,
		label,
		labelledBy,
		id: idProp,
	},
	ref,
) {
	const generatedId = useId();
	const ownRef = useRef<HTMLDivElement>(null);
	const combinedRef = mergeRefs(
		[ownRef, ref as Ref<HTMLDivElement>].filter(Boolean) as Array<Ref<HTMLDivElement>>,
	);
	// Remove the colons from the `useId()` output: they break CSS selectors such as `#id`.
	const popoverId = idProp ?? `popover-${generatedId.replace(/:/g, '')}`;

	/**
	 * Read `onClose` from a ref, so a new `onClose` does not rebind the native listeners in the
	 * same commit that calls `showPopover()` or `hidePopover()`.
	 */
	const onCloseRef = useRef(onClose);
	useLayoutEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	// Only a popover with `onClose` is closable. See `internal/closable-popover-contract.tsx`.
	const isClosable = Boolean(onClose);

	/**
	 * Without `hint` support, `hint` falls back to `auto`. It is the closest behavior: light
	 * dismiss still works. The trade-off is that an `auto` popover joins the auto stack, so opening
	 * it closes other `auto` popovers. This is acceptable because few browsers lack `hint` support.
	 */
	const mode = modeProp === 'hint' && !supportsPopoverHint() ? 'auto' : modeProp;

	const motionStyle = useMemo(() => {
		if (!placement || !shouldAnimate) {
			return undefined;
		}
		const { axis, edge } = resolvePlacement({ placement });
		return motionStylesByPlacement[axis][edge];
	}, [placement, shouldAnimate]);

	/**
	 * The reason for the next close. The Escape listener and our own `hidePopover()` calls set it.
	 * Any other close is a light dismiss.
	 */
	const closeReasonRef = useRef<TPopoverCloseReason>('light-dismiss');

	// The element that had focus before open. Cleared before close when focus must not be restored.
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
		 * Like native restoration, do not restore focus after a light dismiss, or when focus is
		 * already outside the popover. Check before the close: after it, focus on `<body>` can also
		 * mean that focus was lost during the close.
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
		// Reset, so a stale `'escape'` from an Escape keydown race does not leak into the next close.
		closeReasonRef.current = 'light-dismiss';

		// Run after native restoration, before notifying the consumer, which may move focus itself.
		restoreFocus({ popover, focusRestorationTarget });

		// A programmatic close came from the consumer (`isOpen` or unmount), so it already knows.
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

	/**
	 * Tab wrapping for dialog roles. Passing `phase` keeps it attached during the animated exit
	 * (WCAG 2.4.3). Initial focus is set below the show and hide effect. Focus restoration is
	 * native for the outermost popover. `handleBeforeToggle` and `restoreFocus` handle nested and
	 * manual popovers. See `notes/architecture/focus.md`.
	 */
	useFocusWrap({ elementRef: ownRef, role, phase });

	/**
	 * Bind in a layout effect that comes BEFORE the show and hide effect below. `showPopover()`
	 * dispatches `beforetoggle` synchronously, so the listeners must already be attached. A
	 * `useEffect` would miss that first event: the focus restoration target would not be recorded,
	 * and nested focus restoration would break. React runs layout effects in source order.
	 *
	 * `isMounted` is a dependency so that the listeners bind again when the host element mounts.
	 */
	useLayoutEffect(() => {
		const element = ownRef.current;
		if (!element) {
			return;
		}

		return bindAll(element, [
			// Tag Escape before the browser runs light dismiss.
			{
				type: 'keydown',
				listener: (event: KeyboardEvent) => {
					// Ignore an Escape that arrives after the native close.
					if (event.key === 'Escape' && isNativeElementOpen({ element })) {
						closeReasonRef.current = 'escape';
					}
				},
				options: { capture: true },
			},
			{
				type: 'toggle',
				listener: (event: ToggleEvent) => {
					if (event.newState === 'closed') {
						handleToggleClosed(event);
					}
					onToggle(event);
				},
			},
			// Record the focus restoration target before `useInitialFocus` moves focus.
			{
				type: 'beforetoggle',
				listener: (event: ToggleEvent) => {
					handleBeforeToggle(event);
					onBeforeToggle(event);
				},
			},
			// `requestClosePopovers()` asks the consumer to close. Nothing is hidden here, so a
			// consumer that keeps `isOpen` stays in sync.
			{
				type: requestCloseEventName,
				listener: () => {
					onCloseRef.current?.({ reason: 'programmatic' });
				},
			},
		]);
	}, [handleBeforeToggle, handleToggleClosed, isMounted, onBeforeToggle, onToggle]);

	/**
	 * Show or hide to match `isOpen`. `showPopover()` and `hidePopover()` do nothing when the
	 * popover is already in that state. The `try`/`catch` blocks ignore the `InvalidStateError`
	 * from a disconnected element (StrictMode, concurrent rendering and unmount edge cases).
	 */
	useLayoutEffect(() => {
		const element = ownRef.current;
		if (!element) {
			return;
		}

		if (isOpen) {
			/**
			 * Clear a stale `'escape'` from an earlier cycle. The ref outlives the host element, and
			 * an interrupted close may not reach `handleToggleClosed`, which resets it.
			 */
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

	/**
	 * Initial focus depends on `role`. It is a layout effect, so it must come AFTER the show and
	 * hide effect above: React runs layout effects in source order, and focus works only after
	 * `showPopover()`. Focus then moves in the same task as the open, before the browser paints.
	 */
	useInitialFocus({ elementRef: ownRef, initialFocusRef, phase, role });

	/**
	 * Unmount the host after the exit, so it does not leave an empty `role` or `popover` element
	 * in the accessibility tree. The element mounts again on the next open, with the same
	 * `popoverId`.
	 */
	if (!isMounted) {
		return null;
	}

	const isAnimatingEntry = shouldAnimate && phase === 'entering';
	const isAnimatingExit = shouldAnimate && phase === 'exiting';

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
			aria-label={label}
			aria-labelledby={labelledBy}
			data-testid={testId}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Motion styles are selected at runtime from the placement.
			style={motionStyle}
			css={[
				styles.root,
				surfaceResetStyles.root,
				isAnimatingEntry && styles.enter,
				isAnimatingExit && styles.exit,
				shouldAnimate && styles.motion,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/ui-styling-standard/local-cx-xcss, @compiled/local-cx-xcss
			className={cx(
				isAnimatingEntry && enteringAnimationXcss,
				isAnimatingExit && exitingAnimationXcss,
			)}
		>
			{children}
		</div>
	);
});
