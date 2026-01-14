import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorContentMode } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { ContentFormatPluginState, ContentFormatPlugin } from './contentFormatPluginType';

export const contentFormatPluginKey = new PluginKey('contentFormat');

export const createPlugin = ({
	initialContentMode,
}: {
	initialContentMode?: EditorContentMode;
}) => {
	return new SafePlugin<ContentFormatPluginState>({
		key: contentFormatPluginKey,
		state: {
			init: () => ({ contentMode: initialContentMode ?? 'standard' }),
			apply: (tr, currentPluginState) => {
				const meta = tr.getMeta(contentFormatPluginKey);
				if (meta) {
					const { contentMode } = meta;
					return { contentMode: contentMode ?? currentPluginState.contentMode };
				}
				return currentPluginState;
			},
		},
	});
};

export const contentFormatPlugin: ContentFormatPlugin = ({ config: options }) => {
	let previousContentMode: EditorContentMode | null | undefined;

	return {
		name: 'contentFormat',
		getSharedState(editorState): ContentFormatPluginState {
			if (!editorState) {
				return {
					contentMode: options?.initialContentMode ?? 'standard',
				} as ContentFormatPluginState;
			}
			const pluginState = contentFormatPluginKey.getState(editorState);
			return {
				contentMode: pluginState?.contentMode ?? 'standard',
			} as ContentFormatPluginState;
		},
		commands: {
			updateContentMode:
				(contentMode: EditorContentMode) =>
				({ tr }) => {
					if (contentMode === previousContentMode) {
						return null;
					}
					previousContentMode = contentMode;
					return tr.setMeta(contentFormatPluginKey, { contentMode });
				},
		},
		pmPlugins() {
			return [
				{
					name: 'contentFormat',
					plugin: () =>
						createPlugin({ initialContentMode: options?.initialContentMode ?? 'standard' }),
				},
			];
		},
	};
};
