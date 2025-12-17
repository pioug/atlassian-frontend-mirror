import React from 'react';

import { validateSortKey } from '../internal/helpers';
import { Head } from '../styled/table-head';
import { type HeadType, type RowCellType, type SortOrderType } from '../types';

import RankableHeadCell from './rankable/table-head-cell';
import HeadCell from './table-head-cell';

interface TableHeadProps {
	head: HeadType;
	sortKey?: string;
	sortOrder?: SortOrderType;
	isFixedSize?: boolean;
	onSort: (item: RowCellType) => () => void;
	isRankable?: boolean;
	isRanking: boolean;
	testId?: string;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class TableHead extends React.Component<TableHeadProps, { activeSortButtonId: string | null }> {
	constructor(props: TableHeadProps) {
		super(props);
		this.state = {
			activeSortButtonId: null,
		};
	}

	UNSAFE_componentWillMount(): void {
		validateSortKey(this.props.sortKey, this.props.head);
	}

	UNSAFE_componentWillReceiveProps(nextProps: TableHeadProps): void {
		if (this.props.sortKey !== nextProps.sortKey || this.props.head !== nextProps.head) {
			validateSortKey(nextProps.sortKey, nextProps.head);
		}
	}

	render(): React.JSX.Element | null {
		const { head, sortKey, sortOrder, isFixedSize, onSort, isRanking, isRankable, testId } =
			this.props;
		const { activeSortButtonId } = this.state;

		if (!head) {
			return null;
		}

		const HeadCellComponent = isRankable ? RankableHeadCell : HeadCell;

		// TODO: Remove `rest` props and use only what is explicitly in the API.
		// Some tests use this to pass in onClick and other stuff within the `head`
		// variable here, but considering it's not in the API, it should probably
		// be removed.
		const { cells, ...rest } = head;

		return (
			<Head {...rest} isRanking={isRanking} testId={testId && `${testId}--head`}>
				<tr>
					{cells.map((cell, index) => {
						const {
							ascendingSortTooltip,
							buttonAriaRoleDescription,
							colSpan,
							content,
							descendingSortTooltip,
							isIconOnlyHeader,
							isSortable,
							key,
							shouldTruncate,
							testId: cellTestId,
							width,
							// TODO: Remove `rest` props and use only what is explicitly in
							// the API.
							...restCellProps
						} = cell;

						const headCellId = `head-cell-${index}`;

						const handleClick = () => {
							this.setState({ activeSortButtonId: headCellId });

							if (isSortable) {
								onSort(cell)();
							}
						};

						return (
							<HeadCellComponent
								colSpan={colSpan}
								content={content}
								isFixedSize={isFixedSize}
								isIconOnlyHeader={isIconOnlyHeader}
								isSortable={!!isSortable}
								isRanking={isRanking}
								key={key || index}
								headCellId={headCellId}
								activeSortButtonId={activeSortButtonId}
								onClick={handleClick}
								testId={cellTestId || testId}
								shouldTruncate={shouldTruncate}
								sortOrder={key === sortKey ? sortOrder : undefined}
								width={width}
								ascendingSortTooltip={ascendingSortTooltip}
								descendingSortTooltip={descendingSortTooltip}
								buttonAriaRoleDescription={buttonAriaRoleDescription}
								{...restCellProps}
							/>
						);
					})}
				</tr>
			</Head>
		);
	}
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default TableHead;
