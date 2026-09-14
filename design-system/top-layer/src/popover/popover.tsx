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

import {
	resolvePlacement,
	type TPlacementAxis,
	type TPlacementEdge,
} from '../internal/resolve-placement';
import {
	type TRoleRequiringAccessibleName,
	type TRoleWithImplicitName,
} from '../internal/role-types';
import { shouldFocusIntoPopover } from '../internal/should-focus-into-popover';
import { useAnimatedVisibility } from '../internal/use-animated-visibility';
import { useFocusWrap } from '../internal/use-focus-wrap';
import { useInitialFocus } from '../internal/use-initial-focus';

import { type TPopoverCloseReason, type TPopoverForwardedProps } from './types';

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
// KEEP IN SYNC with the identical `surfaceResetStyles` in `dialog/dialog-content.tsx`.
// ADS forbids sharing styles across files (`no-exported-styles` /
// `no-imported-style-values` — Compiled styles are null at runtime), so the reset is
// co-located and duplicated deliberately.
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
 * compose with `useAnchorPosition` / `useWidthFromAnchor` for positioning.
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

	// Keep semantic callbacks current without rebinding native lifecycle
	// listeners during the same commit that calls showPopover()/hidePopover().
	const onCloseRef = useRef(onClose);
	const roleRef = useRef(role);
	useLayoutEffect(() => {
		onCloseRef.current = onClose;
		roleRef.current = role;
	}, [onClose, role]);

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

	// Prevents toggle handler from calling onClose for our own hidePopover() calls.
	const programmaticCloseRef = useRef(false);

	// Set in capture-phase keydown so the toggle handler knows close reason.
	const closeReasonRef = useRef<TPopoverCloseReason>('light-dismiss');

	// Snapshot of pre-open focus, used to restore focus for nested popovers
	// with focus-capturing roles (browser only restores the outermost).
	const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

	const handleBeforeToggle = useCallback((event: ToggleEvent) => {
		if (event.newState !== 'open') {
			return;
		}
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- need active element snapshot
		const active = document.activeElement;
		previouslyFocusedElementRef.current = active instanceof HTMLElement ? active : null;
	}, []);

	const restorePreviouslyFocusedElement = useCallback(() => {
		const previouslyFocused = previouslyFocusedElementRef.current;
		previouslyFocusedElementRef.current = null;
		if (
			previouslyFocused !== null &&
			previouslyFocused.isConnected &&
			shouldFocusIntoPopover({ role: roleRef.current })
		) {
			previouslyFocused.focus({ preventScroll: true });
		}
	}, []);

	const handleToggleClosed = useCallback(
		(_event: ToggleEvent) => {
			// Nested-popover focus restoration fallback (browser only
			// restores outermost; Firefox skips nested entirely).
			// Restore only when the role moved focus in on open AND the
			// close was Escape/programmatic. For light dismiss, the
			// click target keeps focus per HTML spec
			// (`focusPreviousElement=false`).
			const reason = closeReasonRef.current;
			const isProgrammatic = programmaticCloseRef.current;
			if (reason === 'escape' || isProgrammatic) {
				restorePreviouslyFocusedElement();
			} else {
				previouslyFocusedElementRef.current = null;
			}

			// Reset reason so a stale 'escape' from a race with Escape keydown
			// does not corrupt the next browser-dismiss cycle.
			closeReasonRef.current = 'light-dismiss';

			// Programmatic close: consumer already knows.
			if (isProgrammatic) {
				return;
			}

			// Browser dismiss (Escape/click-outside).
			// Optional: `manual` mode has no `onClose` in the forwarded type.
			onCloseRef.current?.({ reason });
		},
		[restorePreviouslyFocusedElement],
	);

	const { phase, isMounted, onBeforeToggle, onToggle } = useAnimatedVisibility({
		isOpen,
		shouldAnimate,
		elementRef: ownRef,
		onEnterFinish,
		onExitFinish,
	});

	// Focus management: initial focus on entry (role-dependent), Tab cycling
	// for dialog roles. Restoration is native for outermost popovers; nested
	// focus-capturing roles are handled above via the `beforetoggle` snapshot.
	// Passing `phase` keeps `useFocusWrap` attached through the animated-exit
	// window (WCAG 2.4.3 guard). See notes/architecture/focus-restoration.md.
	useFocusWrap({ elementRef: ownRef, role, phase });
	useInitialFocus({ elementRef: ownRef, phase, role });

	// Bind via `useLayoutEffect`, and BEFORE the show/hide layout effect
	// below, so listeners are attached when `showPopover()` synchronously
	// dispatches `beforetoggle`. A regular `useEffect` would miss that
	// first dispatch, dropping the `previouslyFocusedElementRef` snapshot
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
				if (event.key === 'Escape') {
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
		// Snapshot `document.activeElement` before `useInitialFocus` moves it,
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
			programmaticCloseRef.current = false;
			// Clear stale 'escape' from a prior cycle: the ref outlives
			// the host element, and interrupted close lifecycles may not reach
			// `handleToggleClosed` to reset it.
			closeReasonRef.current = 'light-dismiss';
			try {
				element.showPopover();
			} catch {}
			return () => {
				programmaticCloseRef.current = true;
				try {
					element.hidePopover();
				} catch {}
			};
		}

		programmaticCloseRef.current = true;
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
