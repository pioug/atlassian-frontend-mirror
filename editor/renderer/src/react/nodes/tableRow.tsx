import React from 'react';

import { compose } from '@atlaskit/editor-common/utils';
import { SortOrder } from '@atlaskit/editor-common/types';

import { RendererCssClassName } from '../../consts';

type Props = {
	allowColumnSorting?: boolean;
	children?: React.ReactNode;
	index?: number;
	innerRef?: React.Ref<HTMLTableRowElement>;
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
export default class TableRow extends React.Component<Props, State> {
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

	render() {
		const { children, innerRef } = this.props;

		const childrenArray = React.Children.toArray(children);
		return (
			<tr ref={innerRef}>
				{this.props.isNumberColumnEnabled && (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					<td className={RendererCssClassName.NUMBER_COLUMN}>{this.props.index}</td>
				)}
				{compose(this.addSortableColumn, this.addColGroupWidth)(childrenArray)}
			</tr>
		);
	}
}
