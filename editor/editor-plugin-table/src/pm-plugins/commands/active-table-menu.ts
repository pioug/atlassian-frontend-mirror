import type { EditorCommand } from '@atlaskit/editor-common/types';

import type { ActiveTableMenu } from '../../types';
import { pluginKey } from '../plugin-key';

export const closeActiveTableMenu =
	(): EditorCommand =>
	({ tr }) => {
		tr.setMeta(pluginKey, {
			type: 'SET_ACTIVE_TABLE_MENU',
			data: {
				activeTableMenu: { type: 'none' },
			},
		});
		if (!tr.docChanged) {
			tr.setMeta('addToHistory', false);
		}
		return tr;
	};

const isSameActiveTableMenu = (current: ActiveTableMenu | undefined, next: ActiveTableMenu) => {
	if (!current || current.type !== next.type) {
		return false;
	}

	if (current.type === 'row' || current.type === 'column') {
		return next.type === current.type && current.index === next.index;
	}

	return true;
};

export const toggleActiveTableMenu =
	(
		activeTableMenu: Exclude<ActiveTableMenu, { type: 'none' }>,
		currentActiveTableMenu: ActiveTableMenu | undefined,
	): EditorCommand =>
	({ tr }) => {
		tr.setMeta(pluginKey, {
			type: 'SET_ACTIVE_TABLE_MENU',
			data: {
				activeTableMenu: isSameActiveTableMenu(currentActiveTableMenu, activeTableMenu)
					? { type: 'none' }
					: activeTableMenu,
			},
		});
		tr.setMeta('addToHistory', false);
		return tr;
	};
