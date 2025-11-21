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
			title: 'ReallyLongNameThatWrapsOverToTheNextLine',
			description: 'First top-level item',
		},
		hasChildren: false,
		children: [],
	},
	{
		id: 'item2',
		content: {
			title: 'Multi-line header row ',
			description:
				'A second top-level item with a really long description that should wrap over to the next line, taller than the first item and demonstrating the behaviour of the first item and chevron.',
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
	{
		id: 'item3',
		content: {
			title: 'Single-line ',
			description: 'A single-line row with a short description',
		},
		hasChildren: true,
		children: [
			{
				id: 'child3.1',
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

export default (): React.JSX.Element => (
	<TableTree
		columns={[Title, Description]}
		headers={['Title', 'Description']}
		columnWidths={['120px', '300px']}
		items={items}
	/>
);
