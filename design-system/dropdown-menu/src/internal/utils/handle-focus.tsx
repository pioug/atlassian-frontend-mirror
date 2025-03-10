import { type RefObject } from 'react';

import { KEY_DOWN, KEY_END, KEY_HOME, KEY_TAB, KEY_UP } from '@atlaskit/ds-lib/keycodes';
import { fg } from '@atlaskit/platform-feature-flags';

import { type Action, type FocusableElementRef } from '../../types';

import { PREFIX } from './use-generated-id';

const actionMap: { [key: string]: Action } = {
	[KEY_DOWN]: 'next',
	[KEY_UP]: 'prev',
	[KEY_HOME]: 'first',
	[KEY_END]: 'last',
};

/**
 * `currentFocusedIdx + 1` will not work if the next focusable element
 * is disabled. So, we need to iterate through the following menu items
 * to find one that isn't disabled. If all following elements are disabled,
 * return undefined.
 */
const getNextFocusableElement = (refs: FocusableElementRef[], currentFocusedIdx: number) => {
	if (fg('dropdown-menu-disabled-navigation-fix')) {
		for (let i = 0; i < refs.length - 1; i++) {
			if (currentFocusedIdx + 1 === refs.length) {
				currentFocusedIdx = 0;
			} else {
				currentFocusedIdx++;
			}
			const { current: element } = refs[currentFocusedIdx];
			const isValid = !!element && !element.hasAttribute('disabled');
			if (isValid) {
				return element;
			}
		}
	} else {
		while (currentFocusedIdx + 1 < refs.length) {
			const { current: element } = refs[++currentFocusedIdx];
			const isValid = !!element && !element.hasAttribute('disabled');

			if (isValid) {
				return element;
			}
		}
	}
};

/**
 * `currentFocusedIdx - 1` will not work if the prev focusable element
 * is disabled. So, we need to iterate through the previous menu items
 * to find one that isn't disabled. If all previous elements are disabled,
 * return undefined.
 */
const getPrevFocusableElement = (refs: FocusableElementRef[], currentFocusedIdx: number) => {
	if (fg('dropdown-menu-disabled-navigation-fix')) {
		for (let i = 0; i < refs.length - 1; i++) {
			if (currentFocusedIdx === 0) {
				currentFocusedIdx = refs.length - 1;
			} else {
				currentFocusedIdx--;
			}
			const { current: element } = refs[currentFocusedIdx];
			const isValid = !!element && !element.hasAttribute('disabled');
			if (isValid) {
				return element;
			}
		}
	} else {
		while (currentFocusedIdx > 0) {
			const { current: element } = refs[--currentFocusedIdx];
			const isValid = !!element && !element.hasAttribute('disabled');

			if (isValid) {
				return element;
			}
		}
	}
};

export default function handleFocus(
	refs: RefObject<FocusableElementRef[]>,
	isLayerDisabled: () => boolean,
	onClose: (e: KeyboardEvent) => void,
) {
	return (e: KeyboardEvent) => {
		const currentRefs = refs.current ?? [];
		const currentFocusedIdx = currentRefs.findIndex(
			({ current: el }) => el && document.activeElement?.isSameNode(el),
		);

		if (fg('platform_dst_popup-disable-focuslock')) {
			// if we use a popup as a nested dropdown, we must prevent the dropdown from closing.
			const isNestedDropdown = !!document.activeElement?.closest(`[id^=${PREFIX}]`);
			if (isLayerDisabled() && isNestedDropdown) {
				if (e.key === KEY_TAB && !e.shiftKey) {
					onClose(e);
				}

				// if it is a nested dropdown and the level of the given dropdown is not the current level,
				// we don't need to have focus on it
				return;
			}
		} else {
			if (isLayerDisabled()) {
				if (e.key === KEY_TAB && !e.shiftKey) {
					onClose(e);
				}

				// if it is a nested dropdown and the level of the given dropdown is not the current level,
				// we don't need to have focus on it
				return;
			}
		}
		const action = actionMap[e.key];

		switch (action) {
			case 'next':
				// Always cancelling the event to prevent scrolling
				e.preventDefault();

				if (fg('dropdown-menu-disabled-navigation-fix')) {
					const nextFocusableElement = getNextFocusableElement(currentRefs, currentFocusedIdx);
					nextFocusableElement?.focus();
					break;
				}

				// Remove on FG cleanup dropdown-menu-disabled-navigation-fix
				if (currentFocusedIdx < currentRefs.length - 1) {
					const nextFocusableElement = getNextFocusableElement(currentRefs, currentFocusedIdx);
					nextFocusableElement?.focus();
				} else {
					const firstFocusableElement = getNextFocusableElement(currentRefs, -1);
					firstFocusableElement?.focus();
				}
				break;

			case 'prev':
				// Always cancelling the event to prevent scrolling
				e.preventDefault();

				if (fg('dropdown-menu-disabled-navigation-fix')) {
					const prevFocusableElement = getPrevFocusableElement(currentRefs, currentFocusedIdx);
					prevFocusableElement?.focus();
					break;
				}

				// Remove on FG cleanup dropdown-menu-disabled-navigation-fix
				if (currentFocusedIdx > 0) {
					const prevFocusableElement = getPrevFocusableElement(currentRefs, currentFocusedIdx);
					prevFocusableElement?.focus();
				} else {
					const lastFocusableElement = getPrevFocusableElement(currentRefs, currentRefs.length);
					lastFocusableElement?.focus();
				}
				break;

			case 'first':
				e.preventDefault();
				// Search for first non-disabled element if first element is disabled
				const nextFocusableElement = getNextFocusableElement(currentRefs, -1);
				nextFocusableElement?.focus();
				break;

			case 'last':
				e.preventDefault();
				// Search for last non-disabled element if last element is disabled
				const prevFocusableElement = getPrevFocusableElement(currentRefs, currentRefs.length);
				prevFocusableElement?.focus();
				break;

			default:
				return;
		}
	};
}
