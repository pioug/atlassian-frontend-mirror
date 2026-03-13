import { Decoration } from '@atlaskit/editor-prosemirror/view';

import type { ColorScheme } from '../../showDiffPluginType';

import { editingStyle, editingStyleActive } from './colorSchemes/standard';
import { traditionalInsertStyle, traditionalInsertStyleActive } from './colorSchemes/traditional';

/**
 * Inline decoration used for insertions as the content already exists in the document
 *
 * @param change Changeset "change" containing information about the change content + range
 * @returns Prosemirror inline decoration
 */
export const createInlineChangedDecoration = ({
	change,
	colorScheme,
	isActive = false,
}: {
	change: { fromB: number; toB: number };
	colorScheme?: ColorScheme;
	isActive?: boolean;
}): Decoration => {
	let style: string;
	if (colorScheme === 'traditional') {
		style = isActive ? traditionalInsertStyleActive : traditionalInsertStyle;
	} else {
		style = isActive ? editingStyleActive : editingStyle;
	}
	return Decoration.inline(
		change.fromB,
		change.toB,
		{
			style,
			'data-testid': 'show-diff-changed-decoration',
		},
		{ key: 'diff-inline' },
	);
};
