/**
 * A plugin for handle table custom widths
 * Has login to scan the document, add width value to table's width attribute when necessary
 * Also holds resizing state to hide / show table controls
 */

import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import { ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';

import { TABLE_MAX_WIDTH } from './table-resizing/utils';
import { ALIGN_START } from './utils/alignment';

type __ReplaceStep = ReplaceStep & {
	// Properties `to` and `from` are private attributes of ReplaceStep.
	to: number;
	from: number;
};

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
	isTableScalingEnabled: boolean,
	isTableAlignmentEnabled: boolean,
	isCommentEditor: boolean,
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/max-params
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
			const isReplaceDocumentOperation = transactions.some((tr) => {
				if (tr.getMeta('replaceDocument')) {
					return true;
				}

				const hasStepReplacingEntireDocument = tr.steps.some((step) => {
					if (!(step instanceof ReplaceStep)) {
						return false;
					}

					const isStepReplacingFromDocStart = (step as __ReplaceStep).from === 0;
					const isStepReplacingUntilTheEndOfDocument =
						(step as __ReplaceStep).to === oldState.doc.content.size;

					if (!isStepReplacingFromDocStart || !isStepReplacingUntilTheEndOfDocument) {
						return false;
					}
					return true;
				});

				return hasStepReplacingEntireDocument;
			});

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

							if (fullWidthEnabled) {
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
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/max-params
					step.getMap().forEach((_, __, newStart, newEnd) => {
						newState.doc.nodesBetween(newStart, newEnd, (node, pos) => {
							if (node.type === table) {
								if (shouldPatchTableWidth && node.attrs.width !== TABLE_MAX_WIDTH) {
									tr.setNodeAttribute(pos, 'width', TABLE_MAX_WIDTH);
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
