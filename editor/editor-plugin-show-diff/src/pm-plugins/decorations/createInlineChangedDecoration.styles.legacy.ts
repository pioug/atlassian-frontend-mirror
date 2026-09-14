/**
 * Pre-refactor `createInlineChangedDecoration` styling code, preserved verbatim for the OFF cohort
 * of `platform_editor_show_diff_color_scheme_refactor`.
 *
 * This module exists so the OFF cohort keeps running the code that shipped before the
 * `colorSchemeRegistry` + `factory.ts` migration. Standard deleted styles are resolved at runtime
 * only so the ADF-safety gate can select the equivalent longhand; with that gate off, their CSS
 * remains unchanged. Delete the whole file at experiment cleanup (EDITOR-8281).
 */
import type { ColorScheme, DiffType } from '../../showDiffPluginType';
import { isExtendedEnabled } from '../isExtendedEnabled';

import {
	deletedInlineContentStyleExtended,
	editingStyle,
	editingStyleActive,
	editingStyleActiveExtended,
	editingStyleActiveExtendedNoUnderline,
	editingStyleExtended,
	editingStyleExtendedNoUnderline,
	getStandardDeletedContentStyle,
	getStandardDeletedContentStyleActive,
} from './colorSchemes/standard';
import {
	getDeletedTraditionalInlineStyle,
	traditionalInsertStyle,
	traditionalInsertStyleActive,
} from './colorSchemes/traditional';
import type { InlineAttrChangeNodeName } from './utils/getAttrChangeRanges';

/**
 * Pre-refactor inline `style` computation for `createInlineChangedDecoration`.
 */
export const resolveInlineChangedStyleLegacy = ({
	colorScheme,
	diffType,
	hideAddedDiffsUnderline,
	isActive,
	isInserted,
}: {
	colorScheme: ColorScheme | undefined;
	diffType: DiffType | undefined;
	hideAddedDiffsUnderline: boolean;
	isActive: boolean;
	isInserted: boolean;
}): string => {
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
				style =
					(isActive ? getStandardDeletedContentStyleActive() : getStandardDeletedContentStyle()) +
					deletedInlineContentStyleExtended;
			}
		}
	} else {
		if (colorScheme === 'traditional') {
			style = isActive ? traditionalInsertStyleActive : traditionalInsertStyle;
		} else {
			style = isActive ? editingStyleActive : editingStyle;
		}
	}

	return style;
};

/**
 * Pre-refactor class names for an atomic inline node decoration (date, emoji, mention, status).
 * The colour was carried by the per-scheme `-traditional` class rather than by an inline CSS
 * variable on the same element.
 */
export const getAtomicInlineNodeClassNameLegacy = (
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
