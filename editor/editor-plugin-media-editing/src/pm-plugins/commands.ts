import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type { EditorCommand } from '@atlaskit/editor-common/types';

import { ACTIONS } from './actions';
import { mediaEditingPluginKey } from './main';

export const showImageEditor =
	(media: MediaADFAttrs): EditorCommand =>
	({ tr }) => {
		tr.setMeta(mediaEditingPluginKey, {
			type: ACTIONS.SHOW_IMAGE_EDITOR,
			imageEditorSelectedMedia: media,
			isImageEditorVisible: true,
		});
		tr.setMeta('addToHistory', false);
		return tr;
	};

export const hideImageEditor: EditorCommand = ({ tr }) => {
	tr.setMeta(mediaEditingPluginKey, {
		type: ACTIONS.HIDE_IMAGE_EDITOR,
		imageEditorSelectedMedia: null,
		isImageEditorVisible: false,
	});
	tr.setMeta('addToHistory', false);
	return tr;
};
