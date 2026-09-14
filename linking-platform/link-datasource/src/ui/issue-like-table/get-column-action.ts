import { DatasourceAction } from '../../analytics/types';

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
