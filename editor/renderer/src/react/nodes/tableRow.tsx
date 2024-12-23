import React from 'react';

import { compose } from '@atlaskit/editor-common/utils';
import { SortOrder } from '@atlaskit/editor-common/types';

import { RendererCssClassName } from '../../consts';

type Props = {
	isNumberColumnEnabled?: number;
	index?: number;
	children?: React.ReactNode;
	onSorting?: (columnIndex?: number, currentSortOrdered?: SortOrder) => void;
	allowColumnSorting?: boolean;
	tableOrderStatus?: {
		columnIndex: number;
		order: SortOrder;
	};
	innerRef?: React.Ref<HTMLTableRowElement>;
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

		if (allowColumnSorting) {
			const isHeaderRow = !rowIndex;
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
		if (this.state.colGroupWidths) {
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
