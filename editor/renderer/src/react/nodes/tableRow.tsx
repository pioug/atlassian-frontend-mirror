import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { compose } from '@atlaskit/editor-common/utils';
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

type State = {
	colGroupWidths: string[];
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class TableRowLegacy extends React.Component<Props, State> {
	state: State = {
		colGroupWidths: [],
	};

	addSortableColumn = (childrenArray: React.ReactNode[]): React.ReactNode[] => {
		const { allowColumnSorting, index: rowIndex } = this.props;

		const isHeaderRow = !rowIndex;
		if (allowColumnSorting && isHeaderRow) {
			childrenArray = childrenArray.map((child, index) => {
				if (React.isValidElement(child)) {
					const { tableOrderStatus } = this.props;
					let sortOrdered: SortOrder = SortOrder.NO_ORDER;
					if (tableOrderStatus) {
						sortOrdered =
							index === tableOrderStatus.columnIndex ? tableOrderStatus.order : SortOrder.NO_ORDER;
					}

					return React.cloneElement(child, {
						columnIndex: index,
						onSorting: this.props.onSorting,
						sortOrdered,
						isHeaderRow,
					} as Props);
				}
			});
		}
		return childrenArray;
	};

	addColGroupWidth = (childrenArray: React.ReactNode[]): React.ReactNode[] => {
		if (this.state.colGroupWidths?.length) {
			childrenArray = childrenArray.map((child, index) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(child, {
						colGroupWidth: this.state.colGroupWidths[index],
					} as Props);
				}
			});
		}
		return childrenArray;
	};

	render(): React.JSX.Element {
		const { children, innerRef, isFirstRow, isLastRow } = this.props;

		const childrenArray = React.Children.toArray(children);
		return (
			<tr ref={innerRef}>
				{this.props.isNumberColumnEnabled && (
					<td
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
						className={RendererCssClassName.NUMBER_COLUMN}
						data-reaches-left
						data-reaches-top={isFirstRow || undefined}
						data-reaches-bottom={isLastRow || undefined}
					>
						{this.props.index}
					</td>
				)}
				{compose(this.addSortableColumn, this.addColGroupWidth)(childrenArray)}
			</tr>
		);
	}
}

function TableRowFunctional({
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

export default function TableRow(props: Props): React.JSX.Element {
	const Component = fg('platform_renderer_table_row_functional')
		? TableRowFunctional
		: TableRowLegacy;
	return React.createElement(Component, props);
}
