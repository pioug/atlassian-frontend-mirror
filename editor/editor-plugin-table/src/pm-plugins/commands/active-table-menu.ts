import type { Command } from '@atlaskit/editor-common/types';

import type { ActiveTableMenu } from '../../types';
import { createCommand, getPluginState } from '../plugin-factory';

export const closeActiveTableMenu = (): Command =>
	createCommand(
		(state) => {
			const { activeTableMenu } = getPluginState(state);
			if (!activeTableMenu || activeTableMenu.type === 'none') {
				return false;
			}

			return {
				type: 'SET_ACTIVE_TABLE_MENU',
				data: {
					activeTableMenu: { type: 'none' },
				},
			};
		},
		(tr) => tr.setMeta('addToHistory', false),
	);

const isSameActiveTableMenu = (current: ActiveTableMenu | undefined, next: ActiveTableMenu) => {
	if (!current || current.type !== next.type) {
		return false;
	}

	if (current.type === 'row' || current.type === 'column') {
		return next.type === current.type && current.index === next.index;
	}

	return true;
};

export const toggleActiveTableMenu = (
	activeTableMenu: Exclude<ActiveTableMenu, { type: 'none' }>,
): Command =>
	createCommand(
		(state) => {
			const { activeTableMenu: currentActiveTableMenu } = getPluginState(state);
			return {
				type: 'SET_ACTIVE_TABLE_MENU',
				data: {
					activeTableMenu: isSameActiveTableMenu(currentActiveTableMenu, activeTableMenu)
						? { type: 'none' }
						: activeTableMenu,
				},
			};
		},
		(tr) => tr.setMeta('addToHistory', false),
	);
