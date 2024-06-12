import React from 'react';

import withSortedPageRows, { type WithSortedPageRowsProps } from '../hoc/with-sorted-page-rows';
import { type HeadType } from '../types';

import TableRow from './table-row';

interface BodyProps extends WithSortedPageRowsProps {
	head?: HeadType;
	highlightedRowIndex?: number | number[];
	isFixedSize: boolean;
	forwardedRef?: React.Ref<HTMLTableSectionElement>;
	testId?: string;
}

class Body extends React.Component<BodyProps, {}> {
	render() {
		const { pageRows, head, isFixedSize, highlightedRowIndex, testId, forwardedRef } = this.props;

		return (
			<tbody data-testid={testId && `${testId}--body`} ref={forwardedRef}>
				{pageRows.map((row, rowIndex) => (
					<TableRow
						head={head}
						isFixedSize={isFixedSize}
						key={row.key || rowIndex}
						row={row}
						isHighlighted={
							row.isHighlighted ||
							(!!highlightedRowIndex &&
								(typeof highlightedRowIndex === 'number'
									? highlightedRowIndex === rowIndex
									: highlightedRowIndex.indexOf(rowIndex) > -1))
						}
						testId={testId}
					/>
				))}
			</tbody>
		);
	}
}

export default withSortedPageRows<BodyProps>(
	React.forwardRef<HTMLTableSectionElement, BodyProps>((props, ref) => {
		return <Body {...props} forwardedRef={ref} />;
	}),
);
