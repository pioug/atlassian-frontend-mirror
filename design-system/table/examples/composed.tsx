import React from 'react';

import Table, { Cell, HeadCell, Row, TBody, THead } from '@atlaskit/table';

import { presidents } from './content/presidents';

/**
 * Primary UI component for user interaction
 */
const CompositionExample = (): React.JSX.Element => {
	return (
		<Table>
			<THead>
				<HeadCell>Name</HeadCell>
				<HeadCell>Party</HeadCell>
				<HeadCell>Year</HeadCell>
			</THead>
			<TBody>
				{presidents.map((row) => (
					<Row key={row.id}>
						<Cell>{row.name}</Cell>
						<Cell>{row.party}</Cell>
						<Cell>{row.term}</Cell>
					</Row>
				))}
			</TBody>
		</Table>
	);
};

export default CompositionExample;
