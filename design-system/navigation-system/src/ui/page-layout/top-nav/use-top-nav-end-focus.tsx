import { type FocusEventHandler, type RefObject, useCallback, useEffect, useRef } from 'react';

import { bindAll } from 'bind-event-listener';

import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';

function getActions(list: HTMLDivElement | null): HTMLElement[] {
	return Array.from(
		list?.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex]') ??
			[],
	).filter((element) => {
		// In-place and top-layer popups can be DOM descendants of the list.
		// Their controls must not replace the index of the action that opened them.
		const layer = element.closest(
			'[popover], [role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"]',
		);
		return (
			element.tabIndex >= 0 &&
			!element.matches(':disabled') &&
			element.getClientRects().length > 0 &&
			!(layer && list?.contains(layer))
		);
	});
}

/**
 * Keeps keyboard position when the regular actions move into or out of overflow.
 */
export function useTopNavEndFocus({ isMobile, enabled }: { isMobile: boolean; enabled: boolean }): {
	actionsRef: RefObject<HTMLDivElement>;
	triggerRef: RefObject<HTMLButtonElement>;
	onFocusCapture: FocusEventHandler<HTMLDivElement>;
} {
	const actionsRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const focusedElement = useRef<HTMLElement | null>(null);
	const actionIndex = useRef(0);
	const previousIsMobile = useRef(isMobile);

	// React capture follows owned portals as well as DOM descendants. The scope
	// includes the overflow popup's focusable shell, but excludes persistent items.
	const onFocusCapture = useCallback<FocusEventHandler<HTMLDivElement>>((event) => {
		const target = event.target;
		focusedElement.current = target;
		const index = getActions(actionsRef.current).indexOf(target);
		if (index >= 0) {
			actionIndex.current = index;
		}
	}, []);

	useLayoutEffect(() => {
		if (!enabled) {
			return;
		}
		return bindAll(document, [
			{
				type: 'focusin',
				listener: (event) => {
					// Owned React focus has already been recorded in capture, including
					// portaled layers. Everything else cancels the pending handoff.
					if (event.target !== focusedElement.current) {
						focusedElement.current = null;
					}
				},
			},
			{
				type: 'focusout',
				listener: (event) => {
					if (!(event instanceof FocusEvent)) {
						return;
					}
					const element = focusedElement.current;
					if (event.target !== element) {
						return;
					}
					if (event.relatedTarget) {
						focusedElement.current = null;
						return;
					}
					// A popup can blur its trigger during unmount, before removing its DOM.
					// Wait until that commit completes to distinguish removal from explicit blur.
					queueMicrotask(() => {
						if (
							focusedElement.current === element &&
							element?.isConnected &&
							element.getClientRects().length
						) {
							focusedElement.current = null;
						}
					});
				},
			},
		]);
	}, [enabled]);

	// Restore after the removed popup has released its focus trap in passive cleanup.
	useEffect(() => {
		const changed = previousIsMobile.current !== isMobile;
		previousIsMobile.current = isMobile;
		if (!enabled || !changed) {
			return;
		}
		const previous = focusedElement.current;
		focusedElement.current = null;
		if (
			!previous ||
			(document.activeElement !== document.body && document.activeElement !== previous)
		) {
			return;
		}
		const actions = getActions(actionsRef.current);
		const replacement = isMobile
			? triggerRef.current
			: (actions[actionIndex.current] ?? actions[0]);
		replacement?.focus();
	}, [enabled, isMobile]);

	return { actionsRef, triggerRef, onFocusCapture };
}
