import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type { EditorCommand } from '@atlaskit/editor-common/types';

import { ACTIONS } from '../pm-plugins/actions';
import { stateKey } from '../pm-plugins/plugin-key';

export const showMediaViewer =
	(media: MediaADFAttrs): EditorCommand =>
	({ tr }) => {
		tr.setMeta(stateKey, {
			type: ACTIONS.SHOW_MEDIA_VIEWER,
			mediaViewerSelectedMedia: media,
			isMediaViewerVisible: true,
		});
		return tr;
	};

export const hideMediaViewer: EditorCommand = ({ tr }) => {
	tr.setMeta(stateKey, {
		type: ACTIONS.HIDE_MEDIA_VIEWER,
		mediaViewerSelectedMedia: null,
		isMediaViewerVisible: false,
	});
	return tr;
};
