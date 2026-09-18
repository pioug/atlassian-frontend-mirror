/**
 * Pre-refactor code preserved for the OFF cohort of
 * `platform_editor_show_diff_color_scheme_refactor`.
 *
 * This keeps the `getBlockNodeStyle` and cell-overlay style selection that lived in
 * `createBlockChangedDecoration.ts` before the `colorSchemeRegistry` + `factory.ts` migration.
 * Standard deleted styles are resolved at runtime only so the ADF-safety gate can select the
 * equivalent longhand; with that gate off, their CSS remains unchanged. Delete this file at
 * cleanup, together with `colorSchemes/standard.ts`, `colorSchemes/traditional.ts` (EDITOR-8281).
 */
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';

import type { ColorScheme, DiffType } from '../../showDiffPluginType';
import { isExtendedEnabled } from '../isExtendedEnabled';
import {
	standardDecorationMarkerVariable,
	deletedDecorationMarkerVariable,
	editingStyleQuoteNode,
	editingStyleRuleNode,
	editingStyleCardBlockNode,
	editingStyleNode,
	getStandardDeletedContentStyleNew,
	deletedStyleQuoteNode,
	addedCellOverlayStyle,
	addedCellOverlayRoundedStyle,
	deletedCellOverlayStyle,
	deletedCellOverlayRoundedStyle,
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
	traditionalAddedCellOverlayRoundedStyle,
	deletedTraditionalCellOverlayStyle,
	deletedTraditionalCellOverlayRoundedStyle,
} from './colorSchemes/traditional';

/** Verbatim copy of the pre-refactor cell-overlay style selection. */
export const resolveCellOverlayStyleLegacy = ({
	colorScheme,
	isRoundedTable,
	useAddedStyle,
}: {
	colorScheme?: ColorScheme;
	isRoundedTable: boolean;
	useAddedStyle: boolean;
}): string => {
	const isTraditional = colorScheme === 'traditional';

	const addedCellStyle = isTraditional
		? isRoundedTable
			? traditionalAddedCellOverlayRoundedStyle
			: traditionalAddedCellOverlayStyle
		: isRoundedTable
			? addedCellOverlayRoundedStyle
			: addedCellOverlayStyle;

	const deletedCellStyle = isTraditional
		? isRoundedTable
			? deletedTraditionalCellOverlayRoundedStyle
			: deletedTraditionalCellOverlayStyle
		: isRoundedTable
			? deletedCellOverlayRoundedStyle
			: deletedCellOverlayStyle;

	return useAddedStyle ? addedCellStyle : deletedCellStyle;
};

export const getBlockNodeStyleLegacy = ({
	nodeName,
	colorScheme,
	isInserted = true,
	isActive = false,
	diffType,
}: {
	colorScheme?: ColorScheme;
	diffType?: DiffType;
	isActive?: boolean;
	isInserted?: boolean;
	nodeName: string;
}): string | undefined => {
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
	// Media nodes inside mediaSingle should not get position:relative
	// as it shifts the image outside its parent container (e.g. panel)
	if (nodeName === 'media') {
		if (!isInserted && isExtendedEnabled(diffType)) {
			return isTraditional
				? getDeletedTraditionalInlineStyle(false)
				: deletedDecorationMarkerVariable;
		}
		return isTraditional
			? isActive
				? traditionalStyleNodeActive
				: traditionalStyleNodeNew
			: editingStyleNode;
	}
	if (['tableCell', 'tableHeader'].includes(nodeName)) {
		if (isExtendedEnabled(diffType)) {
			// This is used for positioning the cell overlay widget decorations
			return convertToInlineCss({
				position: 'relative',
			});
		}
		// When gate is off, it should return undefined as above
		return undefined;
	}
	if (nodeName === 'panel') {
		if (!isInserted && isExtendedEnabled(diffType)) {
			return isTraditional
				? getDeletedTraditionalInlineStyle(false)
				: deletedDecorationMarkerVariable;
		}
		return isTraditional
			? isActive
				? traditionalStyleNodeActive
				: traditionalStyleNodeNew
			: editingStyleNode;
	}
	if (['extension', 'embedCard', 'listItem'].includes(nodeName)) {
		if (isExtendedEnabled(diffType)) {
			if (isInserted) {
				return isTraditional && isActive
					? traditionalDecorationMarkerVariableActive
					: isTraditional
						? traditionalDecorationMarkerVariableNew
						: standardDecorationMarkerVariable;
			} else {
				if (nodeName === 'listItem') {
					return isTraditional && isActive
						? traditionalDeletedDecorationMarkerVariableActive
						: isTraditional
							? traditionalDeletedDecorationMarkerVariableNew
							: deletedDecorationMarkerVariable;
				}
				return isTraditional && isActive
					? traditionalDeletedDecorationMarkerVariableActive
					: isTraditional
						? traditionalDeletedDecorationMarkerVariableNew
						: getStandardDeletedContentStyleNew();
			}
		}
		return isTraditional && isActive
			? traditionalDecorationMarkerVariableActive
			: isTraditional
				? traditionalDecorationMarkerVariableNew
				: standardDecorationMarkerVariable;
	}
	if (nodeName === 'blockquote') {
		if (isExtendedEnabled(diffType)) {
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
		if (isExtendedEnabled(diffType)) {
			if (isInserted) {
				return isTraditional
					? isActive
						? traditionalStyleRuleNodeActive
						: traditionalStyleRuleNodeNew
					: editingStyleRuleNode;
			} else {
				return isTraditional
					? getDeletedTraditionalInlineStyle(false)
					: getStandardDeletedContentStyleNew();
			}
		}
		return isTraditional
			? isActive
				? traditionalStyleRuleNodeActive
				: traditionalStyleRuleNodeNew
			: editingStyleRuleNode;
	}
	if (nodeName === 'blockCard') {
		if (isExtendedEnabled(diffType)) {
			if (isInserted) {
				return isTraditional
					? isActive
						? traditionalStyleCardBlockNodeActive
						: traditionalStyleCardBlockNodeNew
					: editingStyleCardBlockNode;
			} else {
				return isTraditional
					? getDeletedTraditionalInlineStyle(false)
					: getStandardDeletedContentStyleNew();
			}
		}
		return isTraditional
			? isActive
				? traditionalStyleCardBlockNodeActive
				: traditionalStyleCardBlockNodeNew
			: editingStyleCardBlockNode;
	}
	if (isExtendedEnabled(diffType)) {
		if (isInserted) {
			return isTraditional
				? isActive
					? traditionalStyleNodeActive
					: traditionalStyleNodeNew
				: editingStyleNode;
		} else {
			return isTraditional
				? getDeletedTraditionalInlineStyle(false)
				: getStandardDeletedContentStyleNew();
		}
	}
	return isTraditional
		? isActive
			? traditionalStyleNodeActive
			: traditionalStyleNodeNew
		: editingStyleNode;
};
