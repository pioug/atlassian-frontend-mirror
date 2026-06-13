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
	const el = document.createElement('div');
	el.setAttribute('popover', 'hint');
	return el.popover === 'hint';
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
 * Unopinionated top-layer primitive. Manages visibility and animation only;
 * compose with `useAnchorPosition` / `useWidthFromAnchor` for positioning.
 *
 * `isOpen={true}` calls `showPopover()` (entry via `@starting-style`);
 * `isOpen={false}` calls `hidePopover()` (exit via `allow-discrete`).
 *
 * In `mode="auto"`, the browser can light-dismiss (Escape, click outside).
 * `onClose` fires; the consumer must then set `isOpen` to `false`.
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
	// React 18 `useId()` returns IDs with colons (invalid in CSS selectors
	// and popover target attributes). Strip them; remove once React 18 is
	// dropped (React 19.2 uses underscores).
	const popoverId = idProp ?? `popover-${autoId.replace(/:/g, '')}`;

	const { phase, preset } = useAnimatedVisibility({
		isOpen,
		animate,
		elementRef: ownRef,
		onEnterFinish,
		onExitFinish,
	});

	// Pre-computed phase predicate. `isVisible` mirrors "host element is
	// mounted and on screen" (any phase except `closed`); used as a dep
	// signal for listener-re-bind effects so they re-attach to the fresh
	// host element after a close → reopen unmount/remount cycle.
	const isVisible = phase !== 'closed';

	// Focus management: initial focus on entry (role-dependent), Tab cycling
	// for dialog roles. Restoration is native for outermost popovers; nested
	// focus-capturing roles are handled below via `beforetoggle` snapshot.
	// See: notes/architecture/focus-restoration.md
	//
	// Both hooks take `phase` directly: `useFocusWrap` keeps its listener
	// attached while `phase !== 'closed'` (so focus stays trapped through
	// the animated-exit window — WCAG 2.4.3 regression guard);
	// `useInitialFocus` moves focus on the transition into `'open'`.
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
				// reset for next dismiss
				closeReasonRef.current = 'light-dismiss';
				// Optional: `manual` mode has no `onClose` in the forwarded type.
				onClose?.({ reason });
			}
		},
		[onClose, onOpenChange, role],
	);

	// Bind toggle/beforetoggle/keydown listeners via `useLayoutEffect` so
	// they are attached BEFORE the show/hide layout effect calls
	// `el.showPopover()`. `showPopover()` dispatches `beforetoggle`
	// synchronously; binding the listener in a regular `useEffect`
	// (which runs after layout effects) misses that first dispatch and
	// the `previouslyFocusedElementRef` snapshot never gets taken — which
	// breaks nested-popover focus restoration on close.
	//
	// `isVisible` is in deps so the listeners re-bind to the new host
	// element after a host unmount/remount cycle. The cleanup detaches
	// the old listeners.
	//
	// This layout effect MUST appear in the file before the show/hide
	// layout effect — React runs layout effects in source order on the
	// same commit, and we need listeners attached first.
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
	// so preset reference changes do not re-trigger visibility. `isVisible`
	// is in deps so the CSS vars are re-applied to the new host element after
	// a remount cycle (otherwise the freshly mounted element would have no
	// transform / placement vars set).
	useLayoutEffect(() => {
		const el = ownRef.current;
		if (!el || !preset?.getProperties || !placement) {
			return;
		}
		const props = preset.getProperties({ placement });
		Object.entries(props).forEach(([key, value]) => {
			el.style.setProperty(key, String(value));
		});
	}, [preset, placement, isVisible]);

	// Show/hide based on isOpen. `showPopover`/`hidePopover` are no-ops when
	// already in the target state. Try/catch guards `InvalidStateError` on
	// disconnected elements (StrictMode/concurrent/unmount edge cases).
	useLayoutEffect(() => {
		const el = ownRef.current;
		if (!el) {
			return;
		}

		if (isOpen) {
			programmaticCloseRef.current = false;
			// Reset the close-reason snapshot at the start of every open
			// cycle. The ref outlives the host element (lives on the
			// component, not the DOM), so a stale 'escape' from a prior
			// cycle would otherwise leak into the next close — especially
			// in the no-animation path where the host unmounts before
			// `handleToggle` has a chance to reset the ref itself.
			closeReasonRef.current = 'light-dismiss';
			try {
				el.showPopover();
			} catch {}
			return () => {
				programmaticCloseRef.current = true;
				try {
					el.hidePopover();
				} catch {}
			};
		}

		programmaticCloseRef.current = true;
		try {
			el.hidePopover();
		} catch {}
	}, [isOpen]);

	// The host element is only rendered while the popover is open or its exit
	// animation is playing. Once the phase returns to `closed`, we unmount
	// the host entirely so it does not leave an empty `role="..."` /
	// `popover` element in the accessibility tree. The element re-mounts on
	// the next `isOpen=true` commit; refs and event listeners re-bind via
	// the existing layout effect and `useEffect`. The popover `id` is stable
	// across opens (derived from `useId()` or the consumer-supplied `idProp`).
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
