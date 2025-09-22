import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfTypeClosestToPos } from '@atlaskit/editor-prosemirror/utils';
import {
	akEditorDefaultLayoutWidth,
	akEditorFullWidthLayoutWidth,
	akEditorGutterPadding,
	akEditorGutterPaddingDynamic,
	akEditorWideLayoutWidth,
	akLayoutGutterOffset,
	gridMediumMaxWidth,
} from '@atlaskit/editor-shared-styles';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { BODIED_EXT_PADDING } from '../styles/shared/extension';
import { LAYOUT_COLUMN_PADDING, LAYOUT_SECTION_MARGIN } from '../styles/shared/layout';
import { tableCellPadding } from '../styles/shared/table';
import type { EditorContainerWidth } from '../types/editor-container-width';
import { absoluteBreakoutWidth } from '../utils/breakout';

const GRID_SIZE = 8;
const NESTED_DND_GUTTER_OFFSET = 8;
const NESTED_DND_MARGIN_OFFSET = 12;

export const layoutToWidth = {
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	default: akEditorDefaultLayoutWidth,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	wide: akEditorWideLayoutWidth,
	// eslint-disable-next-line @atlaskit/editor/no-re-export
	'full-width': akEditorFullWidthLayoutWidth,
};

/**
 * Calculates width of parent node of a nested node (inside layouts, extension)
 * If current node selection is not nested will return undefined
 */
export const getParentNodeWidth = (
	pos: number | undefined,
	state: EditorState,
	containerWidth: EditorContainerWidth,
	isFullWidthModeEnabled?: boolean,
) => {
	if (!pos) {
		return;
	}

	const node = getNestedParentNode(pos, state);
	if (!node) {
		return;
	}

	let layout = node.attrs.layout || 'default';
	const { schema } = state;
	const breakoutMark = schema.marks.breakout && schema.marks.breakout.isInSet(node.marks);
	if (breakoutMark && breakoutMark.attrs.mode) {
		layout = breakoutMark.attrs.mode;
	}
	const breakoutWidth = breakoutMark ? breakoutMark.attrs.width : undefined;
	let parentWidth = calcBreakoutNodeWidth(
		layout,
		containerWidth,
		isFullWidthModeEnabled,
		breakoutWidth,
	);

	// Please, do not copy or use this kind of code below
	// @ts-ignore
	const contextPanelPluginKey = {
		key: 'contextPanelPluginKey$',
		getState: (state: EditorState) => {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (state as any)['contextPanelPluginKey$'];
		},
	} as PluginKey;

	switch (node.type) {
		case schema.nodes.layoutSection:
			// the extra width of the layout does not add to the width of the area the table can be inside
			if (!expValEquals('platform_editor_nested_table_refresh_width_fix', 'isEnabled', true)) {
				parentWidth += akLayoutGutterOffset * 2; // extra width that gets added to layout
			}

			// Calculate width of parent layout column when
			// Parallel layout with viewport greater than 1024px
			// OR side panel of an extension is open and change the node width to smaller than containerWidth
			if (
				containerWidth.width > gridMediumMaxWidth ||
				(contextPanelPluginKey.getState(state)?.contents.length > 0 &&
					contextPanelPluginKey.getState(state)?.contents[0] !== undefined)
			) {
				// margin between sections
				parentWidth -=
					expValEquals('platform_editor_nested_table_refresh_width_fix', 'isEnabled', true) &&
					fg('platform_editor_nested_dnd_styles_changes')
						? (LAYOUT_SECTION_MARGIN + NESTED_DND_MARGIN_OFFSET + 2) * (node.childCount - 1)
						: (LAYOUT_SECTION_MARGIN + 2) * (node.childCount - 1);
				const $pos = state.doc.resolve(pos);
				const column = findParentNodeOfTypeClosestToPos($pos, [state.schema.nodes.layoutColumn]);
				if (column && column.node && !isNaN(column.node.attrs.width)) {
					// get exact width of parent layout column using node attrs
					parentWidth = Math.round(parentWidth * column.node.attrs.width * 0.01);
				}
			}

			// account for the padding of the parent node
			parentWidth -=
				expValEquals('platform_editor_nested_table_refresh_width_fix', 'isEnabled', true) &&
				fg('platform_editor_nested_dnd_styles_changes')
					? (LAYOUT_COLUMN_PADDING + NESTED_DND_GUTTER_OFFSET) * 2
					: LAYOUT_COLUMN_PADDING * 2;

			break;

		case schema.nodes.bodiedExtension:
			parentWidth -= BODIED_EXT_PADDING * 2;
			break;
		case schema.nodes.extensionFrame:
			parentWidth -= BODIED_EXT_PADDING * 2;
			break;

		case schema.nodes.expand:
			// padding
			parentWidth -= GRID_SIZE * 2;
			// gutter offset
			parentWidth += GRID_SIZE * 1.5 * 2;
			// padding right
			parentWidth -= GRID_SIZE;
			// padding left
			parentWidth -= GRID_SIZE * 4 - GRID_SIZE / 2;
			break;

		case schema.nodes.tableCell:
		case schema.nodes.tableHeader:
			// Calculate the available column width
			if (Array.isArray(node.attrs.colwidth)) {
				parentWidth = node.attrs.colwidth
					.slice(0, node.attrs.colspan)
					.reduce((sum: number, width: number) => sum + width, 0);
			}
			// Compensate for padding
			parentWidth -= tableCellPadding * 2;
			break;
	}

	parentWidth -= 2; // border

	return parentWidth;
};

