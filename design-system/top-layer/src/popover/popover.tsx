/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, {
	forwardRef,
	type Ref,
	useCallback,
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
} from 'react';

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

	const { showChildren, preset } = useAnimatedVisibility({
		isOpen,
		animate,
		elementRef: ownRef,
		onEnterFinish,
		onExitFinish,
	});

	// Focus management: initial focus on open (role-dependent), Tab cycling
	// for dialog roles. Restoration is native for outermost popovers; nested
	// focus-capturing roles are handled below via `beforetoggle` snapshot.
	// See: notes/architecture/focus-restoration.md
	useFocusWrap({ elementRef: ownRef, role });
	useInitialFocus({ elementRef: ownRef, isOpen, role });

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

	useEffect(() => {
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
	}, [handleToggle, handleBeforeToggle]);

	// Placement-dependent animation CSS vars. Kept separate from show/hide
	// so preset reference changes do not re-trigger visibility.
	useLayoutEffect(() => {
		const el = ownRef.current;
		if (!el || !preset?.getProperties || !placement) {
			return;
		}
		const props = preset.getProperties({ placement });
		Object.entries(props).forEach(([key, value]) => {
			el.style.setProperty(key, String(value));
		});
	}, [preset, placement]);

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
			{showChildren ? children : null}
		</div>
	);
});
