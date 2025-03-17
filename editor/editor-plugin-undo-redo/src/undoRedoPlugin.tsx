import React from 'react';

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPlugin, ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';
import { redo, undo } from '@atlaskit/editor-prosemirror/history';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { attachInputMeta } from './pm-plugins/attach-input-meta';
import { keymapPlugin } from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import ToolbarUndoRedo from './ui/ToolbarUndoRedo';
import type { UndoRedoPlugin } from './undoRedoPluginType';

export const undoRedoPlugin: UndoRedoPlugin = ({ api }) => {
	const editorViewRef: Record<'current', EditorView | null> = { current: null };

	const primaryToolbarComponent: ToolbarUIComponentFactory = ({
		editorView,
		disabled,
		isToolbarReducedSpacing,
	}) => {
		return (
			<ToolbarUndoRedo
				isReducedSpacing={isToolbarReducedSpacing}
				disabled={disabled}
				editorView={editorView}
				api={api}
			/>
		);
	};

	if (editorExperiment('platform_editor_controls', 'control', { exposure: true })) {
		api?.primaryToolbar?.actions.registerComponent({
			name: 'undoRedoPlugin',
			component: primaryToolbarComponent,
		});
	}

	return {
		name: 'undoRedoPlugin',

		actions: {
			undo: (inputSource) => {
				if (!editorViewRef.current) {
					return false;
				}

				const { state, dispatch } = editorViewRef.current;
				if (!inputSource) {
					return undo(state, dispatch);
				}
				return attachInputMeta(inputSource)(undo)(state, dispatch);
			},
			redo: (inputSource) => {
				if (!editorViewRef.current) {
					return false;
				}

				const { state, dispatch } = editorViewRef.current;
				if (!inputSource) {
					return redo(state, dispatch);
				}
				return attachInputMeta(inputSource)(redo)(state, dispatch);
			},
		},

		pmPlugins() {
			const plugins: Array<PMPlugin> = [
				{
					name: 'undoRedoKeyMap',
					plugin: () => keymapPlugin(),
				},
				{
					name: 'undoRedoPlugin',
					plugin: (options) => createPlugin(options),
				},
			];

			if (editorExperiment('platform_editor_controls', 'variant1', { exposure: false })) {
				plugins.push({
					name: 'undoRedoGetEditorViewReferencePlugin',
					plugin: () => {
						return new SafePlugin({
							view: (editorView: EditorView) => {
								editorViewRef.current = editorView;
								return {
									destroy: () => {
										editorViewRef.current = null;
									},
								};
							},
						});
					},
				});
			}

			return plugins;
		},

		primaryToolbarComponent:
			!api?.primaryToolbar &&
			editorExperiment('platform_editor_controls', 'control', { exposure: true })
				? primaryToolbarComponent
				: undefined,
	};
};
