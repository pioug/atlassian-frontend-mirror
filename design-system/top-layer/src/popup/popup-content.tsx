/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, useCallback, useLayoutEffect, useRef } from 'react';

import { jsx } from '@compiled/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';

import { roleToAriaHasPopup } from '../internal/role-types';
import { useAnchorPosition } from '../internal/use-anchor-positioning';
import { usePresetStyles } from '../internal/use-preset-styles';
import { Popover } from '../popover/popover';
import { type TPopoverInternalProps } from '../popover/types';

import { useMaybePopupContext } from './popup-context';
import { type TPopupContentProps } from './types';

/**
 * Thin context wrapper that composes `Popover` + `useAnchorPosition`.
 *
 * Used inside the `<Popup>` compound — reads triggerRef, placement, isOpen,
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
		arrow,
		mode,
		width = 'content',
		isOpen: isOpenProp,
		triggerRef: triggerRefProp,
		placement: placementProp,
		onClose: onCloseProp,
		testId: testIdProp,
		offset: offsetProp,
		forceFallbackPositioning: forceFallbackPositioningProp,
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
	// restore focus to the trigger if the browser didn't. This runs after the
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
			// have shouldRestoreFocus=false, so the browser won't restore
			// focus when they close.
			//
			// We detect this case by checking if focus is still inside the
			// closing popover element. If it is, the browser didn't restore,
			// and we need to move focus to the trigger ourselves.
			//
			// This does NOT fire for:
			//   - Outermost popovers (browser already restored to trigger)
			//   - Click-outside (focus is on the clicked element, not in popover)
			if (!args.isOpen) {
				const trigger = triggerRef?.current;
				const focusStillInPopover =
					trigger && args.element.contains(document.activeElement);
				if (focusStillInPopover) {
					const shouldRestore =
						role === 'dialog' ||
						role === 'alertdialog' ||
						role === 'menu' ||
						role === 'listbox';
					if (shouldRestore) {
						trigger.focus({ preventScroll: true });
					}
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
	const arrowPreset = usePresetStyles({ preset: arrow });

	useAnchorPosition({
		anchorRef: triggerRef ?? { current: null },
		popoverRef,
		placement,
		offset: offsetProp,
		forceFallbackPositioning,
		arrow: arrowPreset ?? undefined,
	});

	// ── Width: match trigger ──
	// When width="trigger" or width="min-trigger", size the popover relative
	// to the trigger element. Uses CSS `anchor-size(width)` when supported,
	// falling back to a one-off measurement of the trigger's offsetWidth.
	useLayoutEffect(() => {
		if (width === 'content') {
			return;
		}
		const node = popoverRef.current;
		if (!node) {
			return;
		}

		const cssProperty = width === 'trigger' ? 'width' : 'min-width';
		const anchorValue = 'anchor-size(width)';

		// Feature-detect `anchor-size()` specifically (not just `anchor-name`)
		// so the JS fallback fires correctly in browsers that support anchor
		// positioning but not anchor sizing.
		const supportsAnchorSize =
			typeof CSS !== 'undefined' &&
			typeof CSS.supports === 'function' &&
			CSS.supports('width', 'anchor-size(width)');

		if (supportsAnchorSize) {
			node.style.setProperty(cssProperty, anchorValue);
		} else {
			// JS fallback: one-off read of the trigger's width.
			const trigger = triggerRef?.current;
			if (trigger) {
				node.style.setProperty(cssProperty, `${trigger.offsetWidth}px`);
			}
		}

		return () => {
			node.style.removeProperty(cssProperty);
		};
	}, [width, popoverRef, triggerRef]);

	// Merge: the popoverRef (shared with trigger + positioning) and the forwarded ref.
	const combinedRef = mergeRefs([popoverRef, ref]);

	// TPopupContentProps already validates the discriminated union (role + label,
	// mode + onClose) at its API boundary. Popover accepts TPopoverInternalProps
	// internally so individual prop forwarding doesn't need to re-prove the union.
	const popoverProps: TPopoverInternalProps = {
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
		id: ctx?.popoverId,
	};

	return <Popover ref={combinedRef} {...popoverProps} />;
}) as React.ForwardRefExoticComponent<TPopupContentProps & React.RefAttributes<HTMLDivElement>>;
