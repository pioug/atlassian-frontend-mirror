import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ColorScheme } from '../../showDiffPluginType';

import {
	standardDecorationMarkerVariable,
	editingStyleQuoteNode,
	editingStyleRuleNode,
	editingStyleCardBlockNode,
	editingStyleNode,
	deletedContentStyleNew,
	deletedStyleQuoteNode,
	addedCellOverlayStyle,
	deletedCellOverlayStyle,
} from './colorSchemes/standard';
import {
	traditionalDecorationMarkerVariableActive,
	traditionalDecorationMarkerVariableNew,
	traditionalDeletedDecorationMarkerVariableActive,
	traditionalDeletedDecorationMarkerVariableNew,
	traditionalStyleQuoteNodeActive,
	traditionalStyleQuoteNodeNew,
	traditionalStyleRuleNodeActive,
	traditionalStyleRuleNodeNew,
	traditionalStyleCardBlockNodeActive,
	traditionalStyleCardBlockNodeNew,
	traditionalStyleNodeActive,
	traditionalStyleNodeNew,
	getDeletedTraditionalInlineStyle,
	deletedTraditionalStyleQuoteNode,
	traditionalAddedCellOverlayStyle,
	deletedTraditionalCellOverlayStyle,
} from './colorSchemes/traditional';
import { buildDiffDecorationKey, DiffDecorationKey } from './decorationKeys';

const displayNoneStyle = convertToInlineCss({
	display: 'none',
});

const getNodeClass = (name: string) => {
	switch (name) {
		case 'extension':
			return 'show-diff-changed-decoration-node';
		default:
			return undefined;
	}
};

const getBlockNodeStyle = ({
	nodeName,
	colorScheme,
	isInserted = true,
	isActive = false,
}: {
	colorScheme?: ColorScheme;
	isActive?: boolean;
	isInserted?: boolean;
	nodeName: string;
}) => {
	const isTraditional = colorScheme === 'traditional';
	if (
		[
			'mediaSingle',
			'mediaGroup',
			'table', // Handle table separately to avoid border issues
			'tableRow',
			'paragraph', // Paragraph and heading nodes do not need special styling
			'heading',
			'hardBreak',
			'decisionList',
			'taskList',
			'bulletList',
			'orderedList',
			'layoutSection',
		].includes(nodeName)
	) {
		// Layout nodes do not need special styling
		return undefined;
	}
	if (['tableCell', 'tableHeader'].includes(nodeName)) {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			// This is used for positioning the cell overlay widget decorations
			return convertToInlineCss({
				position: 'relative',
			});
		}
		// When gate is off, it should return undefined as above
		return undefined;
	}
	if (['extension', 'embedCard', 'listItem'].includes(nodeName)) {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			if (isInserted) {
				return isTraditional && isActive
					? traditionalDecorationMarkerVariableActive
					: isTraditional
					? traditionalDecorationMarkerVariableNew
					: standardDecorationMarkerVariable;
			} else {
				return isTraditional && isActive
					? traditionalDeletedDecorationMarkerVariableActive
					: isTraditional
					? traditionalDeletedDecorationMarkerVariableNew
					: deletedContentStyleNew;
			}
		}
		return isTraditional && isActive
			? traditionalDecorationMarkerVariableActive
			: isTraditional
			? traditionalDecorationMarkerVariableNew
			: standardDecorationMarkerVariable;
	}
	if (nodeName === 'blockquote') {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			if (isInserted) {
				return isTraditional
					? isActive
						? traditionalStyleQuoteNodeActive
						: traditionalStyleQuoteNodeNew
					: editingStyleQuoteNode;
			} else {
				return isTraditional ? deletedTraditionalStyleQuoteNode : deletedStyleQuoteNode;
			}
		}
		return isTraditional
			? isActive
				? traditionalStyleQuoteNodeActive
				: traditionalStyleQuoteNodeNew
			: editingStyleQuoteNode;
	}
	if (nodeName === 'rule') {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			if (isInserted) {
				return isTraditional
					? isActive
						? traditionalStyleRuleNodeActive
						: traditionalStyleRuleNodeNew
					: editingStyleRuleNode;
			} else {
				return isTraditional ? getDeletedTraditionalInlineStyle(false) : deletedContentStyleNew;
			}
		}
		return isTraditional
			? isActive
				? traditionalStyleRuleNodeActive
				: traditionalStyleRuleNodeNew
			: editingStyleRuleNode;
	}
	if (nodeName === 'blockCard') {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			if (isInserted) {
				return isTraditional
					? isActive
						? traditionalStyleCardBlockNodeActive
						: traditionalStyleCardBlockNodeNew
					: editingStyleCardBlockNode;
			} else {
				return isTraditional ? getDeletedTraditionalInlineStyle(false) : deletedContentStyleNew;
			}
		}
		return isTraditional
			? isActive
				? traditionalStyleCardBlockNodeActive
				: traditionalStyleCardBlockNodeNew
			: editingStyleCardBlockNode;
	}
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
		if (isInserted) {
			return isTraditional
				? isActive
					? traditionalStyleNodeActive
					: traditionalStyleNodeNew
				: editingStyleNode;
		} else {
			return isTraditional ? getDeletedTraditionalInlineStyle(false) : deletedContentStyleNew;
		}
	}
	return isTraditional
		? isActive
			? traditionalStyleNodeActive
			: traditionalStyleNodeNew
		: editingStyleNode;
};