const getNestedParentNode = (tablePos: number, state: EditorState): PMNode | null => {
	if (tablePos === undefined) {
		return null;
	}

	const $pos = state.doc.resolve(tablePos);
	const parent = findParentNodeOfTypeClosestToPos($pos, [
		state.schema.nodes.bodiedExtension,
		state.schema.nodes.extensionFrame,
		state.schema.nodes.layoutSection,
		state.schema.nodes.expand,
		state.schema.nodes.tableCell,
		state.schema.nodes.tableHeader,
	]);

	return parent ? parent.node : null;
};

const calcBreakoutNodeWidth = (
	layout: 'full-width' | 'wide' | string,
	containerWidth: EditorContainerWidth,
	isFullWidthModeEnabled?: boolean,
	breakoutWidth?: number,
) => {
	if (
		breakoutWidth &&
		expValEquals('platform_editor_nested_table_refresh_width_fix', 'isEnabled', true)
	) {
		return isFullWidthModeEnabled
			? Math.min(containerWidth.lineLength as number, breakoutWidth)
			: // container width minus breakout padding
				// --ak-editor--breakout-full-page-guttering-padding = (--ak-editor--large-gutter-padding * 2) + --ak-editor--default-gutter-padding
				Math.min(
					containerWidth.width - (akEditorGutterPaddingDynamic() * 2 + akEditorGutterPadding),
					breakoutWidth,
				);
	}
	return isFullWidthModeEnabled
		? Math.min(containerWidth.lineLength as number, akEditorFullWidthLayoutWidth)
		: absoluteBreakoutWidth(layout, containerWidth.width);
};

export const getTableContainerWidth = (node?: PMNode): number => {
	if (node?.attrs.width) {
		return node.attrs.width;
	}

	return (
		layoutToWidth[node?.attrs.layout as 'default' | 'wide' | 'full-width'] ||
		akEditorDefaultLayoutWidth
	);
};

export const getTableWidthWithNumberColumn = (node: PMNode, offset: number): number => {
	const isNumberColumnEnabled = node.attrs.isNumberColumnEnabled;
	if (isNumberColumnEnabled && offset > 0) {
		return getTableContainerWidth(node) - offset;
	}
	return getTableContainerWidth(node);
};
