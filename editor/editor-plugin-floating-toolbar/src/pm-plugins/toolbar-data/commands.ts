import type { Command } from '@atlaskit/editor-common/types';

import { createCommand } from './plugin-factory';

export const showConfirmDialog = (buttonIndex: number, optionIndex?: number): Command =>
	createCommand(
		{
			type: 'SHOW_CONFIRM_DIALOG',
			data: { buttonIndex, optionIndex },
		},
		(tr) => tr.setMeta('addToHistory', false),
	);

export const hideConfirmDialog = (): Command =>
	createCommand(
		{
			type: 'HIDE_CONFIRM_DIALOG',
		},
		(tr) => tr.setMeta('addToHistory', false),
	);
