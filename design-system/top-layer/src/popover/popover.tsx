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
import noop from '@atlaskit/ds-lib/noop';
import once from '@atlaskit/ds-lib/once';

import { useAnimatedVisibility } from '../internal/use-animated-visibility';
import { useFocusWrap } from '../internal/use-focus-wrap';
import { useInitialFocus } from '../internal/use-initial-focus';

import { type TPopoverCloseReason, type TPopoverForwardedProps } from './types';

/**
 * Detects whether the browser supports the `popover="hint"` attribute value.
 * Uses DOM reflection: unsupported browsers reflect the invalid value default ("manual").
 * Safe for SSR. Result is cached via `once`.
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
		// Transparent so the popover is unstyled — consumers apply their own surface.
		// @ts-expect-error -- cssMap types do not include 'transparent' for background
		background: 'transparent',
	},
});

type TPopoverMode = 'auto' | 'hint' | 'manual';

/**
 * Unopinionated top-layer primitive.
 *
 * Manages only visibility (isOpen) and animation (animate). Has no knowledge
 * of positioning — compose with `useAnchorPosition` for anchor positioning.
 *
 * Visibility is driven by the `isOpen` prop:
 * - `isOpen={true}` → `showPopover()`, entry animation via `@starting-style`
 * - `isOpen={false}` → `hidePopover()`, exit animation via `allow-discrete`
 *
 * For `mode="auto"`, the browser can dismiss the popover via light dismiss
 * (Escape, click outside). When that happens, `onClose` is called and the
 * consumer must set `isOpen` to `false`. The DOM owns the dismiss — React
 * must follow.
 */
export const Popover: React.ForwardRefExoticComponent<
	TPopoverForwardedProps & React.RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, TPopoverForwardedProps>(function Popover(
	{
		children,
		mode: modeProp = 'auto',
		onClose = noop,
		onOpenChange,
		onExitFinish,
		animate,
		placement,
		testId,
		isOpen,
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
	// Regex is intentional — `replaceAll` is not available in our supported
	// browser matrix. In React 18, `useId()` returns IDs containing colons
	// (e.g. `:r1:`) which are invalid in CSS selectors and `popover` target
	// attributes. React 19.2.0 replaced colons with underscores, making this
	// stripping unnecessary once React 18 support is dropped.
	const popoverId = idProp ?? `popover-${autoId.replace(/:/g, '')}`;

	const { showChildren, preset } = useAnimatedVisibility({
		isOpen,
		animate,
		elementRef: ownRef,
		onExitFinish,
	});

	// ── Focus management ──
	// Initial focus: on open, moves focus into the popover (role-dependent).
	// Focus wrap: Tab/Shift+Tab cycle within the popover for dialog roles.
	// Focus restoration: handled natively by the Popover API — the browser
	//   tracks `previouslyFocusedElement` on show and restores it on hide.
	//   No custom restoration hook is needed. See: notes/architecture/focus-restoration.md
	useFocusWrap({ elementRef: ownRef, role });
	useInitialFocus({ elementRef: ownRef, isOpen, role });

	// Hint mode fallback: "hint" downgrades to "auto" if unsupported.
	//
	// Decision (2026-03-17 audit): We keep "auto" as the fallback (not "manual")
	// because it provides the closest behavior to "hint" (light dismiss works).
	// However, there is a behavioral difference: "auto" participates in the
	// auto-dismiss stack and WILL close other "auto" popovers when it opens
	// (e.g. a tooltip opening will close an open dropdown). "hint" does not
	// have this side effect. This difference only affects browsers without
	// popover="hint" support, and that set is shrinking rapidly.
	const mode: TPopoverMode = modeProp === 'hint' && !supportsPopoverHint() ? 'auto' : modeProp;

	// Distinguishes programmatic hidePopover() from browser-initiated dismiss.
	// When we call hidePopover() ourselves the toggle event fires synchronously —
	// this ref prevents the toggle handler from calling onClose redundantly.
	const programmaticCloseRef = useRef(false);

	// Escape key tracking: set in a capture-phase keydown listener (fires before
	// the browser processes light dismiss), read in the toggle handler.
	const closeReasonRef = useRef<TPopoverCloseReason>('light-dismiss');

	const handleToggle = useCallback(
		(event: ToggleEvent) => {
			const el = ownRef.current;
			if (event.newState === 'open') {
				if (el) {
					onOpenChange?.({ isOpen: true, element: el });
				}
				return;
			}
			if (event.newState === 'closed') {
				if (el) {
					onOpenChange?.({ isOpen: false, element: el });
				}

				// Programmatic close (unmount or isOpen→false). Consumer already knows.
				if (programmaticCloseRef.current) {
					return;
				}

				// Browser dismiss (Escape or click-outside). Notify consumer.
				const reason = closeReasonRef.current;
				closeReasonRef.current = 'light-dismiss'; // reset for next dismiss
				onClose({ reason });
			}
		},
		[onClose, onOpenChange],
	);

	useEffect(() => {
		const el = ownRef.current;
		if (!el) {
			return;
		}

		// Capture-phase: tag Escape before the browser processes light dismiss.
		const unbindEscape = bind(el, {
			type: 'keydown',
			listener: (event: KeyboardEvent) => {
				if (event.key === 'Escape') {
					closeReasonRef.current = 'escape';
				}
			},
			options: { capture: true },
		});
		const unbindToggle = bind(el, { type: 'toggle', listener: handleToggle });

		return () => {
			unbindEscape();
			unbindToggle();
		};
	}, [handleToggle]);

	// Placement-dependent animation CSS vars (e.g. slide direction).
	// Separate from show/hide so that preset reference changes
	// (e.g. inline `animate={slideAndFade()}`) don't re-trigger visibility.
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

	// Show/hide based on isOpen. try/catch because show/hide throw if the
	// element is already in the target state (e.g. browser dismissed via
	// light-dismiss before our effect ran).
	useLayoutEffect(() => {
		const el = ownRef.current;
		if (!el) {
			return;
		}

		if (isOpen) {
			programmaticCloseRef.current = false;
			try {
				el.showPopover();
			} catch {
				// Already showing or unsupported — DOM matches intent.
			}
			return () => {
				programmaticCloseRef.current = true;
				try {
					el.hidePopover();
				} catch {
					// Already hidden — DOM matches intent.
				}
			};
		}

		programmaticCloseRef.current = true;
		try {
			el.hidePopover();
		} catch {
			// Already hidden — DOM matches intent.
		}
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
			css={styles.root}
		>
			{showChildren ? children : null}
		</div>
	);
});
