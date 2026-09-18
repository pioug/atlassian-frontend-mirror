// eslint-disable-next-line import/order
import type { Command } from '@atlaskit/editor-common/types';

import { createCommand } from './plugin-state';
import type { RowStickyState } from './types';

export const updateStickyState = (rowState: RowStickyState): Command =>
	createCommand({ name: 'UPDATE', state: rowState }, (tr) => tr.setMeta('addToHistory', false));

export const removeStickyState = (pos: number): Command =>
	createCommand({ name: 'REMOVE', pos }, (tr) => tr.setMeta('addToHistory', false));
