import React from 'react';

import { browser } from '@atlaskit/linking-common/user-agent';

import { type ClickOutcome, type ClickType } from './types';

const isContentEditable = (el: Element) => {
	return el instanceof HTMLElement && el.isContentEditable;
};

export function getLinkClickOutcome(e: React.MouseEvent, clickType: ClickType): ClickOutcome {
	const { mac, safari } = browser();

	/**
	 * If the link/parent is content editable then left click won't have typical effect
	 */
	if (isContentEditable(e.currentTarget) && ['left', 'middle'].includes(clickType)) {
		return 'contentEditable';
	}

	switch (clickType) {
		case 'left':
		case 'keyboard': {
			// Meta key = Cmd for macOS, Windows key sometimes for Windows (otherwise false)
			// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey
			if (e.metaKey) {
				return mac ? 'clickThroughNewTabOrWindow' : 'clickThrough';
			}

			if (e.shiftKey) {
				// Alt/option click in safari typically adds the link to bookmarks
				if (safari) {
					return 'alt';
				}
				return 'clickThroughNewTabOrWindow';
			}

			if (e.ctrlKey) {
				// Ctrl+Left on macOS defaults to triggering a right click instead (so won't trigger onClick)
				// but if this behaviour is disabled, likely outcome is clickThrough
				if (mac) {
					return 'clickThrough';
				}
				return 'clickThroughNewTabOrWindow';
			}

			if (e.altKey) {
				return 'alt';
			}

			const target = e.currentTarget.getAttribute('target');

			if (target === '_blank') {
				return 'clickThroughNewTabOrWindow';
			}

			return 'clickThrough';
		}

		case 'middle': {
			return 'clickThroughNewTabOrWindow';
		}

		case 'right': {
			return 'contextMenu';
		}
	}

	return 'unknown';
}
