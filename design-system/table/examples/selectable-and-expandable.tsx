import React from 'react';

import { Date as AKDate } from '@atlaskit/date/date';
import SectionMessage from '@atlaskit/section-message/message';
import { TBody } from '@atlaskit/table/body';
import { ExpandableCell } from '@atlaskit/table/expandable-cell';
import { ExpandableRow } from '@atlaskit/table/expandable-row';
import { ExpandableRowContent } from '@atlaskit/table/expandable-row-content';
import { HeadCell } from '@atlaskit/table/head-cell';
import { Row } from '@atlaskit/table/row';
import Table from '@atlaskit/table/table';
import { Cell } from '@atlaskit/table/td';
import { THead } from '@atlaskit/table/thead';
import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';

export default function SelectableAndExpandable(): React.JSX.Element {
	return (
		<Table isSelectable>
			<THead>
				<HeadCell>
					{/* A hidden label can be used to title the column for accessibility */}
					<VisuallyHidden>Expand row</VisuallyHidden>
				</HeadCell>
				<HeadCell>Item</HeadCell>
				<HeadCell>Category</HeadCell>
				<HeadCell align="number">Quantity</HeadCell>
				<HeadCell align="number">Cost</HeadCell>
				<HeadCell>Date</HeadCell>
			</THead>
			<TBody>
				<ExpandableRow isDefaultExpanded>
					<Row>
						<ExpandableCell />
						<Cell>Banana</Cell>
						<Cell>Groceries</Cell>
						<Cell align="number">5</Cell>
						<Cell align="number">$5.62</Cell>
						<Cell>
							<AKDate value={Number(new Date('01/11/2023'))} />
						</Cell>
					</Row>
					<ExpandableRowContent>
						<Row>
							<Cell />
							<Cell />
							<Cell />
							<Cell align="number">2</Cell>
							<Cell align="number">$2.03</Cell>
							<Cell>
								<AKDate value={Number(new Date('01/21/2023'))} />
							</Cell>
						</Row>
						<Row>
							<Cell />
							<Cell />
							<Cell />
							<Cell align="number">3</Cell>
							<Cell align="number">$3.59</Cell>
							<Cell>
								<AKDate value={Number(new Date('01/29/2023'))} />
							</Cell>
						</Row>
					</ExpandableRowContent>
				</ExpandableRow>
				<ExpandableRow>
					<Row>
						<ExpandableCell />
						<Cell>Chair</Cell>
						<Cell>Homeware</Cell>
						<Cell align="number">1</Cell>
						<Cell align="number">$74.87</Cell>
						<Cell>
							<AKDate value={Number(new Date('02/03/2023'))} />
						</Cell>
					</Row>
					<ExpandableRowContent>
						<Row>
							<Cell />
							<Cell colSpan={5}>
								<SectionMessage appearance="discovery">
									<p>This is a full-width expanded row.</p>
								</SectionMessage>
							</Cell>
						</Row>
					</ExpandableRowContent>
				</ExpandableRow>
				{/* Non-expanding row */}
				<Row>
					<Cell />
					<Cell>Shirt</Cell>
					<Cell>Clothing</Cell>
					<Cell align="number">2</Cell>
					<Cell align="number">$89.62</Cell>
					<Cell>
						<AKDate value={Number(new Date('02/19/2023'))} />
					</Cell>
				</Row>
			</TBody>
		</Table>
	);
}
