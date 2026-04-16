import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
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
	traditionalDecorationMarkerVariable,
	traditionalDecorationMarkerVariableActive,
	traditionalDecorationMarkerVariableNew,
	traditionalDeletedDecorationMarkerVariable,
	traditionalDeletedDecorationMarkerVariableActive,
	traditionalDeletedDecorationMarkerVariableNew,
	traditionalStyleQuoteNode,
	traditionalStyleQuoteNodeActive,
	traditionalStyleQuoteNodeNew,
	traditionalStyleRuleNode,
	traditionalStyleRuleNodeActive,
	traditionalStyleRuleNodeNew,
	traditionalStyleCardBlockNode,
	traditionalStyleCardBlockNodeActive,
	traditionalStyleCardBlockNodeNew,
	traditionalStyleNode,
	traditionalStyleNodeActive,
	traditionalStyleNodeNew,
	getDeletedTraditionalInlineStyle,
	deletedTraditionalStyleQuoteNode,
	traditionalAddedCellOverlayStyle,
	deletedTraditionalCellOverlayStyle,
} from './colorSchemes/traditional';

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
			'taskItem',
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
						? fg('platform_editor_show_diff_scroll_navigation')
							? traditionalDecorationMarkerVariableNew
							: traditionalDecorationMarkerVariable
						: standardDecorationMarkerVariable;
			} else {
				return isTraditional && isActive
					? traditionalDeletedDecorationMarkerVariableActive
					: isTraditional
						? fg('platform_editor_show_diff_scroll_navigation')
							? traditionalDeletedDecorationMarkerVariableNew
							: traditionalDeletedDecorationMarkerVariable
						: deletedContentStyleNew;
			}
		}
		return isTraditional && isActive
			? traditionalDecorationMarkerVariableActive
			: isTraditional
				? fg('platform_editor_show_diff_scroll_navigation')
					? traditionalDecorationMarkerVariableNew
					: traditionalDecorationMarkerVariable
				: standardDecorationMarkerVariable;
	}
	if (nodeName === 'blockquote') {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			if (isInserted) {
				return isTraditional
					? isActive
						? traditionalStyleQuoteNodeActive
						: fg('platform_editor_show_diff_scroll_navigation')
							? traditionalStyleQuoteNodeNew
							: traditionalStyleQuoteNode
					: editingStyleQuoteNode;
			} else {
				return isTraditional ? deletedTraditionalStyleQuoteNode : deletedStyleQuoteNode;
			}
		}
		return isTraditional
			? isActive
				? traditionalStyleQuoteNodeActive
				: fg('platform_editor_show_diff_scroll_navigation')
					? traditionalStyleQuoteNodeNew
					: traditionalStyleQuoteNode
			: editingStyleQuoteNode;
	}
	if (nodeName === 'rule') {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			if (isInserted) {
				return isTraditional
					? isActive
						? traditionalStyleRuleNodeActive
						: fg('platform_editor_show_diff_scroll_navigation')
							? traditionalStyleRuleNodeNew
							: traditionalStyleRuleNode
					: editingStyleRuleNode;
			} else {
				return isTraditional ? getDeletedTraditionalInlineStyle(false) : deletedContentStyleNew;
			}
		}
		return isTraditional
			? isActive
				? traditionalStyleRuleNodeActive
				: fg('platform_editor_show_diff_scroll_navigation')
					? traditionalStyleRuleNodeNew
					: traditionalStyleRuleNode
			: editingStyleRuleNode;
	}
	if (nodeName === 'blockCard') {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			if (isInserted) {
				return isTraditional
					? isActive
						? traditionalStyleCardBlockNodeActive
						: fg('platform_editor_show_diff_scroll_navigation')
							? traditionalStyleCardBlockNodeNew
							: traditionalStyleCardBlockNode
					: editingStyleCardBlockNode;
			} else {
				return isTraditional ? getDeletedTraditionalInlineStyle(false) : deletedContentStyleNew;
			}
		}
		return isTraditional
			? isActive
				? traditionalStyleCardBlockNodeActive
				: fg('platform_editor_show_diff_scroll_navigation')
					? traditionalStyleCardBlockNodeNew
					: traditionalStyleCardBlockNode
			: editingStyleCardBlockNode;
	}
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
		if (isInserted) {
			return isTraditional
				? isActive
					? traditionalStyleNodeActive
					: fg('platform_editor_show_diff_scroll_navigation')
						? traditionalStyleNodeNew
						: traditionalStyleNode
				: editingStyleNode;
		} else {
			return isTraditional ? getDeletedTraditionalInlineStyle(false) : deletedContentStyleNew;
		}
	}
	return isTraditional
		? isActive
			? traditionalStyleNodeActive
			: fg('platform_editor_show_diff_scroll_navigation')
				? traditionalStyleNodeNew
				: traditionalStyleNode
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
				{ key: 'diff-block', nodeName: change.name },
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
				key: `diff-widget-cell-overlay-${change.to}`,
			}),
		);
	}
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
		style = getBlockNodeStyle({ nodeName: change.name, colorScheme, isInserted, isActive });
	} else {
		style = getBlockNodeStyle({ nodeName: change.name, colorScheme, isActive });
	}
	const className = getNodeClass(change.name);
	if (fg('platform_editor_show_diff_scroll_navigation')) {
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
					{ key: 'diff-block', nodeName: change.name },
				),
			);
		}
	} else {
		decorations.push(
			Decoration.node(
				change.from,
				change.to,
				{
					style,
					'data-testid': 'show-diff-changed-decoration-node',
					class: className,
				},
				{ key: 'diff-block', nodeName: change.name },
			),
		);
	}

	return decorations;
};
