import type { IntlShape } from 'react-intl';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	getBreakoutResizableNodeTypes,
	getBreakoutResizableNodeTypesNew,
	stepAddsOneOf,
} from '@atlaskit/editor-common/utils';
import { getChangedNodes, isReplaceDocOperation } from '@atlaskit/editor-common/utils/document';
import type { Mark, Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorMaxWidthLayoutWidth,
	akEditorCalculatedWideLayoutWidth,
} from '@atlaskit/editor-shared-styles';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type {
	BreakoutPlugin,
	BreakoutPluginOptions,
	BreakoutPluginState,
} from '../breakoutPluginType';

import type { GUIDELINE_KEYS } from './get-guidelines';
import { handleKeyDown } from './handle-key-down';
import { ResizingMarkView } from './resizing-mark-view';
import { updateExpandedStateNew } from './utils/single-player-expand';

type AddBreakoutToResizableNodeProps = {
	breakoutResizableNodes: Set<NodeType>;
	isFullWidthEnabled: boolean;
	isMaxWidthEnabled: boolean;
	newState: EditorState;
	newTr: Transaction;
	node: Node;
	pos: number;
};

const addBreakoutToResizableNode = ({
	node,
	pos,
	newState,
	newTr,
	breakoutResizableNodes,
	isFullWidthEnabled,
	isMaxWidthEnabled,
}: AddBreakoutToResizableNodeProps) => {
	let updatedDocChanged = false;
	let updatedTr = newTr;

	const $pos = newState.doc.resolve(pos);
	const isTopLevelNode = $pos?.depth === 0;

	if (breakoutResizableNodes.has(node.type) && isTopLevelNode) {
		const { breakout } = newState.schema.marks;
		const { expand } = newState.schema.nodes;
		const breakoutMark = node.marks.find((mark) => mark.type === breakout);
		const isExpand = node.type === expand;

		if (!breakoutMark) {
			const width = isMaxWidthEnabled
				? akEditorMaxWidthLayoutWidth
				: isFullWidthEnabled
					? akEditorFullWidthLayoutWidth
					: akEditorDefaultLayoutWidth;

			if (isExperimentEnabled('platform_editor_lovability_resize_extensions')) {
				const marks = breakout.create({ width: width }).addToSet(node.marks);
				updatedTr = newTr.setNodeMarkup(pos, node.type, node.attrs, marks);
			} else {
				updatedTr = newTr.setNodeMarkup(pos, node.type, node.attrs, [
					breakout.create({ width: width }),
				]);
			}

			if (isExpand) {
				updateExpandedStateNew({ tr: updatedTr, node, pos, isLivePage: true });
			}

			updatedDocChanged = true;
		} else if (breakoutMark?.attrs.width === null || breakoutMark?.attrs.width === undefined) {
			const mode = breakoutMark.attrs.mode;

			// if breakout is present on node, but page appearance is 'full width' force width to full width to maintain backwards compatibility
			const width = isMaxWidthEnabled
				? akEditorMaxWidthLayoutWidth
				: isFullWidthEnabled || mode === 'full-width'
					? akEditorFullWidthLayoutWidth
					: akEditorCalculatedWideLayoutWidth;

			if (isExperimentEnabled('platform_editor_lovability_resize_extensions')) {
				const marks = breakout.create({ width: width }).addToSet(node.marks);
				updatedTr = newTr.setNodeMarkup(pos, node.type, node.attrs, marks);
			} else {
				updatedTr = newTr.setNodeMarkup(pos, node.type, node.attrs, [
					breakout.create({ width: width, mode: mode }),
				]);
			}

			if (isExpand) {
				updateExpandedStateNew({ tr: updatedTr, node, pos, isLivePage: true });
			}

			updatedDocChanged = true;
		}
	}

	return { updatedTr, updatedDocChanged };
};

export const resizingPluginKey: PluginKey<BreakoutPluginState> = new PluginKey<BreakoutPluginState>(
	'breakout-resizing',
);

export type ActiveGuidelineKey = Exclude<
	(typeof GUIDELINE_KEYS)[keyof typeof GUIDELINE_KEYS],
	'grid_left' | 'grid_right'
