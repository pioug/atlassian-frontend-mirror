import React from 'react';

import { ACTION } from '@atlaskit/editor-common/analytics';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { PMPlugin, ToolbarUIComponentFactory } from '@atlaskit/editor-common/types';
import { redo, undo } from '@atlaskit/editor-prosemirror/history';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { attachInputMetaWithAnalytics } from './pm-plugins/attach-input-meta';
import { InputSource } from './pm-plugins/enums';
import { keymapPlugin } from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import { forceFocus } from './pm-plugins/utils';
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

	api?.primaryToolbar?.actions.registerComponent({
		name: 'undoRedoPlugin',
		component: primaryToolbarComponent,
	});

	const handleUndo = (inputSource?: InputSource): boolean => {
		if (!editorViewRef.current) {
			return false;
		}
		return forceFocus(
			editorViewRef.current,
			api,
		)(
			attachInputMetaWithAnalytics(api?.analytics?.actions)(
				inputSource || InputSource.EXTERNAL,
				ACTION.UNDO_PERFORMED,
			)(undo),
		);
	};

	const handleRedo = (inputSource?: InputSource): boolean => {
		if (!editorViewRef.current) {
			return false;
		}
		return forceFocus(
			editorViewRef.current,
			api,
		)(
			attachInputMetaWithAnalytics(api?.analytics?.actions)(
				inputSource || InputSource.EXTERNAL,
				ACTION.REDO_PERFORMED,
			)(redo),
		);
	};

	return {
		name: 'undoRedoPlugin',

		actions: {
			undo: handleUndo,
			redo: handleRedo,
		},

		pmPlugins() {
			const plugins: Array<PMPlugin> = [
				{
					name: 'undoRedoKeyMap',
					plugin: () => keymapPlugin(api),
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

		primaryToolbarComponent: !api?.primaryToolbar ? primaryToolbarComponent : undefined,
	};
};
