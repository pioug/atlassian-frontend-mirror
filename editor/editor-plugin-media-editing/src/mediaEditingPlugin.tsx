import React from 'react';

import {
	type NamedPluginStatesFromInjectionAPI,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { MediaEditingPlugin } from './mediaEditingPluginType';
import { showImageEditor, hideImageEditor } from './pm-plugins/commands';
import { createPlugin, mediaEditingPluginKey } from './pm-plugins/main';
import { RenderImageEditor } from './ui/ImageEditor/ModalWrapper';

type ImageEditorFunctionalComponentProps = {
	api: ExtractInjectionAPI<MediaEditingPlugin> | undefined;
	editorView: EditorView;
};

const imageEditorStateSelector = (
	states: NamedPluginStatesFromInjectionAPI<
		ExtractInjectionAPI<MediaEditingPlugin>,
		'mediaEditing' | 'media'
	>,
) => {
	return {
		isImageEditorVisible: states.mediaEditingState?.isImageEditorVisible,
		imageEditorSelectedMedia: states.mediaEditingState?.imageEditorSelectedMedia,
		mediaClientConfig: states.mediaState?.mediaClientConfig,
	};
};

const ImageEditorFunctionalComponent = ({ api, editorView }: ImageEditorFunctionalComponentProps) => {
	const { isImageEditorVisible, imageEditorSelectedMedia, mediaClientConfig } =
		useSharedPluginStateWithSelector(api, ['mediaEditing', 'media'], imageEditorStateSelector);

	if (!isImageEditorVisible || !imageEditorSelectedMedia || !mediaClientConfig) {
		return null;
	}

	const handleOnClose = () => {
		api?.core.actions.execute(api?.mediaEditing.commands.hideImageEditor);
	};

	return (
		<RenderImageEditor
			mediaClientConfig={mediaClientConfig}
			onClose={handleOnClose}
			selectedNodeAttrs={imageEditorSelectedMedia}
			editorView={editorView}
		/>
	);
};

export const mediaEditingPlugin: MediaEditingPlugin = ({ api }) => ({
	name: 'mediaEditing',
	getSharedState(editorState) {
		if (!editorState) {
			return null;
		}
		return mediaEditingPluginKey.getState(editorState) || null;
	},
	commands: {
		showImageEditor,
		hideImageEditor,
	},
	pmPlugins() {
		return [
			{
				name: 'mediaEditingPlugin',
				plugin: createPlugin,
			},
		];
	},

	contentComponent({ editorView }) {
		if (!editorView) {
			return null;
		}

		return <ImageEditorFunctionalComponent api={api} editorView={editorView} />;
	},
});
