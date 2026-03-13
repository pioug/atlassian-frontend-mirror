import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ColorScheme } from '../../showDiffPluginType';

import {
	standardDecorationMarkerVariable,
	editingStyleQuoteNode,
	editingStyleRuleNode,
	editingStyleCardBlockNode,
	editingStyleNode,
} from './colorSchemes/standard';
import {
	traditionalDecorationMarkerVariable,
	traditionalStyleQuoteNode,
	traditionalStyleRuleNode,
	traditionalStyleCardBlockNode,
	traditionalStyleNode,
} from './colorSchemes/traditional';

const getNodeClass = (name: string) => {
	switch (name) {
		case 'extension':
			return 'show-diff-changed-decoration-node';
		default:
			return undefined;
	}
};

const getBlockNodeStyle = (nodeName: string, colorScheme?: ColorScheme) => {
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
		return isTraditional ? traditionalDecorationMarkerVariable : standardDecorationMarkerVariable;
	}
	if (nodeName === 'blockquote') {
		return isTraditional ? traditionalStyleQuoteNode : editingStyleQuoteNode;
	}
	if (nodeName === 'rule') {
		return isTraditional ? traditionalStyleRuleNode : editingStyleRuleNode;
	}
	if (nodeName === 'blockCard') {
		return isTraditional ? traditionalStyleCardBlockNode : editingStyleCardBlockNode;
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
}: {
	change: { from: number; name: string; to: number };
	colorScheme?: ColorScheme;
}): Decoration | undefined => {
	if (fg('platform_editor_show_diff_scroll_navigation')) {
		const style = getBlockNodeStyle(change.name, colorScheme);
		const className = getNodeClass(change.name);
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
				style: getBlockNodeStyle(change.name, colorScheme),
				'data-testid': 'show-diff-changed-decoration-node',
				class: getNodeClass(change.name),
			},
			{ key: 'diff-block' },
		);
	}
};
