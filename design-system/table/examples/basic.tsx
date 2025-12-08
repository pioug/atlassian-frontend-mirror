import React, { Fragment } from 'react';

import Button from '@atlaskit/button/new';
import Table, { Cell, HeadCell, Row, SortableColumn, TBody, THead } from '@atlaskit/table';

import { presidents } from './content/presidents';

/**
 * Example use case of the full 'data table'.
 *
 * Features:
 *
 * 1. Sorting
 * 2. Type data
 * 3. Selection / Multi-selection
 */
export default function Basic(): React.JSX.Element {
	return (
		<Table isSelectable testId="table">
			<THead
				actions={() => (
					<Fragment>
						<Button>Edit</Button>
						<Button>Delete</Button>
					</Fragment>
				)}
			>
				<SortableColumn name="name">Name</SortableColumn>
				<SortableColumn name="party">Party</SortableColumn>
				<HeadCell>Year</HeadCell>
			</THead>
			<TBody rows={presidents}>
				{(row) => (
					<Row key={row.id} {...row}>
						<Cell>{row.name}</Cell>
						<Cell>{row.party}</Cell>
						<Cell>{row.term}</Cell>
					</Row>
				)}
			</TBody>
		</Table>
	);
}
