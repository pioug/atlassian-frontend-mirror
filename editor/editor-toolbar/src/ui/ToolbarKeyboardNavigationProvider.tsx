import React, { useLayoutEffect, useRef } from 'react';

import { getDocument } from '@atlaskit/browser-apis';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ToolbarKeyboardNavigationProviderConfig } from '../types';

type ToolbarKeyboardNavigationProviderProps = ToolbarKeyboardNavigationProviderConfig & {
	children: React.ReactNode;
};

export const ToolbarKeyboardNavigationProvider = ({
	children,
	childComponentSelector,
	dom,
	isShortcutToFocusToolbar,
	handleFocus,
	handleEscape,
	ariaLabel,
	ariaControls,
}: ToolbarKeyboardNavigationProviderProps) => {
	const wrapperRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (!wrapperRef.current) {
			return;
		}

		const { current: element } = wrapperRef;

		const getFocusableElements = (): HTMLElement[] => {
			if (!element) {
				return [];
			}
			// Find all focusable elements within the toolbar that match the child component selector
			const focusableSelectors = [
				'button:not([disabled])',
				'[role="button"]:not([disabled])',
				'[tabindex]:not([tabindex="-1"])',
			].join(',');

			const allFocusable = Array.from(element.querySelectorAll<HTMLElement>(focusableSelectors));

			// Filter to only include elements that are:
			// 1. Within the child component selector
			// 2. Visible (not hidden by display:none on itself or any parent)
			return allFocusable.filter((el) => {
				if (!el.closest(`${childComponentSelector}`)) {
					return false;
				}

				// Check if the element or any of its parents have display: none
				let currentEl: HTMLElement | null = el;
				while (currentEl && currentEl !== element) {
					const computedStyle = window.getComputedStyle(currentEl);
					if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
						return false;
					}
					currentEl = currentEl.parentElement;
				}

				return true;
			});
		};

		const moveFocus = (direction: 'left' | 'right'): void => {
			const focusableElements = getFocusableElements();
			if (focusableElements.length === 0) {
				return;
			}

			const doc = getDocument();
			const currentIndex = focusableElements.findIndex((el) => el === doc?.activeElement);

			let nextIndex: number;
			if (currentIndex === -1) {
				// No element currently focused, focus the first one
				nextIndex = 0;
			} else if (direction === 'right') {
				// Move right, wrap to beginning if at end
				nextIndex = (currentIndex + 1) % focusableElements.length;
			} else {
				// Move left, wrap to end if at beginning
				nextIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
			}

			focusableElements[nextIndex]?.focus();
		};

		const handleTab = (): void => {
			const focusableElements = getFocusableElements();
			if (focusableElements.length === 0) {
				return;
			}
			const doc = getDocument();
			let index = doc?.activeElement
				? focusableElements.findIndex((el) => el === doc?.activeElement)
				: 0;
			if (index < 0) {
				index = 0;
			}
			focusableElements.forEach((el) => el.setAttribute('tabindex', '-1'));
			focusableElements[index].setAttribute('tabindex', '0');
		};

		const handleKeyDown = (event: KeyboardEvent): void => {
			const targetElement = event.target;

			if (
				targetElement instanceof HTMLElement &&
				!targetElement.closest(`${childComponentSelector}`)
			) {
				return;
			}

			if (fg('platform_editor_toolbar_aifc_patch_7')) {
				switch (event.key) {
					case 'Escape':
						handleEscape(event);
						break;
					case 'ArrowLeft':
						event.preventDefault();
						moveFocus('left');
						break;
					case 'ArrowRight':
						event.preventDefault();
						moveFocus('right');
						break;
					case 'Tab': {
						handleTab();
						break;
					}
					default:
				}
			} else {
				switch (event.key) {
					case 'Escape':
						handleEscape(event);
						break;
					default:
				}
			}
		};

		const globalKeyDownHandler = (event: KeyboardEvent): void => {
			if (isShortcutToFocusToolbar && isShortcutToFocusToolbar(event)) {
				handleFocus(event);
			}
		};

		// ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		element?.addEventListener('keydown', handleKeyDown);
		// ignored via go/ees005
		// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
		dom?.addEventListener('keydown', globalKeyDownHandler);
		return () => {
			// ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			element?.removeEventListener('keydown', handleKeyDown);
			// ignored via go/ees005
			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			dom?.removeEventListener('keydown', globalKeyDownHandler);
		};
	}, [
		wrapperRef,
		childComponentSelector,
		dom,
		isShortcutToFocusToolbar,
		handleFocus,
		handleEscape,
	]);

	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- ignored via go/DSP-18766
			className="custom-key-handler-wrapper"
			ref={wrapperRef}
			aria-label={ariaLabel}
			aria-controls={ariaControls}
		>
			{children}
		</div>
	);
};
