/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';
import React, { useCallback, useLayoutEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import type { IntlShape } from 'react-intl-next/src/types';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { ELEMENT_BROWSER_ID } from '../../element-browser';
import { fullPageMessages } from '../../messages';
import { mediaInsertMessages } from '../../messages/media-insert';
import type { EditorAppearance } from '../../types';
import type { UseStickyToolbarType } from '../../ui';
import { EDIT_AREA_ID } from '../../ui';

export interface KeyDownHandlerContext {
	handleArrowLeft: () => void;
	handleArrowRight: () => void;
	handleTab: () => void;
}

/*
 **  The context is used to handle the keydown events of submenus.
 **  Because the keyboard navigation is explicitly managed for main toolbar items
 **  Few key presses such as Tab,Arrow Right/Left need ot be handled here via context
 */
export const KeyDownHandlerContext = React.createContext<KeyDownHandlerContext>({
	handleArrowLeft: () => {},
	handleArrowRight: () => {},
	handleTab: () => {},
});

const centeredToolbarContainer = css({
	display: 'flex',
	width: '100%',
	alignItems: 'center',
});

/**
 * This component is a wrapper of main toolbar which listens to keydown events of children
 * and handles left/right arrow key navigation for all focusable elements
 * @param
 * @returns
 */
export const ToolbarArrowKeyNavigationProvider = ({
	children,
	editorView,
	childComponentSelector,
	handleEscape,
	disableArrowKeyNavigation,
	isShortcutToFocusToolbar,
	editorAppearance,
	useStickyToolbar,
	intl,
}: {
	children: ReactNode;
	editorView?: EditorView;
	// Selector is used to filterout the keyevents originated outside of toolbars/any child component
	childComponentSelector: string;
	handleEscape?: (event: KeyboardEvent) => void;
	disableArrowKeyNavigation?: boolean;
	isShortcutToFocusToolbar?: (event: KeyboardEvent) => boolean;
	editorAppearance?: EditorAppearance;
	useStickyToolbar?: UseStickyToolbarType;
	intl: IntlShape;
}) => {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const selectedItemIndex = useRef(0);

	const incrementIndex = useCallback((list: HTMLElement[]) => {
		let index = 0;
		if (document.activeElement) {
			index = list.indexOf(document.activeElement as HTMLElement);
			index = (index + 1) % list.length;
		}
		selectedItemIndex.current = index;
	}, []);

	const decrementIndex = useCallback((list: HTMLElement[]) => {
		let index = 0;
		if (document.activeElement) {
			index = list.indexOf(document.activeElement as HTMLElement);
			index = (list.length + index - 1) % list.length;
		}
		selectedItemIndex.current = index;
	}, []);

	const handleArrowRight = (): void => {
		const filteredFocusableElements = getFilteredFocusableElements(wrapperRef?.current);

		incrementIndex(filteredFocusableElements);
		filteredFocusableElements[selectedItemIndex.current]?.focus();
	};

	const handleArrowLeft = (): void => {
		const filteredFocusableElements = getFilteredFocusableElements(wrapperRef?.current);

		decrementIndex(filteredFocusableElements);
		filteredFocusableElements[selectedItemIndex.current]?.focus();
	};

	const handleTab = (): void => {
		const filteredFocusableElements = getFilteredFocusableElements(wrapperRef?.current);
		filteredFocusableElements[selectedItemIndex.current]?.focus();
	};

	const handleTabLocal = (): void => {
		const filteredFocusableElements = getFilteredFocusableElements(wrapperRef?.current);
		filteredFocusableElements.forEach((element) => {
			element.setAttribute('tabindex', '-1');
		});
		filteredFocusableElements[selectedItemIndex.current].setAttribute('tabindex', '0');
	};

	const focusAndScrollToElement = (element: HTMLElement, scrollToElement = true): void => {
		if (scrollToElement) {
			element?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest',
			});
		}
		element.focus();
	};

	const submenuKeydownHandleContext = {
		handleArrowLeft,
		handleArrowRight,
		handleTab,
	};

	useLayoutEffect(() => {
		if (!wrapperRef.current || disableArrowKeyNavigation) {
			return;
		}
		const { current: element } = wrapperRef;

		/**
		 * To handle the key events on the list
		 * @param event
		 */
		const handleKeyDown = (event: KeyboardEvent): void => {
			// To trap the focus inside the horizontal toolbar for left and right arrow keys
			const targetElement = event.target;

			if (
				targetElement instanceof HTMLElement &&
				!targetElement.closest(`${childComponentSelector}`)
			) {
				return;
			}

			if (
				(targetElement instanceof HTMLElement &&
					document
						.querySelector(
							'[data-role="droplistContent"], [data-test-id="color-picker-menu"], [data-emoji-picker-container="true"]',
						)
						?.contains(targetElement)) ||
				(targetElement instanceof HTMLElement &&
					document.querySelector('[data-test-id="color-picker-menu"]')?.contains(targetElement)) ||
				event.key === 'ArrowUp' ||
				event.key === 'ArrowDown' ||
				disableArrowKeyNavigation
			) {
				return;
			}
			const menuWrapper = document.querySelector('.menu-key-handler-wrapper');
			if (menuWrapper) {
				// if menu wrapper exists, then a menu is open and arrow keys will be handled by MenuArrowKeyNavigationProvider
				return;
			}

			const elementBrowser = wrapperRef?.current?.querySelector(`#${ELEMENT_BROWSER_ID}`);
			if (elementBrowser) {
				// if element browser is open, then arrow keys will be handled by MenuArrowKeyNavigationProvider
				return;
			}

			const filteredFocusableElements = getFilteredFocusableElements(wrapperRef?.current);
			if (!filteredFocusableElements || filteredFocusableElements?.length === 0) {
				return;
			}

			// If the target element is the media picker then navigation is handled by the media picker
			if (
				targetElement instanceof HTMLElement &&
				targetElement.closest(
					`[aria-label="${intl.formatMessage(mediaInsertMessages.mediaPickerPopupAriaLabel)}"]`,
				)
			) {
				return;
			}

			if (targetElement instanceof HTMLElement && !wrapperRef.current?.contains(targetElement)) {
				selectedItemIndex.current = -1;
			} else {
				selectedItemIndex.current =
					targetElement instanceof HTMLElement &&
					filteredFocusableElements.indexOf(targetElement) > -1
						? filteredFocusableElements.indexOf(targetElement)
						: selectedItemIndex.current;
			}

			// do not scroll to focused element for sticky toolbar when navigating with arrows to avoid unnesessary scroll jump
			const allowScrollToElement = !(editorAppearance === 'comment' && !!useStickyToolbar);

			switch (event.key) {
				case 'ArrowRight':
					incrementIndex(filteredFocusableElements);
					focusAndScrollToElement(
						filteredFocusableElements[selectedItemIndex.current],
						allowScrollToElement,
					);
					event.preventDefault();
					break;
				case 'ArrowLeft':
					decrementIndex(filteredFocusableElements);
					focusAndScrollToElement(
						filteredFocusableElements[selectedItemIndex.current],
						allowScrollToElement,
					);
					event.preventDefault();
					break;
				case 'Tab':
					handleTabLocal();
					break;
				case 'Escape':
					handleEscape!(event);
					break;
				default:
			}
		};

		const globalKeyDownHandler = (event: KeyboardEvent): void => {
			// To focus the first element in the toolbar
			if (isShortcutToFocusToolbar!(event)) {
				const filteredFocusableElements = getFilteredFocusableElements(wrapperRef?.current);
				filteredFocusableElements[0]?.focus();
				filteredFocusableElements[0]?.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'nearest',
				});
			}
		};

		element?.addEventListener('keydown', handleKeyDown);
		const editorViewDom = editorView?.dom as HTMLElement | undefined;
		if (isShortcutToFocusToolbar) {
			editorViewDom?.addEventListener('keydown', globalKeyDownHandler);
		}
		return () => {
			element?.removeEventListener('keydown', handleKeyDown);
			if (isShortcutToFocusToolbar) {
				editorViewDom?.removeEventListener('keydown', globalKeyDownHandler);
			}
		};
	}, [
		selectedItemIndex,
		wrapperRef,
		editorView,
		disableArrowKeyNavigation,
		handleEscape,
		childComponentSelector,
		incrementIndex,
		decrementIndex,
		isShortcutToFocusToolbar,
		editorAppearance,
		useStickyToolbar,
		intl,
	]);

	return (
		<div
			css={editorAppearance === 'comment' && centeredToolbarContainer}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="custom-key-handler-wrapper"
			ref={wrapperRef}
			role="toolbar"
			aria-label={intl.formatMessage(fullPageMessages.toolbarLabel)}
			aria-controls={EDIT_AREA_ID}
		>
			<KeyDownHandlerContext.Provider value={submenuKeydownHandleContext}>
				{children}
			</KeyDownHandlerContext.Provider>
		</div>
	);
};

function getFocusableElements(rootNode: HTMLElement | null): Array<HTMLElement> {
	if (!rootNode) {
		return [];
	}
	const focusableModalElements =
		(rootNode.querySelectorAll(
			'a[href], button:not([disabled]), textarea, input, select, div[tabindex="-1"], div[tabindex="0"]',
		) as NodeListOf<HTMLElement>) || [];
	return Array.from(focusableModalElements);
}

function getFilteredFocusableElements(rootNode: HTMLElement | null): Array<HTMLElement> {
	// The focusable elements from child components such as dropdown menus / popups are ignored
	return getFocusableElements(rootNode).filter((elm) => {
		const style = window.getComputedStyle(elm);
		// ignore invisible element to avoid losing focus
		const isVisible = style.visibility !== 'hidden' && style.display !== 'none';

		return (
			!elm.closest('[data-role="droplistContent"]') &&
			!elm.closest('[data-emoji-picker-container="true"]') &&
			!elm.closest('[data-test-id="color-picker-menu"]') &&
			!elm.closest('.scroll-buttons') &&
			isVisible
		);
	});
}
