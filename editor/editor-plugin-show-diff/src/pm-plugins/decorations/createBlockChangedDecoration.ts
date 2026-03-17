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
} from './colorSchemes/standard';
import {
	traditionalDecorationMarkerVariable,
	traditionalStyleQuoteNode,
	traditionalStyleRuleNode,
	traditionalStyleCardBlockNode,
	traditionalStyleNode,
	deletedTraditionalContentStyle,
	deletedTraditionalStyleQuoteNode,
} from './colorSchemes/traditional';

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
}: {
	colorScheme?: ColorScheme;
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
			'tableCell',
			'tableHeader',
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
	if (['extension', 'embedCard', 'listItem'].includes(nodeName)) {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			if (isInserted) {
				return isTraditional
					? traditionalDecorationMarkerVariable
					: standardDecorationMarkerVariable;
			} else {
				return isTraditional ? deletedTraditionalContentStyle : deletedContentStyleNew;
			}
		}
		return isTraditional ? traditionalDecorationMarkerVariable : standardDecorationMarkerVariable;
	}
	if (nodeName === 'blockquote') {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			if (isInserted) {
				return isTraditional ? traditionalStyleQuoteNode : editingStyleQuoteNode;
			} else {
				return isTraditional ? deletedTraditionalStyleQuoteNode : deletedStyleQuoteNode;
			}
		}
		return isTraditional ? traditionalStyleQuoteNode : editingStyleQuoteNode;
	}
	if (nodeName === 'rule') {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			if (isInserted) {
				return isTraditional ? traditionalStyleRuleNode : editingStyleRuleNode;
			} else {
				return isTraditional ? deletedTraditionalContentStyle : deletedContentStyleNew;
			}
		}
		return isTraditional ? traditionalStyleRuleNode : editingStyleRuleNode;
	}
	if (nodeName === 'blockCard') {
		if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
			if (isInserted) {
				return isTraditional ? traditionalStyleCardBlockNode : editingStyleCardBlockNode;
			} else {
				return isTraditional ? deletedTraditionalContentStyle : deletedContentStyleNew;
			}
		}
		return isTraditional ? traditionalStyleCardBlockNode : editingStyleCardBlockNode;
	}
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
		if (isInserted) {
			return isTraditional ? traditionalStyleNode : editingStyleNode;
		} else {
			return isTraditional ? deletedTraditionalContentStyle : deletedContentStyleNew;
		}
	}
	return isTraditional ? traditionalStyleNode : editingStyleNode;
};

/**
 * Inline decoration used for insertions as the content already exists in the document
 *
 * @param change Changeset "change" containing information about the change content + range
 * @returns Prosemirror inline decoration
 */
export const createBlockChangedDecoration = ({
	change,
	colorScheme,
	isInserted = true,
}: {
	change: { from: number; name: string; to: number };
	colorScheme?: ColorScheme;
	isInserted: boolean;
}): Decoration | undefined => {
	let style = getBlockNodeStyle({ nodeName: change.name, colorScheme });
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
		style = getBlockNodeStyle({ nodeName: change.name, colorScheme, isInserted });
	}
	const className = getNodeClass(change.name);

	if (fg('platform_editor_show_diff_scroll_navigation')) {
		if (style || className) {
			return Decoration.node(
				change.from,
				change.to,
				{
					style: style,
					'data-testid': 'show-diff-changed-decoration-node',
					class: className,
				},
				{ key: 'diff-block' },
			);
		}
		return undefined;
	} else {
		return Decoration.node(
			change.from,
			change.to,
			{
				style,
				'data-testid': 'show-diff-changed-decoration-node',
				class: className,
			},
			{ key: 'diff-block' },
		);
	}
};
