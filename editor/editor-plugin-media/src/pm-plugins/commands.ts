import type { MediaADFAttrs } from '@atlaskit/adf-schema';
import type {
	EditorAnalyticsAPI,
	InputMethodInsertMedia,
	InsertMediaVia,
} from '@atlaskit/editor-common/analytics';
import type { EditorCommand } from '@atlaskit/editor-common/types';

import { ACTIONS } from '../pm-plugins/actions';
import {
	setAIGeneratingMeta,
	clearAIGeneratingMeta,
	type AIGeneratingSource,
} from '../pm-plugins/ai-generating-decoration';
import { stateKey } from '../pm-plugins/plugin-key';
import { getIdentifier } from '../pm-plugins/utils/media-common';

import { createInsertMediaAsMediaSingleCommand } from './utils/media-single';

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

/**
 * Sets the AI-generating decoration on a media node identified by `mediaId`.
 * The decoration triggers the AI border visual on the media's NodeView.
 *
 * Decorations live in the view layer only and never affect the document model
 * or undo/redo history.
 */
export const setAIGenerating =
	(mediaId: string, source?: AIGeneratingSource): EditorCommand =>
	({ tr }) =>
		setAIGeneratingMeta(tr, mediaId, source);

/**
 * Clears the AI-generating decoration for a specific media node identified by
 * `mediaId`. Removes the AI border visual from that media's NodeView.
 */
export const clearAIGenerating =
	(mediaId: string): EditorCommand =>
	({ tr }) =>
		clearAIGeneratingMeta(tr, mediaId);

export const insertMediaAsMediaSingleCommand =
	(editorAnalyticsAPI?: EditorAnalyticsAPI, allowPixelResizing?: boolean) =>
	(
		mediaAttrs: MediaADFAttrs,
		inputMethod: InputMethodInsertMedia,
		insertMediaVia?: InsertMediaVia,
		positions?: [number, number],
	): EditorCommand =>
		createInsertMediaAsMediaSingleCommand(
			mediaAttrs,
			inputMethod,
			editorAnalyticsAPI,
			insertMediaVia,
			allowPixelResizing,
			positions,
		);
