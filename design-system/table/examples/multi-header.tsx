import React from 'react';

import { TBody } from '@atlaskit/table/body';
import { HeadCell } from '@atlaskit/table/head-cell';
import { Row } from '@atlaskit/table/row';
import Table from '@atlaskit/table/table';
import { Cell } from '@atlaskit/table/td';
import { THead } from '@atlaskit/table/thead';

import { presidents } from './content/presidents';

/**
 * Primary UI component for user interaction
 */
const CompositionExample = (): React.JSX.Element => {
	return (
		<Table testId="table">
			<THead>
				<HeadCell>Name</HeadCell>
				<HeadCell>Party</HeadCell>
				<HeadCell>Year</HeadCell>
			</THead>
			<TBody>
				{presidents.map((row) => (
					<Row key={row.id}>
						<HeadCell backgroundColor="color.background.neutral" scope="row">
							{row.name}
						</HeadCell>
						<Cell>{row.party}</Cell>
						<Cell>{row.term}</Cell>
					</Row>
				))}
			</TBody>
		</Table>
	);
};

export default CompositionExample;
