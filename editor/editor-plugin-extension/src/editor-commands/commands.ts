import type { ExtensionLayout } from '@atlaskit/adf-schema';
import type { EditorAnalyticsAPI, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	TARGET_SELECTION_SOURCE,
} from '@atlaskit/editor-common/analytics';
import type {
	Parameters,
	TransformAfter,
	TransformBefore,
} from '@atlaskit/editor-common/extensions';
import { removeConnectedNodes } from '@atlaskit/editor-common/utils';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import {
	type EditorState,
	NodeSelection,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
	findParentNodeOfType,
	removeParentNodeOfType,
	removeSelectedNode,
} from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ExtensionAction, ExtensionState, RejectSave } from '../extensionPluginType';
import { createCommand } from '../pm-plugins/plugin-factory';
import { getSelectedExtension } from '../pm-plugins/utils';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points

export function updateState(state: Partial<ExtensionState>) {
	return createCommand({
		type: 'UPDATE_STATE',
		data: state,
	});
}

export function setEditingContextToContextPanel<T extends Parameters = Parameters>(
	processParametersBefore: TransformBefore<T>,
	processParametersAfter: TransformAfter<T>,
	applyChangeToContextPanel: ApplyChangeHandler | undefined,
) {
	return createCommand<ExtensionAction<T>>(
		{
			type: 'UPDATE_STATE',
			data: {
				showContextPanel: true,
				processParametersBefore,
				processParametersAfter,
			},
		},
		applyChangeToContextPanel,
	);
}

export const clearEditingContext = (applyChangeToContextPanel: ApplyChangeHandler | undefined) =>
	createCommand(
		{
			type: 'UPDATE_STATE',
			data: {
				showContextPanel: false,
				processParametersBefore: undefined,
				processParametersAfter: undefined,
			},
		},
		applyChangeToContextPanel,
	);

export const forceAutoSave =
	(applyChangeToContextPanel: ApplyChangeHandler | undefined) =>
	(resolve: () => void, reject?: RejectSave) =>
		createCommand(
			{
				type: 'UPDATE_STATE',
				data: { autoSaveResolve: resolve, autoSaveReject: reject },
			},
			applyChangeToContextPanel,
		);

export const updateExtensionLayout = (layout: ExtensionLayout, analyticsApi?: EditorAnalyticsAPI) =>
	createCommand({ type: 'UPDATE_STATE', data: { layout } }, (tr, state) => {
		const selectedExtension = getSelectedExtension(state, true);

		if (selectedExtension) {
			const trWithNewNodeMarkup: Transaction = tr.setNodeMarkup(selectedExtension.pos, undefined, {
				...selectedExtension.node.attrs,
				layout,
			});
			trWithNewNodeMarkup.setMeta('scrollIntoView', false);
			if (analyticsApi) {
				analyticsApi.attachAnalyticsEvent({
					action: ACTION.UPDATED,
					actionSubject: ACTION_SUBJECT.EXTENSION,
					actionSubjectId: ACTION_SUBJECT_ID.EXTENSION,
					eventType: EVENT_TYPE.TRACK,
					attributes: {
						extensionType: selectedExtension.node.attrs.extensionType,
						extensionKey: selectedExtension.node.attrs.extensionKey,
						localId: selectedExtension.node.attrs.localId,
						layout,
						selection: tr.selection.toJSON(),
						targetSelectionSource: TARGET_SELECTION_SOURCE.CURRENT_SELECTION,
					},
				})(tr);
			}
			return trWithNewNodeMarkup;
		}

		return tr;
	});

export const removeExtension = (
	editorAnalyticsAPI?: EditorAnalyticsAPI,
	inputMethod?: INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB,
) =>
	createCommand(
		{
			type: 'UPDATE_STATE',
			data: { element: undefined },
		},
		(tr, state) => {
			if (getSelectedExtension(state)) {
				return removeSelectedNodeWithAnalytics(state, tr, editorAnalyticsAPI, inputMethod);
			} else {
				return checkAndRemoveExtensionNode(state, tr, editorAnalyticsAPI, inputMethod);
			}
		},
	);

export const removeDescendantNodes = (sourceNode?: PMNode) =>
	createCommand(
		{
			type: 'UPDATE_STATE',
			data: { element: undefined },
		},
		(tr, state) => {
			return sourceNode ? removeConnectedNodes(state, sourceNode) : tr;
		},
	);

export const removeSelectedNodeWithAnalytics = (
	state: EditorState,
	tr: Transaction,
	analyticsApi?: EditorAnalyticsAPI,
	inputMethod?: INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB,
) => {
	if (state.selection instanceof NodeSelection) {
		const node = state.selection.node;
		if (analyticsApi) {
			analyticsApi.attachAnalyticsEvent({
				action: ACTION.DELETED,
				actionSubject: ACTION_SUBJECT.EXTENSION,
				actionSubjectId: ACTION_SUBJECT_ID.EXTENSION,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					extensionType: node.attrs.extensionType,
					extensionKey: node.attrs.extensionKey,
					localId: node.attrs.localId,
					inputMethod: fg('platform_editor_controls_patch_analytics_2') ? inputMethod : undefined,
				},
			})(tr);
		}
	}

	return removeSelectedNode(tr);
};

export const checkAndRemoveExtensionNode = (
	state: EditorState,
	tr: Transaction,
	analyticsApi?: EditorAnalyticsAPI,
	inputMethod?: INPUT_METHOD.TOOLBAR | INPUT_METHOD.FLOATING_TB,
) => {
	let nodeType = state.schema.nodes.bodiedExtension;

	const maybeMBENode = findParentNodeOfType(state.schema.nodes.multiBodiedExtension)(
		state.selection,
	);
	if (maybeMBENode) {
		nodeType = state.schema.nodes.multiBodiedExtension;
		if (analyticsApi) {
			analyticsApi.attachAnalyticsEvent({
				action: ACTION.DELETED,
				actionSubject: ACTION_SUBJECT.MULTI_BODIED_EXTENSION,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					extensionType: maybeMBENode.node.attrs.extensionType,
					extensionKey: maybeMBENode.node.attrs.extensionKey,
					localId: maybeMBENode.node.attrs.localId,
					currentFramesCount: maybeMBENode.node.content.childCount,
					inputMethod: fg('platform_editor_controls_patch_analytics_2') ? inputMethod : undefined,
				},
			})(tr);
		}
	}

	const bodiedExtensionNode = findParentNodeOfType(state.schema.nodes.bodiedExtension)(
		state.selection,
	);
	if (bodiedExtensionNode) {
		if (analyticsApi) {
			analyticsApi.attachAnalyticsEvent({
				action: ACTION.DELETED,
				actionSubject: ACTION_SUBJECT.EXTENSION,
				actionSubjectId: ACTION_SUBJECT_ID.EXTENSION_BODIED,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					extensionType: bodiedExtensionNode.node.attrs.extensionType,
					extensionKey: bodiedExtensionNode.node.attrs.extensionKey,
					localId: bodiedExtensionNode.node.attrs.localId,
					inputMethod: fg('platform_editor_controls_patch_analytics_2') ? inputMethod : undefined,
				},
			})(tr);
		}
	}

	return removeParentNodeOfType(nodeType)(tr);
};
