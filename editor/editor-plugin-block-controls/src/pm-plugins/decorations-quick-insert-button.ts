import { createElement } from 'react';

import type { IntlShape } from 'react-intl';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuid from 'uuid';

import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import type { DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { BlockControlsPlugin } from '../blockControlsPluginType';
import { ACTIVE_QUICK_INSERT_ATTR } from '../ui/consts';
import { QuickInsertWithVisibility } from '../ui/quick-insert-button';

import type { AnchorRectCache } from './utils/anchor-utils';
import { getMatchingBlockMarks } from './utils/marks';

const TYPE_QUICK_INSERT = 'INSERT_BUTTON';
const TYPE_ACTIVE_QUICK_INSERT_NODE = 'active-quick-insert-node';

export const findQuickInsertInsertButtonDecoration = (
	decorations: DecorationSet,
	from?: number,
	to?: number,
): Decoration[] => {
	return decorations.find(from, to, (spec) => spec.type === TYPE_QUICK_INSERT);
};

type QuickInsertButtonDecorationParams = {
	anchorName: string;
	anchorRectCache?: AnchorRectCache;
	api: ExtractInjectionAPI<BlockControlsPlugin>;
	editorState: EditorState;
	formatMessage: IntlShape['formatMessage'];
	nodeType: string;
	nodeViewPortalProviderAPI: PortalProviderAPI;
	rootAnchorName?: string;
	rootNodeType?: string;
	rootPos: number;
};

/**
 * Creates a Decoration.node that marks the active node with `data-active-quick-insert="true"`.
 * The CSS in staticControlsAnchorStyles applies `anchor-name` to this attribute directly,
 * replacing the unreliable adjacency selector `[block-ctrl-quick-insert-button] + *`.
 */
export const createActiveQuickInsertNodeDecoration = (pos: number, nodeSize: number): Decoration =>
	Decoration.node(
		pos,
		pos + nodeSize,
		{ [ACTIVE_QUICK_INSERT_ATTR]: 'true' },
		{ type: TYPE_ACTIVE_QUICK_INSERT_NODE },
	);

export const findActiveQuickInsertNodeDec = (
	decorations: DecorationSet,
	from?: number,
	to?: number,
): Decoration[] =>
	decorations.find(from, to, (spec) => spec.type === TYPE_ACTIVE_QUICK_INSERT_NODE);

export const quickInsertButtonDecoration = ({
	api,
	formatMessage,
	rootPos,
	anchorName,
	nodeType,
	nodeViewPortalProviderAPI,
	rootAnchorName,
	rootNodeType,
	anchorRectCache,
	editorState,
}: QuickInsertButtonDecorationParams): Decoration => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const key = uuid();
	const cleanupCallbacks: (() => void)[] = [];

	const widgetSpec = editorExperiment('platform_editor_breakout_resizing', true)
		? {
				side: -2,
				type: TYPE_QUICK_INSERT,
				/**
				 * sigh - `marks` influences the position that the widget is drawn (as described on the `side` property).
				 * Exclude 'breakout' on purpose, so the widgets render at the top of the document to avoid z-index issues
				 * Other block marks must be added, otherwise PM will split the DOM elements causing mutations and re-draws
				 */

				marks: expValEquals('platform_editor_small_font_size', 'isEnabled', true)
					? getMatchingBlockMarks(editorState, rootPos, [
							editorState.schema.marks.alignment,
							editorState.schema.marks.fontSize,
						])
					: [],
				destroy: (_: Node) => {
					if (fg('platform_editor_fix_widget_destroy')) {
						nodeViewPortalProviderAPI.remove(key);
					}
					cleanupCallbacks.forEach((cb) => {
						cb();
					});
				},
			}
		: {
				side: -2,
				type: TYPE_QUICK_INSERT,
				destroy: (_: Node) => {
					if (fg('platform_editor_fix_widget_destroy')) {
						nodeViewPortalProviderAPI.remove(key);
					}
					cleanupCallbacks.forEach((cb) => {
						cb();
					});
				},
			};

	return Decoration.widget(
		rootPos,
		(view, getPos) => {
			const element = document.createElement('span');
			// inline decoration causes cursor disappear when focusing editor at the first line (e.g. press Tab when title is focused)
			element.style.display = 'block';

			// make sure it does not interfere with elements floating next to each other e.g. paragraph next to image with wrap-right
			element.style.clear = 'unset';
			element.contentEditable = 'false';
			element.setAttribute('data-blocks-quick-insert-container', 'true');
			if (fg('confluence_remix_button_right_side_block_fg')) {
				element.setAttribute('data-blocks-quick-insert-button', 'true');
			}
			element.setAttribute('data-testid', 'block-ctrl-quick-insert-button');
			nodeViewPortalProviderAPI.render(
				() =>
					createElement(QuickInsertWithVisibility, {
						api,
						getPos,
						formatMessage,
						view,
						nodeType,
						anchorName,
						rootAnchorName,
						rootNodeType: rootNodeType ?? nodeType,
						anchorRectCache,
					}),
				element,
				key,
				undefined,
				// @portal-render-immediately
				true,
			);

			return element;
		},
		widgetSpec,
	);
};
