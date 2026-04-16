import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
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
	getDeletedTraditionalInlineStyle,
} from './colorSchemes/traditional';

const displayNoneStyle = convertToInlineCss({
	display: 'none',
});
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
	shouldHideDeleted = false,
}: {
	change: { fromB: number; toB: number };
	colorScheme?: ColorScheme;
	isActive?: boolean;
	isInserted?: boolean;
	shouldHideDeleted?: boolean;
}): Decoration => {
	if (shouldHideDeleted) {
		return Decoration.inline(
			change.fromB,
			change.toB,
			{ style: displayNoneStyle },
			{ key: 'diff-inline' },
		);
	}

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
				style = getDeletedTraditionalInlineStyle(false);
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
