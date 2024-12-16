import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
	TARGET_SELECTION_SOURCE,
} from '@atlaskit/editor-common/analytics';
export { transformSliceToRemoveOpenBodiedExtension } from '@atlaskit/editor-common/transforms';
import type {
	EditorAnalyticsAPI,
	ExtensionType,
	SelectionJson,
} from '@atlaskit/editor-common/analytics';
import type { ExtensionAPI, Parameters, UpdateExtension } from '@atlaskit/editor-common/extensions';
import type { MacroProvider } from '@atlaskit/editor-common/provider-factory';
import type { Command, CommandDispatch } from '@atlaskit/editor-common/types';
import type { ApplyChangeHandler } from '@atlaskit/editor-plugin-context-panel';
import type { Fragment, Mark, Node as PmNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import {
	NodeSelection,
	Selection,
	TextSelection,
	type Transaction,
} from '@atlaskit/editor-prosemirror/state';
import {
	findSelectedNodeOfType,
	replaceParentNodeOfType,
	replaceSelectedNode,
} from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { InsertOrReplaceExtensionType } from '../extensionPluginType';
import { createExtensionAPI, getEditInLegacyMacroBrowser } from '../pm-plugins/extension-api';
import { getPluginState } from '../pm-plugins/main';
import { findExtensionWithLocalId } from '../pm-plugins/utils';

export const buildExtensionNode = <S extends Schema>(
	type: 'inlineExtension' | 'extension' | 'bodiedExtension' | 'multiBodiedExtension',
	schema: S,
	attrs: object,
	content?: Fragment,
	marks?: readonly Mark[],
) => {
	switch (type) {
		case 'extension':
			return schema.nodes.extension.createChecked(attrs, content, marks);
		case 'inlineExtension':
			return schema.nodes.inlineExtension.createChecked(attrs, content, marks);
		case 'bodiedExtension':
			return schema.nodes.bodiedExtension.create(attrs, content, marks);
		case 'multiBodiedExtension':
			return schema.nodes.multiBodiedExtension.create(attrs, content, marks);
	}
};

export const performNodeUpdate =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(
		type: 'inlineExtension' | 'extension' | 'bodiedExtension' | 'multiBodiedExtension',
		newAttrs: object,
		content: Fragment,
		marks: readonly Mark[],
		shouldScrollIntoView: boolean,
	): Command =>
	(_state, _dispatch, view) => {
		if (!view) {
			throw Error('EditorView is required to perform node update!');
		}
		// NOTE: `state` and `dispatch` are stale at this point so we need to grab
		// the latest one from `view` @see HOT-93986
		const { state, dispatch } = view;

		const newNode = buildExtensionNode(type, state.schema, newAttrs, content, marks);

		if (!newNode) {
			return false;
		}

		const { selection, schema } = state;
		const { extension, inlineExtension, bodiedExtension, multiBodiedExtension } = schema.nodes;
		const isBodiedExtensionSelected = !!findSelectedNodeOfType([bodiedExtension])(selection);
		const isMultiBodiedExtensionSelected = !!findSelectedNodeOfType([multiBodiedExtension])(
			selection,
		);
		const extensionState = getPluginState(state);
		const updateSelectionsByNodeType = (nodeType: Schema['nodes'][string]) => {
			// Bodied/MultiBodied extensions can trigger an update when the cursor is inside which means that there is no node selected.
			// To work around that we replace the parent and create a text selection instead of new node selection
			tr = replaceParentNodeOfType(nodeType, newNode)(tr);
			// Replacing selected node doesn't update the selection. `selection.node` still returns the old node
			tr.setSelection(TextSelection.create(tr.doc, state.selection.anchor));
		};
		let targetSelectionSource: TARGET_SELECTION_SOURCE = TARGET_SELECTION_SOURCE.CURRENT_SELECTION;
		let action = ACTION.UPDATED;
		let { tr } = state;

		// When it's a bodiedExtension but not selected
		if (newNode.type === bodiedExtension && !isBodiedExtensionSelected) {
			updateSelectionsByNodeType(state.schema.nodes.bodiedExtension);
		}
		// When it's a multiBodiedExtension but not selected
		else if (newNode.type === multiBodiedExtension && !isMultiBodiedExtensionSelected) {
			updateSelectionsByNodeType(state.schema.nodes.multiBodiedExtension);
		}
		// If any extension is currently selected
		else if (
			findSelectedNodeOfType([extension, bodiedExtension, inlineExtension, multiBodiedExtension])(
				selection,
			)
		) {
			tr = replaceSelectedNode(newNode)(tr);
			// Replacing selected node doesn't update the selection. `selection.node` still returns the old node
			tr.setSelection(NodeSelection.create(tr.doc, tr.mapping.map(state.selection.anchor)));
		}
		// When we loose the selection. This usually happens when Synchrony resets or changes
		// the selection when user is in the middle of updating an extension.
		else if (extensionState.element) {
			const pos = view.posAtDOM(extensionState.element, -1);
			if (pos > -1) {
				tr = tr.replaceWith(pos, pos + (content.size || 0) + 1, newNode);
				tr.setSelection(Selection.near(tr.doc.resolve(pos)));
				targetSelectionSource = TARGET_SELECTION_SOURCE.HTML_ELEMENT;
			} else {
				action = ACTION.ERRORED;
			}
		}

		// Only scroll if we have anything to update, best to avoid surprise scroll
		if (dispatch && tr.docChanged) {
			const { extensionType, extensionKey, layout, localId } = newNode.attrs;
			editorAnalyticsAPI?.attachAnalyticsEvent({
				action,
				actionSubject: ACTION_SUBJECT.EXTENSION,
				actionSubjectId: newNode.type.name as ExtensionType,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					// @ts-expect-error - Type is not assignable to parameter of type 'AnalyticsEventPayload'
					// This error was introduced after upgrading to TypeScript 5
					inputMethod: INPUT_METHOD.CONFIG_PANEL,
					extensionType,
					extensionKey,
					layout,
					localId,
					selection: tr.selection.toJSON() as SelectionJson,
					targetSelectionSource,
				},
			})(tr);
			dispatch(shouldScrollIntoView ? tr.scrollIntoView() : tr);
		}
		return true;
	};

