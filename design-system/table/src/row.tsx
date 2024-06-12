/** @jsx jsx */
import { type FC, memo, type ReactNode, useMemo } from 'react';

import { jsx } from '@emotion/react';

import { useSelection } from './hooks/selection-provider';
import useExpand from './hooks/use-expand';
import useExpandContent from './hooks/use-expand-content';
import { useRowId } from './hooks/use-row-id';
import { useTable } from './hooks/use-table';
import { useTableBody } from './hooks/use-table-body';
import SelectableCell from './selectable-cell';
import { SelectableCell as SelectableCellPrimitive } from './ui/selectable-cell';
import { TR as TRPrimitive } from './ui/tr';

export type RowProps = {
	/**
	 * A `testId` prop is a unique string that appears as a data attribute `data-testid`
	 * in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Content of the row.
	 */
	children?: ReactNode;
};

/**
 * __Row__
 *
 * A table row.
 *
 * - [Examples](https://atlassian.design/components/table/examples)
 */
const Row: FC<RowProps> = memo(({ children, testId }) => {
	// To ensure valid nesting
	useTableBody();
	// to access table state
	const { isSelectable } = useTable();
	const [{ allChecked, checked }] = useSelection();
	const { isExpanded } = useExpand();
	const { isExpandableContent } = useExpandContent();
	const rowId = useRowId();

	const isSelected = useMemo(() => {
		if (!isSelectable || rowId === undefined) {
			return undefined;
		}

		return allChecked || checked.includes(rowId);
	}, [allChecked, checked, isSelectable, rowId]);

	if (isExpanded === false && isExpandableContent) {
		return null;
	}

	let selectableCell = isSelectable && <SelectableCell />;
	if (isSelectable && isExpandableContent) {
		selectableCell = <SelectableCellPrimitive as="td" />;
	}

	return (
		<TRPrimitive isSelected={isSelected} testId={testId} isSubitem={isExpandableContent}>
			{selectableCell}
			{children}
		</TRPrimitive>
	);
});

export default Row;
