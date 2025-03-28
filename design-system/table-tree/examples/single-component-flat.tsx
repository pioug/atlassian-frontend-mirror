import React from 'react';

import TableTree from '@atlaskit/table-tree';

const staticData = {
	children: [
		{
			id: 'root1',
			content: {
				title: 'Root 1',
				description: 'First top-level entry',
			},
			hasChildren: false,
			children: [],
		},
		{
			id: 'root2',
			content: {
				title: 'Root 2',
				description: 'Second top-level entry',
			},
			hasChildren: false,
			children: [],
		},
	],
};

/* eslint react/prop-types: 0 */
const Title = (props: any) => <span>{props.title}</span>;
const Description = (props: any) => <span>{props.description}</span>;

export default () => (
	<TableTree
		columns={[Title, Description]}
		headers={['Title', 'Description']}
		columnWidths={['100px', '300px']}
		items={staticData.children}
	/>
);
