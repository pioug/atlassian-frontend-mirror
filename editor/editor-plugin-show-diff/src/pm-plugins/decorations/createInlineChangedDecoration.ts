import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';

import type { ColorScheme, DiffType } from '../../showDiffPluginType';
import { isExtendedEnabled } from '../isExtendedEnabled';

import {
	editingStyle,
	editingStyleExtended,
	editingStyleActive,
	editingStyleActiveExtended,
	deletedContentStyle,
	deletedContentStyleActive,
	deletedInlineContentStyleExtended,
} from './colorSchemes/standard';
import {
	traditionalInsertStyle,
	traditionalInsertStyleActive,
	getDeletedTraditionalInlineStyle,
} from './colorSchemes/traditional';
import { createInlineIndicatorAnchorWidgets } from './createAnchorDecorationWidgets';
import { buildDiffDecorationSpec } from './decorationKeys';

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
	showIndicators = false,
	doc,
	diffType,
}: {
	change: { fromB: number; toB: number };
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	doc?: PMNode;
	isActive?: boolean;
	isInserted?: boolean;
	shouldHideDeleted?: boolean;
	showIndicators?: boolean;
}): Decoration[] => {
	const diffId = crypto.randomUUID();

	if (shouldHideDeleted) {
		return [
			Decoration.inline(
				change.fromB,
				change.toB,
				{ style: displayNoneStyle },
				buildDiffDecorationSpec({ decorationType: 'inline', diffId, isActive }),
			),
		];
	}

	let style: string;

	if (isExtendedEnabled(diffType)) {
		if (isInserted) {
			if (colorScheme === 'traditional') {
				style = isActive ? traditionalInsertStyleActive : traditionalInsertStyle;
			} else {
				style = isActive ? editingStyleActiveExtended : editingStyleExtended;
			}
		} else {
			if (colorScheme === 'traditional') {
				style = getDeletedTraditionalInlineStyle(false);
			} else {
				style = isActive ? deletedContentStyleActive : deletedContentStyle;
				/**
				 * Merge into existing styles when cleaning up
				 */
				if (isExtendedEnabled(diffType)) {
					style += deletedInlineContentStyleExtended;
				}
			}
		}
	} else {
		if (colorScheme === 'traditional') {
			style = isActive ? traditionalInsertStyleActive : traditionalInsertStyle;
		} else {
			style = isActive ? editingStyleActive : editingStyle;
		}
	}

	const decorations = [
		Decoration.inline(
			change.fromB,
			change.toB,
			{
				style,
				'data-testid': 'show-diff-changed-decoration',
			},
			buildDiffDecorationSpec({ decorationType: 'inline', diffId, isActive }),
		),
	];

	if (showIndicators && doc && isExtendedEnabled(diffType)) {
		decorations.push(
			...createInlineIndicatorAnchorWidgets({ doc, from: change.fromB, to: change.toB, diffId }),
		);
	}

	return decorations;
};