>;

type UpdateBreakoutNode = {
	data: ContentNodeWithPos;
	type: 'UPDATE_BREAKOUT_NODE';
};

type ResetState = {
	type: 'RESET_STATE';
};

type UpdateActiveGuidelineKey = {
	data: {
		activeGuidelineKey: ActiveGuidelineKey;
	};
	type: 'UPDATE_ACTIVE_GUIDELINE_KEY';
};

type ClearActiveGuidelineKey = {
	type: 'CLEAR_ACTIVE_GUIDELINE_KEY';
};

type ResizingPluginStateMeta =
	| UpdateBreakoutNode
	| UpdateActiveGuidelineKey
	| ClearActiveGuidelineKey
	| ResetState;

const pluginState = {
	init() {
		return {
			breakoutNode: undefined,
			activeGuidelineLabel: undefined,
		};
	},
	apply(tr: ReadonlyTransaction, pluginState: BreakoutPluginState) {
		const meta = tr.getMeta(resizingPluginKey) as undefined | ResizingPluginStateMeta;

		if (meta) {
			switch (meta.type) {
				case 'UPDATE_BREAKOUT_NODE':
					return {
						...pluginState,
						breakoutNode: meta.data,
					};
				case 'UPDATE_ACTIVE_GUIDELINE_KEY':
					return {
						...pluginState,
						activeGuidelineKey: meta.data.activeGuidelineKey,
					};

				case 'CLEAR_ACTIVE_GUIDELINE_KEY':
					return {
						...pluginState,
						activeGuidelineKey: undefined,
					};
				case 'RESET_STATE':
					return {
						activeGuidelineLabel: undefined,
						breakoutNode: undefined,
					};
			}
		}

		return pluginState;
	},
};

const requestIdleCallbackWithFallback = (callback: () => void) => {
	if (typeof requestIdleCallback !== 'undefined') {
		requestIdleCallback(callback);
	} else {
		// fallback to requestAnimationFrame for Safari
		requestAnimationFrame(callback);
	}
};

export const createResizingPlugin = (
	api: ExtractInjectionAPI<BreakoutPlugin> | undefined,
	getIntl: () => IntlShape,
	nodeViewPortalProviderAPI: PortalProviderAPI,
	options?: BreakoutPluginOptions,
): SafePlugin<
	| BreakoutPluginState
	| {
			activeGuidelineLabel: undefined;
			breakoutNode: undefined;
	  }
