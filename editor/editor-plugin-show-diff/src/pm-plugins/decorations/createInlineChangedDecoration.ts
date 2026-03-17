import { Decoration } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { ColorScheme } from '../../showDiffPluginType';

import {
	editingStyle,
	editingStyleActive,
	deletedContentStyle,
	deletedContentStyleActive,
} from './colorSchemes/standard';
import {
	traditionalInsertStyle,
	traditionalInsertStyleActive,
	deletedTraditionalContentStyle,
} from './colorSchemes/traditional';

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
	isInserted = true,
}: {
	change: { fromB: number; toB: number };
	colorScheme?: ColorScheme;
	isActive?: boolean;
	isInserted?: boolean;
}): Decoration => {
	let style: string;
	if (expValEquals('platform_editor_diff_plugin_extended', 'isEnabled', true)) {
		if (isInserted) {
			if (colorScheme === 'traditional') {
				style = isActive ? traditionalInsertStyleActive : traditionalInsertStyle;
			} else {
				style = isActive ? editingStyleActive : editingStyle;
			}
		} else {
			if (colorScheme === 'traditional') {
				style = deletedTraditionalContentStyle;
			} else {
				style = isActive ? deletedContentStyleActive : deletedContentStyle;
			}
		}
	} else {
		if (colorScheme === 'traditional') {
			style = isActive ? traditionalInsertStyleActive : traditionalInsertStyle;
		} else {
			style = isActive ? editingStyleActive : editingStyle;
		}
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