/**
 * Node decoration used for block-level insertions. When isActive, uses emphasised (pressed) styling.
 *
 * @param change Node range and name
 * @param colorScheme Optional color scheme
 * @param isActive Whether this node is part of the currently active/focused change
 * @returns Prosemirror node decoration or undefined
 */
export const createBlockChangedDecoration = ({
	change,
	colorScheme,
	isInserted = true,
	isActive = false,
	shouldHideDeleted = false,
}: {
	change: { from: number; name: string; to: number };
	colorScheme?: ColorScheme;
	isActive?: boolean;
	isInserted?: boolean;
	shouldHideDeleted?: boolean;
}): Decoration[] => {
	const decorations: Decoration[] = [];

	if (shouldHideDeleted) {
		return [
			Decoration.node(
				change.from,
				change.to,
				{ style: displayNoneStyle },
				{
					key: buildDiffDecorationKey({ type: DiffDecorationKey.block }),
					nodeName: change.name,
				},
			),
		];
	}

	let style: string | undefined;

	if (
		expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true) &&
		['tableCell', 'tableHeader'].includes(change.name)
	) {
		const cellOverlay = document.createElement('div');
		const cellOverlayStyle = isInserted
			? colorScheme === 'traditional'
				? traditionalAddedCellOverlayStyle
				: addedCellOverlayStyle
			: colorScheme === 'traditional'
			? deletedTraditionalCellOverlayStyle
			: deletedCellOverlayStyle;
		cellOverlay.setAttribute('style', cellOverlayStyle);
		decorations.push(
			// change.to - 1 to position the overlay inside the end of the cell
			Decoration.widget(change.to - 1, cellOverlay, {
				key: buildDiffDecorationKey({
					type: DiffDecorationKey.widget,
					isActive,
				}),
			}),
		);
	}
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
		style = getBlockNodeStyle({ nodeName: change.name, colorScheme, isInserted, isActive });
	} else {
		style = getBlockNodeStyle({ nodeName: change.name, colorScheme, isActive });
	}
	const className = getNodeClass(change.name);
	if (style || className) {
		decorations.push(
			Decoration.node(
				change.from,
				change.to,
				{
					style: style,
					'data-testid': 'show-diff-changed-decoration-node',
					class: className,
				},
				{
					key: buildDiffDecorationKey({
						type: DiffDecorationKey.block,
					}),
					nodeName: change.name,
				},
			),
		);
	}

	return decorations;
};
