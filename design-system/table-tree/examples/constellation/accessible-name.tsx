import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import TableTree from '@atlaskit/table-tree';

type Content = { title: string; description: string };

type Item = {
	id: string;
	content: Content;
	hasChildren: boolean;
	children?: Item[];
};

const items: Item[] = [
	{
		id: 'item1',
		content: {
			title: 'Item 1',
			description: 'First top-level item',
		},
		hasChildren: false,
		children: [],
	},
	{
		id: 'item2',
		content: {
			title: 'Item 2',
			description: 'Second top-level item',
		},
		hasChildren: true,
		children: [
			{
				id: 'child2.1',
				content: {
					title: 'Child item',
					description: 'A child item',
				},
				hasChildren: false,
			},
		],
	},
];

const Title = (props: Content) => <Box as="span">{props.title}</Box>;
const Description = (props: Content) => <Box as="span">{props.description}</Box>;

export default () => (
	<div>
		<h3>Using an explicit label</h3>
		<TableTree
			columns={[Title, Description]}
			headers={['Title', 'Description']}
			columnWidths={['120px', '300px']}
			items={items}
			label="Explicit labelling example"
		/>
		<h3 id="referenced-label">Using a reference to an element</h3>
		<TableTree
			columns={[Title, Description]}
			headers={['Title', 'Description']}
			columnWidths={['120px', '300px']}
			items={items}
			referencedLabel="referenced-label"
		/>
	</div>
);
