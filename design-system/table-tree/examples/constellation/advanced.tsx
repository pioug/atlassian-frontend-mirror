import React from 'react';

import { Cell } from '@atlaskit/table-tree/cell';
import { Header } from '@atlaskit/table-tree/header';
import { Headers } from '@atlaskit/table-tree/headers';
import { Row } from '@atlaskit/table-tree/row';
import { Rows } from '@atlaskit/table-tree/rows';
import TableTree from '@atlaskit/table-tree/table-tree';

type Item = {
	id: string;
	title: string;
	description: string;
	children?: Item[];
};

const items = [
	{
		id: 'item1',
		title: 'Item 1',
		description: 'First top-level item',
	},
	{
		id: 'item2',
		title: 'Item 2',
		description: 'Second top-level item',
		children: [
			{
				id: 'child2.1',
				title: 'Child item',
				description: 'A child item',
			},
		],
	},
];

export default (): React.JSX.Element => (
	<TableTree label="Advanced usage">
		<Headers>
			<Header width={120}>Title</Header>
			<Header width={300}>Description</Header>
		</Headers>
		<Rows
			items={items}
			render={({ id, title, description, children = [] }: Item) => (
				<Row itemId={id} items={children} hasChildren={children.length > 0}>
					<Cell>{title}</Cell>
					<Cell>{description}</Cell>
				</Row>
			)}
		/>
	</TableTree>
);
