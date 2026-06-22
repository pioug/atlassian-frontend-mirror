import type { EditorCommand } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import type { ActiveTableMenu, PluginInjectionAPI } from '../../types';
import { pluginKey } from '../plugin-key';
import { isFullRowOrColumnSelected } from '../utils/selection';

const applyMenuUserIntent = (
	tr: Transaction,
	api: PluginInjectionAPI | undefined | null,
	nextActiveTableMenu: ActiveTableMenu,
) => {
	if (nextActiveTableMenu.type === 'row' || nextActiveTableMenu.type === 'column') {
		api?.userIntent?.commands.setCurrentUserIntent('tableDragMenuPopupOpen')({ tr });
		return;
	}

	api?.userIntent?.commands.setCurrentUserIntent(
		isFullRowOrColumnSelected(tr.selection) ? 'dragHandleSelected' : 'default',
	)({ tr });
};

export const closeActiveTableMenu =
	(api?: PluginInjectionAPI | null, options?: { skipUserIntent?: boolean }): EditorCommand =>
	({ tr }) => {
		const nextActiveTableMenu: ActiveTableMenu = { type: 'none' };
		tr.setMeta(pluginKey, {
			type: 'SET_ACTIVE_TABLE_MENU',
			data: {
				activeTableMenu: nextActiveTableMenu,
			},
		});

		if (!options?.skipUserIntent) {
			applyMenuUserIntent(tr, api, nextActiveTableMenu);
		}

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
		api?: PluginInjectionAPI | null,
	): EditorCommand =>
	({ tr }) => {
		const nextActiveTableMenu: ActiveTableMenu = isSameActiveTableMenu(
			currentActiveTableMenu,
			activeTableMenu,
		)
			? { type: 'none' }
			: activeTableMenu;
		tr.setMeta(pluginKey, {
			type: 'SET_ACTIVE_TABLE_MENU',
			data: {
				activeTableMenu: nextActiveTableMenu,
			},
		});
		applyMenuUserIntent(tr, api, nextActiveTableMenu);
		tr.setMeta('addToHistory', false);
		return tr;
	};
