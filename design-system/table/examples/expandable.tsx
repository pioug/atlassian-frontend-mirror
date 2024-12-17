import React from 'react';

import { Date as AKDate } from '@atlaskit/date';
import SectionMessage from '@atlaskit/section-message';
import VisuallyHidden from '@atlaskit/visually-hidden';

import Table, {
	Cell,
	ExpandableCell,
	ExpandableRow,
	ExpandableRowContent,
	HeadCell,
	Row,
	TBody,
	THead,
} from '../src';

export default function Expandable() {
	return (
		<Table testId="expandable-table">
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