const updateExtensionParams =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(
		updateExtension: UpdateExtension<Parameters>,
		node: { node: PmNode; pos: number },
		actions: ExtensionAPI,
	) =>
	async (state: EditorState, dispatch?: CommandDispatch, view?: EditorView): Promise<boolean> => {
		const { attrs, type, content, marks } = node.node;

		if (!state.schema.nodes[type.name]) {
			return false;
		}

		const { parameters } = attrs;
		try {
			const newParameters = await updateExtension(parameters, actions);

			if (newParameters) {
				const newAttrs = {
					...attrs,
					parameters: {
						...parameters,
						...newParameters,
					},
				};

				if (type.name === 'multiBodiedExtension') {
					newAttrs.parameters.macroParams = {
						...parameters.macroParams,
						...newParameters?.macroParams,
					};
				}

				return performNodeUpdate(editorAnalyticsAPI)(
					type.name as 'inlineExtension' | 'extension' | 'bodiedExtension' | 'multiBodiedExtension',
					newAttrs,
					content,
					marks,
					true,
				)(state, dispatch, view);
			}
		} catch {}
		return true;
	};

export const editExtension =
	(
		macroProvider: MacroProvider | null | undefined,
		applyChangeToContextPanel: ApplyChangeHandler | undefined,
		editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
		updateExtension?: Promise<UpdateExtension<object> | void>,
	): Command =>
	(state, dispatch, view): boolean => {
		if (!view) {
			return false;
		}
		const { localId } = getPluginState(state);
		const nodeWithPos = findExtensionWithLocalId(state, localId);

		if (!nodeWithPos) {
			return false;
		}

		const editInLegacyMacroBrowser = getEditInLegacyMacroBrowser({
			view,
			macroProvider: macroProvider || undefined,
			editorAnalyticsAPI,
		});

		if (updateExtension) {
			updateExtension.then((updateMethod) => {
				if (updateMethod && view) {
					const actions = createExtensionAPI({
						editorView: view,
						editInLegacyMacroBrowser,
						applyChange: applyChangeToContextPanel,
						editorAnalyticsAPI,
					});

					updateExtensionParams(editorAnalyticsAPI)(updateMethod, nodeWithPos, actions)(
						state,
						dispatch,
						view,
					);

					return;
				}

				if (!updateMethod && macroProvider) {
					editInLegacyMacroBrowser();
					return;
				}
			});
		} else {
			if (!macroProvider) {
				return false;
			}

			editInLegacyMacroBrowser();
		}

		return true;
	};

type Props = {
	editorViewRef: Record<'current', EditorView | null>;
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined;
	applyChangeToContextPanel: ApplyChangeHandler | undefined;
};
export const createEditSelectedExtensionAction =
	({ editorViewRef, editorAnalyticsAPI, applyChangeToContextPanel }: Props) =>
	() => {
		const { current: view } = editorViewRef;
		if (!view) {
			return false;
		}

		const { updateExtension } = getPluginState(view.state);

		return editExtension(
			null,
			applyChangeToContextPanel,
			editorAnalyticsAPI,
			updateExtension,
		)(view.state, view.dispatch, view);
	};

export const insertOrReplaceExtension = ({
	editorView,
	action,
	attrs,
	content,
	position,
	size = 0,
	tr,
}: InsertOrReplaceExtensionType): Transaction => {
	const newNode = editorView.state.schema.node('extension', attrs, content);
	if (action === 'insert') {
		tr = editorView.state.tr.insert(position, newNode);
		return tr;
	} else {
		tr.replaceWith(position, position + size, newNode);
		return tr;
	}
};

export const insertOrReplaceBodiedExtension = ({
	editorView,
	action,
	attrs,
	content,
	position,
	size = 0,
	tr,
}: InsertOrReplaceExtensionType): Transaction => {
	const newNode = editorView.state.schema.node('bodiedExtension', attrs, content);
	if (action === 'insert') {
		tr = editorView.state.tr.insert(position, newNode);
		return tr;
	} else {
		tr.replaceWith(position, position + size, newNode);
		return tr;
	}
};
