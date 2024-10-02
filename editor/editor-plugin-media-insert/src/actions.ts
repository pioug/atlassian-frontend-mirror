import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { pluginKey } from './pm-plugins/plugin-key';

export type MediaInsertPluginAction = typeof ACTION_OPEN_POPUP | typeof ACTION_CLOSE_POPUP;

export const ACTION_OPEN_POPUP = 'OPEN_POPUP';
export const ACTION_CLOSE_POPUP = 'CLOSE_POPUP';

const setPopupMeta = ({
	type,
	tr,
	mountInfo,
}: {
	type: MediaInsertPluginAction;
	mountInfo?: { ref: HTMLElement; mountPoint: HTMLElement };
	tr: Transaction;
}) => tr.setMeta(pluginKey, { type, mountInfo });

export const showMediaInsertPopup = (
	tr: Transaction,
	mountInfo?: { ref: HTMLElement; mountPoint: HTMLElement },
) => {
	// Log exposure here but don't actually switch anything on it
	editorExperiment('add-media-from-url', true, {
		exposure: true,
	});
	return setPopupMeta({ type: ACTION_OPEN_POPUP, mountInfo, tr });
};

export const closeMediaInsertPicker = (tr: Transaction) => {
	return setPopupMeta({ type: ACTION_CLOSE_POPUP, tr });
};
