import React from 'react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '../../src';

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

export default () => (
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
