import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import VisuallyHidden from '@atlaskit/visually-hidden';

import type {
	AccessibilityUtilsPlugin,
	AccessibilityUtilsPluginState,
} from './accessibilityUtilsPluginType';

export const accessibilityUtilsPluginKey = new PluginKey('accessibilityUtilsPlugin');

export const accessibilityUtilsPlugin: AccessibilityUtilsPlugin = ({ api }) => {
	let editorView: EditorView | undefined;
	const setEditorView = (newEditorView: EditorView) => {
		editorView = newEditorView;
	};

	return {
		name: 'accessibilityUtils',
		actions: {
			ariaNotify: (message, ariaLiveElementAttributes) => {
				if (!editorView) {
					// at time of writing, this should never happen
					return;
				}

				const tr = editorView.state.tr;
				tr.setMeta(accessibilityUtilsPluginKey, {
					message,
					ariaLiveElementAttributes,
					key: Date.now().toString(),
				});
				editorView.dispatch(tr);

				return;
			},
		},
		contentComponent: () => {
			return <ContentComponent api={api} />;
		},
		getSharedState(editorState) {
			if (!editorState) {
				return null;
			}
			return accessibilityUtilsPluginKey.getState(editorState);
		},
		pmPlugins() {
			return [
				{
					name: 'get-editor-view',
					plugin: () => {
						return new SafePlugin({
							key: accessibilityUtilsPluginKey,
							state: {
								init: () => ({
									message: '',
									ariaLiveElementAttributes: {},
								}),
								apply: (tr: ReadonlyTransaction, prevState: AccessibilityUtilsPluginState) => {
									const meta = tr.getMeta(accessibilityUtilsPluginKey);
									if (meta) {
										return { ...prevState, ...meta };
									}
									return prevState;
								},
							},
							view(editorView: EditorView) {
								setEditorView(editorView);
								return {};
							},
						});
					},
				},
			];
		},
	};
};

function ContentComponent({
	api,
}: {
	api: ExtractInjectionAPI<AccessibilityUtilsPlugin> | undefined;
}) {
	const { accessibilityUtilsState } = useSharedPluginState(api, ['accessibilityUtils']);
	const role =
		accessibilityUtilsState?.ariaLiveElementAttributes?.priority === 'important'
			? 'alert'
			: 'status';
	const key = accessibilityUtilsState?.key;

	return (
		<VisuallyHidden
			testId={'accessibility-message-wrapper'}
			role={role}
			{...(role === 'alert' && { key })}
		>
			{accessibilityUtilsState?.message}
		</VisuallyHidden>
	);
}
