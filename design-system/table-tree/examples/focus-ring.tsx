import React from 'react';

import Link from '@atlaskit/link/link';
import { Cell } from '@atlaskit/table-tree/cell';
import { Header } from '@atlaskit/table-tree/header';
import { Headers } from '@atlaskit/table-tree/headers';
import { Row } from '@atlaskit/table-tree/row';
import { Rows } from '@atlaskit/table-tree/rows';
import TableTree from '@atlaskit/table-tree/table-tree';

const items = [
	{
		id: 'focused-cell',
		title: 'A long link title that is truncated when the cell is not focused',
		description: 'Use the Tab key to verify the link focus ring remains visible.',
		children: [],
	},
];

export default (): React.JSX.Element => (
	<TableTree>
		<Headers>
			<Header width={240}>Title</Header>
			<Header width={320}>Description</Header>
		</Headers>
		<Rows
			items={items}
			render={({ title, description, children }) => (
				<Row items={children} hasChildren={false}>
					<Cell singleLine>
						<Link href="https://atlassian.design" testId="single-line-cell-link">
							{title}
						</Link>
					</Cell>
					<Cell>{description}</Cell>
				</Row>
			)}
		/>
	</TableTree>
);
