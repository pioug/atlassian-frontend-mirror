import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';

import type { ColorScheme, DiffType } from '../../showDiffPluginType';
import { isExtendedEnabled } from '../isExtendedEnabled';

import {
	editingStyle,
	editingStyleExtended,
	editingStyleExtendedNoUnderline,
	editingStyleActive,
	editingStyleActiveExtended,
	editingStyleActiveExtendedNoUnderline,
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
import type { InlineAttrChangeNodeName } from './utils/getAttrChangeRanges';

const displayNoneStyle = convertToInlineCss({
	display: 'none',
});

const getAtomicInlineNodeClassName = (
	inlineNodeName: InlineAttrChangeNodeName | undefined,
	colorScheme: ColorScheme | undefined,
): string => {
	const classNames = ['show-diff-atomic-inline-changed'];

	if (inlineNodeName) {
		classNames.push(`show-diff-atomic-inline-changed-${inlineNodeName}`);
	}

	if (colorScheme === 'traditional') {
		classNames.push('show-diff-atomic-inline-changed-traditional');
	}

	return classNames.join(' ');
};
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
	isAtomicInlineNode = false,
	shouldHideDeleted = false,
	showIndicators = false,
	doc,
	diffType,
	hideAddedDiffsUnderline = false,
	inlineNodeName,
}: {
	change: { fromB: number; toB: number };
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	doc?: PMNode;
	hideAddedDiffsUnderline?: boolean;
	inlineNodeName?: InlineAttrChangeNodeName;
	isActive?: boolean;
	isAtomicInlineNode?: boolean;
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
				style = isActive
					? hideAddedDiffsUnderline
						? editingStyleActiveExtendedNoUnderline
						: editingStyleActiveExtended
					: hideAddedDiffsUnderline
						? editingStyleExtendedNoUnderline
						: editingStyleExtended;
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
				...(isAtomicInlineNode &&
					isInserted && {
						class: getAtomicInlineNodeClassName(inlineNodeName, colorScheme),
					}),
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
