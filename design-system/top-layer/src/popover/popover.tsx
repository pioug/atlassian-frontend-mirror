/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, type Ref, useCallback, useId, useLayoutEffect, useRef } from 'react';

import { jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import { cssMap } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import once from '@atlaskit/ds-lib/once';
import { useNotifyOpenLayerObserver } from '@atlaskit/layering/experimental/open-layer-observer';

import {
	shouldFocusIntoPopover,
	type TRoleRequiringAccessibleName,
	type TRoleWithImplicitName,
} from '../internal/role-types';
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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- popover UA reset requires values not in cssMap's type union
const styles = cssMap({
	root: {
		border: 'none',
		padding: 0,
		margin: 0,
		// @ts-expect-error -- cssMap types do not include 'auto' for inset
		inset: 'auto',
		overflow: 'visible',
		// Unstyled; consumers apply their own surface.
		// @ts-expect-error -- cssMap types do not include 'transparent' for background
		background: 'transparent',
	},
});

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
 * only, not on close. Consumers that need to ignore a specific dismiss
 * (e.g. a click on a logically-associated external trigger) must reconcile
 * inside their own `onClose` handler by calling `showPopover()` again.
 * `Popover` does not self-heal so consumers do not pay a reconcile cost
 * by default.
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
		onOpenChange,
		onEnterFinish,
		onExitFinish,
		animate,
		placement,
		testId,
		isOpen,
		xcss: xcssFromProps,
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

	const { phase, preset } = useAnimatedVisibility({
		isOpen,
		animate,
		elementRef: ownRef,
		onEnterFinish,
		onExitFinish,
	});

	// True while the host element is mounted (any phase except `closed`).
	// Used as a dep so listener-rebind effects re-attach after a remount.
	const isVisible = phase !== 'closed';

	// Focus management: initial focus on entry (role-dependent), Tab cycling
	// for dialog roles. Restoration is native for outermost popovers; nested
	// focus-capturing roles are handled below via the `beforetoggle` snapshot.
	// Passing `phase` keeps `useFocusWrap` attached through the animated-exit
	// window (WCAG 2.4.3 guard). See notes/architecture/focus-restoration.md.
	useFocusWrap({ elementRef: ownRef, role, phase });
	useInitialFocus({ elementRef: ownRef, phase, role });

	// Register with open layer observer so `closeLayers()` and open-count
	// subscriptions work. Only popup-like roles register as `popup`; passive
	// roles (tooltip, status, etc.) leave `type` undefined.
	const handleObserverClose = useCallback(() => {
		onClose?.({ reason: 'programmatic' });
	}, [onClose]);

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

	const handleToggle = useCallback(
		(event: ToggleEvent) => {
			const element = ownRef.current;
			if (event.newState === 'open') {
				if (element) {
					onOpenChange?.({ isOpen: true, element: element });
				}
				return;
			}
			if (event.newState === 'closed') {
				if (element) {
					onOpenChange?.({ isOpen: false, element: element });

					// Nested-popover focus restoration fallback (browser only
					// restores outermost; Firefox skips nested entirely).
					// Restore only when the role moved focus in on open AND the
					// close was Escape/programmatic. For light dismiss, the
					// click target keeps focus per HTML spec
					// (`focusPreviousElement=false`).
					const previouslyFocused = previouslyFocusedElementRef.current;
					const reason = closeReasonRef.current;
					const isProgrammatic = programmaticCloseRef.current;
					const shouldRestore =
						previouslyFocused !== null &&
						previouslyFocused.isConnected &&
						shouldFocusIntoPopover({ role }) &&
						(reason === 'escape' || isProgrammatic);
					if (shouldRestore && previouslyFocused) {
						previouslyFocused.focus({ preventScroll: true });
					}
					previouslyFocusedElementRef.current = null;
				}

				// Programmatic close: consumer already knows.
				if (programmaticCloseRef.current) {
					// Reset reason so a stale 'escape' from a race with Escape keydown
					// does not corrupt the next browser-dismiss cycle.
					closeReasonRef.current = 'light-dismiss';
					return;
				}

				// Browser dismiss (Escape/click-outside).
				const reason = closeReasonRef.current;
				closeReasonRef.current = 'light-dismiss';
				// Optional: `manual` mode has no `onClose` in the forwarded type.
				onClose?.({ reason });
			}
		},
		[onClose, onOpenChange, role],
	);

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
		const unbindToggle = bind(element, { type: 'toggle', listener: handleToggle });
		// Snapshot `document.activeElement` before `useInitialFocus` moves it.
		const unbindBeforeToggle = bind(element, {
			type: 'beforetoggle',
			listener: handleBeforeToggle,
		});

		return () => {
			unbindEscape();
			unbindToggle();
			unbindBeforeToggle();
		};
	}, [handleToggle, handleBeforeToggle, isVisible]);

	// Placement-dependent animation CSS vars. Kept separate from show/hide
	// so preset reference changes do not re-trigger visibility.
	useLayoutEffect(() => {
		const element = ownRef.current;
		if (!element || !preset?.getProperties || !placement) {
			return;
		}
		const props = preset.getProperties({ placement });
		Object.entries(props).forEach(([key, value]) => {
			element.style.setProperty(key, String(value));
		});
	}, [preset, placement, isVisible]);

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
			// the host element, and the no-animation path unmounts before
			// `handleToggle` can reset it.
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
	if (!isVisible) {
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
			{...(preset ? { [`data-ds-popover-${preset.name}`]: '' } : undefined)}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- xcss prop passes compiled atomic class names
			className={xcssFromProps as string | undefined}
			css={styles.root}
		>
			{children}
		</div>
	);
});
