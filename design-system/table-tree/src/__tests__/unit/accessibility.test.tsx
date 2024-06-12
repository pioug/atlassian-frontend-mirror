import React from 'react';

import { render, screen } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import TableTree, { Header, Headers, Rows } from '../../index';

it('TableTree should pass basic axe audit', async () => {
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

	const Title = (props: Content) => <span>{props.title}</span>;
	const Description = (props: Content) => <span>{props.description}</span>;

	const { container } = render(
		<TableTree
			columns={[Title, Description]}
			headers={['Title', 'Description']}
			columnWidths={['120px', '300px']}
			items={items}
		/>,
	);

	await axe(container);

	const expand = screen.getByRole('button');
	expand.click();

	await axe(container);
});

it('Loading TableTree should pass basic axe audit', async () => {
	const { container } = render(
		<TableTree>
			<Headers>
				<Header width={200}>Chapter title</Header>
				<Header width={120}>Numbering</Header>
				<Header width={100}>Page</Header>
			</Headers>
			<Rows items={undefined} render={() => null} />
		</TableTree>,
	);

	await axe(container);
});
