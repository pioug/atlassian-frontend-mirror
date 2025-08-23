import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { pluginKey } from './plugin-key';

export type MediaInsertPluginAction = typeof ACTION_OPEN_POPUP | typeof ACTION_CLOSE_POPUP;

export const ACTION_OPEN_POPUP = 'OPEN_POPUP';
export const ACTION_CLOSE_POPUP = 'CLOSE_POPUP';

const setPopupMeta = ({
	type,
	tr,
	mountInfo,
}: {
	mountInfo?: { mountPoint: HTMLElement; ref: HTMLElement };
	tr: Transaction;
	type: MediaInsertPluginAction;
}) => tr.setMeta(pluginKey, { type, mountInfo });

export const showMediaInsertPopup = (
	tr: Transaction,
	mountInfo?: { mountPoint: HTMLElement; ref: HTMLElement },
) => {
	return setPopupMeta({ type: ACTION_OPEN_POPUP, mountInfo, tr });
};

export const closeMediaInsertPicker = (tr: Transaction) => {
	return setPopupMeta({ type: ACTION_CLOSE_POPUP, tr });
};
