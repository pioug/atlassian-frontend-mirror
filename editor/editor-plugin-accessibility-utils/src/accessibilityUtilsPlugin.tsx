import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
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
	const { accessibilityUtilsState } = useSharedPluginState(api, ['accessibilityUtils'], {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
	});

	const ariaLiveElementAttributesSelector = useSharedPluginStateSelector(
		api,
		'accessibilityUtils.ariaLiveElementAttributes',
		{
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
		},
	);
	const ariaLiveElementAttributes = editorExperiment(
		'platform_editor_usesharedpluginstateselector',
		true,
	)
		? ariaLiveElementAttributesSelector
		: accessibilityUtilsState?.ariaLiveElementAttributes;

	const keySelector = useSharedPluginStateSelector(api, 'accessibilityUtils.key', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const key = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? keySelector
		: accessibilityUtilsState?.key;

	const messageSelector = useSharedPluginStateSelector(api, 'accessibilityUtils.message', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const message = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? messageSelector
		: accessibilityUtilsState?.message;

	const role = ariaLiveElementAttributes?.priority === 'important' ? 'alert' : 'status';

	return (
		<VisuallyHidden
			testId={'accessibility-message-wrapper'}
			role={role}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...(role === 'alert' && { key })}
		>
			{message}
		</VisuallyHidden>
	);
}
