import { type FieldProps } from '@atlaskit/form';

import { DatasourceAction } from '../../analytics/types';

export const COLUMN_BASE_WIDTH = 8;
const COLUMN_MIN_WIDTH = COLUMN_BASE_WIDTH * 4;

export type GetWidthCss = (arg: { shouldUseWidth: boolean; width?: number }) => React.CSSProperties;

const keyBasedMinWidthMap: Record<string, number> = {
	summary: COLUMN_BASE_WIDTH * 26,
	status: COLUMN_BASE_WIDTH * 12.5,
	priority: COLUMN_BASE_WIDTH * 12.5, // 100px
	assignee: COLUMN_BASE_WIDTH * 12.5,
};

export const getColumnMinWidth = (key: string) => {
	return keyBasedMinWidthMap[key] || COLUMN_MIN_WIDTH;
};

/**
 * Generate width related portion of css for table cell.
 *
 * @param shouldUseWidth boolean argument defines if a given width is user defined / baked in value
 * or rather default width that should be treated as a maximum width. When table inserted initially
 * and no user custom width defined we set this value to `false`. As soon as user changes any of the
 * column widths we treat all width as custom hardcoded widths.
 * @param width Sometimes set to undefined for last column to make it occupy remainder of the table width
 */
export const getWidthCss: GetWidthCss = ({ shouldUseWidth, width }) => {
	if (!width) {
		return {};
	}
	if (shouldUseWidth) {
		return {
			width,
		};
	} else {
		return { maxWidth: width };
	}
};

/**
 * This method should be called when one atomic action is performed on columns: adding new item, removing one item, changing items order.
 * The assumption is that since only one action is changed at each time, we don't have to verify the actual contents of the lists.
 */
export const getColumnAction = (
	oldVisibleColumnKeys: string[],
	newVisibleColumnKeys: string[],
): DatasourceAction => {
	const newColumnSize = newVisibleColumnKeys.length;
	const oldColumnSize = oldVisibleColumnKeys.length;

	if (newColumnSize > oldColumnSize) {
		return DatasourceAction.COLUMN_ADDED;
	} else if (newColumnSize < oldColumnSize) {
		return DatasourceAction.COLUMN_REMOVED;
	} else {
		return DatasourceAction.COLUMN_REORDERED;
	}
};

/**
 * Remove deprecated `aria-labelledby` prop from select component props.
 */
export const getCleanedSelectProps = (props: Omit<FieldProps<string>, 'value'>) => {
	// Component Field auto adds `aria-labelledby` prop, which is deprecated and should not be used - https://hello.jira.atlassian.cloud/browse/ENGHEALTH-14529
	const { 'aria-labelledby': removedLabelByProps, ...selectProps } = props;
	return selectProps;
};

/**
 * Create id for table header to be used as aria-labelledby on form fields.
 */
export const getFieldLabelById = (fieldId: string) => `datasource-header-title-${fieldId}`;
