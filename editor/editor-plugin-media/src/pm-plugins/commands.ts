import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type { EditorCommand } from '@atlaskit/editor-common/types';

import { ACTIONS } from '../pm-plugins/actions';
import { stateKey } from '../pm-plugins/plugin-key';
import { getIdentifier } from '../pm-plugins/utils/media-common';

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

export const trackMediaPaste =
	(attrs: MediaADFAttrs): EditorCommand =>
	({ tr }) => {
		const identifier = getIdentifier(attrs);
		tr.setMeta(stateKey, {
			type: ACTIONS.TRACK_MEDIA_PASTE,
			identifier,
		});
		return tr;
	};
