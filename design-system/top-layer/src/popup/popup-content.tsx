/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, useCallback, useLayoutEffect, useRef } from 'react';

import { jsx } from '@compiled/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';

import { roleToAriaHasPopup, shouldFocusIntoPopover } from '../internal/role-types';
import { useAnchorPosition } from '../internal/use-anchor-position';
import { useWidthFromAnchor } from '../internal/use-width-from-anchor';
import { Popover } from '../popover/popover';
import { type TPopoverForwardedProps } from '../popover/types';

import { useMaybePopupContext } from './popup-context';
import { type TPopupContentProps } from './types';

/**
 * Thin context wrapper that composes `Popover` + `useAnchorPosition`.
 *
 * Used inside the `<Popup>` compound - reads triggerRef, placement, isOpen,
 * and onClose from context. For standalone usage (tooltip, spotlight, flag),
 * use `Popover` + `useAnchorPosition` directly.
 */
export const PopupContent = forwardRef<HTMLDivElement, TPopupContentProps>(function PopupContent(
	{
		children,
		role,
		label,
		labelledBy,
		animate,
		mode,
		widthFromAnchor = 'none',
		xcss,
		isOpen: isOpenProp,
		triggerRef: triggerRefProp,
		placement: placementProp,
		onClose: onCloseProp,
		testId: testIdProp,
		forceFallbackPositioning: forceFallbackPositioningProp,
		id: idProp,
	},
	ref,
): React.ReactElement {
	// When inside <Popup>, context provides defaults. Props always win.
	const ctx = useMaybePopupContext();

	const triggerRef = triggerRefProp ?? ctx?.triggerRef;
	const placement = placementProp ?? ctx?.placement ?? {};
	const onClose = onCloseProp ?? ctx?.onClose;
	const testId = testIdProp ?? ctx?.testId;
	const forceFallbackPositioning = forceFallbackPositioningProp ?? ctx?.forceFallbackPositioning;

	// Resolve isOpen: prop wins, then context.
	// Inside the <Popup> compound, ctx.isOpen tracks the browser's toggle state.
	const isOpen = isOpenProp ?? ctx?.isOpen ?? false;

	// Combine internal state sync with consumer's onOpenChange callback.
	// The Popup compound needs setIsOpen to keep aria-expanded on the trigger
	// in sync, and the consumer may also want to respond to open/close events
	// (e.g. for focus management).
	const setIsOpen = ctx?.setIsOpen;
	const consumerOnOpenChange = ctx?.onOpenChange;
	// Note: onOpenChange composition is handled by handleOpenChange below,
	// which also adds nested-popover focus restoration.

	// ── Sync aria-haspopup on the trigger with the content's role ──
	const setAriaHasPopup = ctx?.setAriaHasPopup;
	useLayoutEffect(() => {
		setAriaHasPopup?.(roleToAriaHasPopup({ role }));
	}, [role, setAriaHasPopup]);

	// ── Focus restoration ──
	// The native Popover API handles focus restoration automatically for
	// popover="auto" and popover="hint":
	//   - Escape → restores focus to the previously focused element (the trigger)
	//   - Click-outside → does NOT restore (correct: the user clicked deliberately)
	//   - hidePopover() → restores focus to the previously focused element
	//
	// However, for **nested** popover="auto" popovers, the browser only captures
	// `previouslyFocusedElement` for the outermost popover in the auto stack.
	// Inner popovers have `shouldRestoreFocus=false` per the spec, so the browser
	// does not restore focus when they close.
	//
	// To handle this, we listen for the close transition via `onOpenChange` and
	// restore focus to the trigger if the browser did not. This runs after the
	// browser's native restoration (which happens synchronously during hidePopover),
	// so it only takes effect when the browser skipped restoration (nested case).
	//
	// See: notes/architecture/focus-restoration.md
	const handleOpenChange = useCallback(
		(args: { isOpen: boolean; element: HTMLDivElement }) => {
			// Sync compound state
			setIsOpen?.(args.isOpen);
			consumerOnOpenChange?.(args);

			// ── Nested popover focus restoration fallback ──
			// The browser only captures `previouslyFocusedElement` for the
			// outermost popover="auto" in the stack. Inner (nested) popovers
			// have shouldRestoreFocus=false, so the browser will not restore
			// focus when they close.
			//
			// We detect this case by checking if focus is still inside the
			// closing popover element. If it is, the browser did not restore,
			// and we need to move focus to the trigger ourselves.
			//
			// This does NOT fire for:
			//   - Outermost popovers (browser already restored to trigger)
			//   - Click-outside (focus is on the clicked element, not in popover)
			if (!args.isOpen) {
				const trigger = triggerRef?.current;
				const focusStillInPopover = trigger && args.element.contains(document.activeElement);
				// Single source of truth for "this role moves focus on open
				// and therefore needs to be restored on close" - see
				// `shouldFocusIntoPopover` in `internal/role-types.tsx`.
				if (focusStillInPopover && shouldFocusIntoPopover({ role })) {
					trigger.focus({ preventScroll: true });
				}
			}
		},
		[setIsOpen, consumerOnOpenChange, triggerRef, role],
	);

	// ── Anchor positioning ──
	// Compose useAnchorPosition with Popover. The hook positions the popover
	// relative to the trigger element via CSS Anchor Positioning (with JS fallback).
	// Use ctx.popoverRef when inside the compound (so the trigger can also
	// reach the same DOM element for togglePopover). Otherwise use a local ref.
	const localRef = useRef<HTMLDivElement>(null);
	const popoverRef = ctx?.popoverRef ?? localRef;

	useAnchorPosition({
		anchorRef: triggerRef ?? { current: null },
		popoverRef,
		placement,
		forceFallbackPositioning,
	});

	useWidthFromAnchor({ mode: widthFromAnchor, popoverRef, anchorRef: triggerRef });

	// Merge: the popoverRef (shared with trigger + positioning) and the forwarded ref.
	const combinedRef = mergeRefs([popoverRef, ref]);

	// TPopupContentProps already validates the discriminated union (role + label,
	// mode + onClose) at its API boundary. Popover accepts TPopoverForwardedProps
	// internally so individual prop forwarding does not need to re-prove the union.
	const popoverProps: TPopoverForwardedProps = {
		isOpen,
		animate,
		placement,
		mode,
		role,
		label,
		labelledBy,
		onClose: onClose ?? undefined,
		onOpenChange: handleOpenChange,
		testId,
		children,
		// Standalone consumers can pass an explicit `id` - used by their own
		// trigger to wire `aria-controls`. Inside the `<Popup>` compound, the
		// id flows from context (`ctx.popoverId`).
		id: idProp ?? ctx?.popoverId,
		xcss,
	};

	return <Popover ref={combinedRef} {...popoverProps} />;
}) as React.ForwardRefExoticComponent<TPopupContentProps & React.RefAttributes<HTMLDivElement>>;
