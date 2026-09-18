/**
 * Pre-refactor code preserved for the OFF cohort of
 * `platform_editor_show_diff_color_scheme_refactor`.
 *
 * These resolvers reproduce the per-scheme style decisions that `createChangedRowDOM` made before
 * the `colorSchemeRegistry` + `factory.ts` migration. Standard deleted styles are resolved at
 * runtime only so the ADF-safety gate can select the equivalent longhand; with that gate off,
 * their CSS remains unchanged.
 *
 * Do not modify. Delete this file at experiment cleanup (EDITOR-8281).
 */
import type { ColorScheme } from '../../showDiffPluginType';
import {
	addedCellOverlayRoundedStyle,
	addedCellOverlayStyle,
	deletedCellOverlayRoundedStyle,
	deletedCellOverlayStyle,
	getStandardDeletedRowStyle,
} from './colorSchemes/standard';
import {
	deletedTraditionalCellOverlayRoundedStyle,
	deletedTraditionalCellOverlayStyle,
	deletedTraditionalRowStyle,
	traditionalAddedCellOverlayRoundedStyle,
	traditionalAddedCellOverlayStyle,
} from './colorSchemes/traditional';

/**
 * Pre-refactor deleted-row style for the `<tr>` element.
 */
export const resolveDeletedRowStyleLegacy = (colorScheme?: ColorScheme): string => {
	return colorScheme === 'traditional' ? deletedTraditionalRowStyle : getStandardDeletedRowStyle();
};

/**
 * Pre-refactor cell overlay style.
 */
export const resolveCellOverlayStyleLegacy = ({
	colorScheme,
	isInserted,
	isRoundedTable,
}: {
	colorScheme?: ColorScheme;
	isInserted?: boolean;
	isRoundedTable: boolean;
}): string => {
	const isTraditional = colorScheme === 'traditional';
	const deletedCellStyle = isTraditional
		? isRoundedTable
			? deletedTraditionalCellOverlayRoundedStyle
			: deletedTraditionalCellOverlayStyle
		: isRoundedTable
			? deletedCellOverlayRoundedStyle
			: deletedCellOverlayStyle;

	const addedCellStyle = isTraditional
		? isRoundedTable
			? traditionalAddedCellOverlayRoundedStyle
			: traditionalAddedCellOverlayStyle
		: isRoundedTable
			? addedCellOverlayRoundedStyle
			: addedCellOverlayStyle;

	return isInserted ? addedCellStyle : deletedCellStyle;
};