> => {
	return new SafePlugin({
		key: resizingPluginKey,
		state: pluginState,
		props: {
			markViews: {
				breakout: (mark: Mark, view: EditorView) => {
					return new ResizingMarkView(mark, view, api, getIntl, nodeViewPortalProviderAPI);
				},
			},
			handleKeyDown: handleKeyDown(api),
		},
		view: (editorView: EditorView) => {
			const isPageLoadNormalizationEnabled =
				expValEquals('platform_editor_add_breakout_marks_on_page_load', 'isEnabled', true) ||
				isExperimentEnabled('platform_editor_lovability_resize_extensions');

			const isRuleAndPanelResizingEnabled = expValEquals(
				'platform_editor_lovability_resize_dividers_panels',
				'isEnabled',
				true,
			);

			if (!isPageLoadNormalizationEnabled && !isRuleAndPanelResizingEnabled) {
				return {};
			}

			/**
			 * This performs a one-time scan of the document to add breakout marks
			 * to nodes that don't have them. It's designed to run only once per
			 * editor instance to avoid performance issues.
			 */
			const normalizeBreakoutResizableNodes = () => {
				if (api?.editorViewMode?.sharedState.currentState()?.mode === 'view') {
					return;
				}

				const isFullWidthEnabled = !(options?.allowBreakoutButton === true);
				const isMaxWidthEnabled =
					options?.appearance === 'max' &&
					expValEquals('confluence_max_width_content_appearance', 'isEnabled', true);

				const { state } = editorView;
				const breakoutResizableNodes = isExperimentEnabled(
					'platform_editor_lovability_resize_extensions',
				)
					? getBreakoutResizableNodeTypesNew(state.schema)
					: getBreakoutResizableNodeTypes(state.schema, isRuleAndPanelResizingEnabled);

				let newTr = state.tr;
				let hasDocChanged = false;

				// scan the document for top-level resizable nodes
				state.doc.forEach((node: Node, pos: number) => {
					if (!breakoutResizableNodes.has(node.type)) {
						return;
					}

					const { updatedTr, updatedDocChanged } = addBreakoutToResizableNode({
						node,
						pos,
						newState: state,
						newTr,
						breakoutResizableNodes,
						isFullWidthEnabled,
						isMaxWidthEnabled,
					});

					newTr = updatedTr;
					hasDocChanged = hasDocChanged || updatedDocChanged;
				});

				if (hasDocChanged) {
					editorView.dispatch(newTr.setMeta('addToHistory', false));
				}
			};

			requestIdleCallbackWithFallback(normalizeBreakoutResizableNodes);

			const unsubscribeFromViewMode = api?.editorViewMode?.sharedState.onChange(
				({ nextSharedState }) => {
					if (nextSharedState?.mode === 'edit') {
						requestIdleCallbackWithFallback(normalizeBreakoutResizableNodes);
					}
				},
			);

			return {
				destroy: () => {
					unsubscribeFromViewMode?.();
				},
			};
		},
		appendTransaction(
			transactions: readonly Transaction[],
			oldState: EditorState,
			newState: EditorState,
		) {
			if (api?.editorViewMode?.sharedState.currentState()?.mode === 'view') {
				return;
			}

			let newTr = newState.tr;
			let hasDocChanged = false;

			const isRuleAndPanelResizingEnabled = expValEquals(
				'platform_editor_lovability_resize_dividers_panels',
				'isEnabled',
				true,
			);

			const breakoutResizableNodes = isExperimentEnabled(
				'platform_editor_lovability_resize_extensions',
			)
				? getBreakoutResizableNodeTypesNew(newState.schema)
				: getBreakoutResizableNodeTypes(newState.schema, isRuleAndPanelResizingEnabled);

			const isFullWidthEnabled = !(options?.allowBreakoutButton === true);
			const isMaxWidthEnabled =
				options?.appearance === 'max' &&
				expValEquals('confluence_max_width_content_appearance', 'isEnabled', true);

			const isPageLoadNormalizationEnabled =
				expValEquals('platform_editor_add_breakout_marks_on_page_load', 'isEnabled', true) ||
				isExperimentEnabled('platform_editor_lovability_resize_extensions');

			if (
				!isPageLoadNormalizationEnabled &&
				!isRuleAndPanelResizingEnabled &&
				isReplaceDocOperation(transactions, oldState)
			) {
				newState.doc.forEach((node: Node, pos: number) => {
					const { updatedTr, updatedDocChanged } = addBreakoutToResizableNode({
						node,
						pos,
						newState,
						newTr,
						breakoutResizableNodes,
						isFullWidthEnabled,
						isMaxWidthEnabled,
					});

					newTr = updatedTr;
					hasDocChanged = hasDocChanged || updatedDocChanged;
				});
			} else {
				transactions.forEach((tr: Transaction) => {
					const isAddingResizableNodes = tr.steps.some((step: Step) =>
						stepAddsOneOf(step, breakoutResizableNodes),
					);

					if (isAddingResizableNodes) {
						const changedNodes = getChangedNodes(tr);
						changedNodes.forEach(({ node, pos }) => {
							const { updatedTr, updatedDocChanged } = addBreakoutToResizableNode({
								node,
								pos,
								newState,
								newTr,
								breakoutResizableNodes,
								isFullWidthEnabled,
								isMaxWidthEnabled,
							});

							newTr = updatedTr;
							hasDocChanged = hasDocChanged || updatedDocChanged;
						});
					}
				});
			}

			if (hasDocChanged) {
				// This transaction normalizes a newly inserted node to the editor's default breakout
				// width. It is not a user resize and must not become an undo step — in particular, a
				// source synced block can be deleted permanently before Undo reaches this normalization.
				return newTr.setMeta('addToHistory', false);
			}
		},
	});
};
