import type { InsertedImageProperties } from '@atlaskit/editor-common/provider-factory/image-upload-provider';
import type { Command } from '@atlaskit/editor-common/types/command';
import type { ImageUploadPluginReferenceEvent } from '@atlaskit/editor-common/types/image-upload-reference-event';
import { safeInsert } from '@atlaskit/editor-prosemirror/utils';

import type { ImageUploadPluginState } from '../types';
import { createExternalMediaNode } from '../ui/hooks/utils';
import { startUpload } from './actions';
import { stateKey } from './plugin-key';

export const insertExternalImage: (options: InsertedImageProperties) => Command =
	(options) => (state, dispatch) => {
		const pluginState = stateKey.getState(state);
		if (!pluginState?.enabled || !options.src) {
			return false;
		}

		const mediaNode = createExternalMediaNode(options.src, state.schema);
		if (!mediaNode) {
			return false;
		}
		if (dispatch) {
			dispatch(safeInsert(mediaNode, state.selection.$to.pos)(state.tr).scrollIntoView());
		}
		return true;
	};

export const startImageUpload: (event?: ImageUploadPluginReferenceEvent) => Command =
	(event) => (state, dispatch) => {
		const pluginState: ImageUploadPluginState | undefined = stateKey.getState(state);
		if (pluginState && !pluginState.enabled) {
			return false;
		}

		if (dispatch) {
			dispatch(startUpload(event)(state.tr));
		}
		return true;
	};
