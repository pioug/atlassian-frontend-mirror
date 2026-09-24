import React from 'react';

import { SortOrder } from '@atlaskit/editor-common/types';

import { RendererCssClassName } from '../../consts';

type Props = {
	allowColumnSorting?: boolean;
	children?: React.ReactNode;
	index?: number;
	innerRef?: React.Ref<HTMLTableRowElement>;
	isFirstRow?: boolean;
	isLastRow?: boolean;
	isNumberColumnEnabled?: number;
	onSorting?: (columnIndex?: number, currentSortOrdered?: SortOrder) => void;
	tableOrderStatus?: {
		columnIndex: number;
		order: SortOrder;
	};
};

export default function TableRow({
	allowColumnSorting,
	children,
	index,
	innerRef,
	isFirstRow,
	isLastRow,
	isNumberColumnEnabled,
	onSorting,
	tableOrderStatus,
}: Props): React.JSX.Element {
	const isHeaderRow = !index;
	const childrenArray = React.Children.toArray(children);
	const cells =
		allowColumnSorting && isHeaderRow
			? childrenArray.map((child, columnIndex) => {
					if (React.isValidElement(child)) {
						return React.cloneElement(child, {
							columnIndex,
							onSorting,
							sortOrdered:
								tableOrderStatus?.columnIndex === columnIndex
									? tableOrderStatus.order
									: SortOrder.NO_ORDER,
							isHeaderRow,
						} as Props);
					}
				})
			: childrenArray;

	return (
		<tr ref={innerRef}>
			{isNumberColumnEnabled && (
				<td
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={RendererCssClassName.NUMBER_COLUMN}
					data-reaches-left
					data-reaches-top={isFirstRow || undefined}
					data-reaches-bottom={isLastRow || undefined}
				>
					{index}
				</td>
			)}
			{cells}
		</tr>
	);
}
