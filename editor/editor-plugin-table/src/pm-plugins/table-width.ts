/**
 * A plugin for handle table custom widths
 * Has login to scan the document, add width value to table's width attribute when necessary
 * Also holds resizing state to hide / show table controls
 */

import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { isReplaceDocOperation } from '@atlaskit/editor-common/utils/document';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorMaxWidthLayoutWidth,
	akEditorWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { TABLE_MAX_WIDTH, TABLE_FULL_WIDTH } from './table-resizing/utils/consts';
import { ALIGN_START } from './utils/alignment';

type TableWidthPluginState = {
	resizing: boolean;
	tableLocalId: string;
	tableRef: HTMLTableElement | null;
};

export const pluginKey = new PluginKey<TableWidthPluginState>('tableWidthPlugin');

const createPlugin = (
	dispatch: Dispatch,
	dispatchAnalyticsEvent: DispatchAnalyticsEvent,
	fullWidthEnabled: boolean,
	maxWidthEnabled: boolean,
	isTableScalingEnabled: boolean,
	isTableAlignmentEnabled: boolean,
	isCommentEditor: boolean,
) => {
	return new SafePlugin({
		key: pluginKey,
		state: {
			init() {
				return {
					resizing: false,
					tableLocalId: '',
					tableRef: null,
				};
			},
			apply(tr, pluginState) {
				const meta = tr.getMeta(pluginKey);
				if (meta) {
					const keys = Object.keys(meta) as Array<keyof TableWidthPluginState>;
					const changed = keys.some((key) => {
						return pluginState[key] !== meta[key];
					});

					if (changed) {
						const newState = { ...pluginState, ...meta };

						dispatch(pluginKey, newState);
						return newState;
					}
				}

				return pluginState;
			},
		},
		appendTransaction: (transactions, oldState, newState) => {
			// When document first load in Confluence, initially it is an empty document
			// and Collab service triggers a transaction to replace the empty document with the real document that should be rendered.
			// what we need to do is to add width attr to all tables in the real document
			// isReplaceDocumentOperation is checking if the transaction is the one that replace the empty document with the real document
			const isReplaceDocumentOperation = isReplaceDocOperation(transactions, oldState);

			const referentialityTr = transactions.find((tr) => tr.getMeta('referentialityTableInserted'));

			const shouldPatchTableWidth = fullWidthEnabled && isTableScalingEnabled;
			const shouldPatchTableAlignment = fullWidthEnabled && isTableAlignmentEnabled;

			if (
				!isReplaceDocumentOperation &&
				((!shouldPatchTableWidth && !shouldPatchTableAlignment) || !referentialityTr)
			) {
				return null;
			}

			const { table } = newState.schema.nodes;
			const tr = newState.tr;

			if (isReplaceDocumentOperation && !isCommentEditor) {
				newState.doc.forEach((node, offset) => {
					if (node.type === table) {
						const width = node.attrs.width;
						const layout = node.attrs.layout;

						if (!width && layout) {
							let tableWidthCal;
							if (maxWidthEnabled) {
								tableWidthCal = akEditorMaxWidthLayoutWidth;
							} else if (fullWidthEnabled) {
								tableWidthCal = akEditorFullWidthLayoutWidth;
							} else {
								switch (layout) {
									case 'wide':
										tableWidthCal = akEditorWideLayoutWidth;
										break;
									case 'full-width':
										tableWidthCal = akEditorFullWidthLayoutWidth;
										break;
									// when in fix-width appearance, no need to assign value to table width attr
									// as when table is created, width attr is null by default, table rendered using layout attr
									default:
										tableWidthCal = akEditorDefaultLayoutWidth;
										break;
								}
							}

							const { width, ...rest } = node.attrs;

							if (tableWidthCal) {
								tr.step(
									new SetAttrsStep(offset, {
										width: tableWidthCal,
										...rest,
									}),
								);
							}
						}
					}
				});
			}

			if (referentialityTr) {
				referentialityTr.steps.forEach((step) => {
					step.getMap().forEach((_, __, newStart, newEnd) => {
						newState.doc.nodesBetween(newStart, newEnd, (node, pos) => {
							if (node.type === table) {
								if (
									shouldPatchTableWidth &&
									node.attrs.width !==
										expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true)
										? TABLE_MAX_WIDTH
										: TABLE_FULL_WIDTH
								) {
									tr.setNodeAttribute(
										pos,
										'width',
										expValEquals('editor_tinymce_full_width_mode', 'isEnabled', true)
											? TABLE_MAX_WIDTH
											: TABLE_FULL_WIDTH,
									);
								}
								if (shouldPatchTableAlignment) {
									tr.setNodeAttribute(pos, 'layout', ALIGN_START);
								}
							}
						});
					});
				});
			}

			return tr;
		},
	});
};

export { createPlugin };
