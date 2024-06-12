import React from 'react';

import { Box } from '@atlaskit/primitives';

import TableTree from '../../src';

type Content = { title: string; numbering: string; page: number };

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
			title: 'Chapter 1: Clean code',
			numbering: '1',
			page: 1,
		},
		hasChildren: true,
		children: [
			{
				id: 'child1.1',
				content: {
					title: 'There will be code',
					numbering: '1.1',
					page: 2,
				},
				hasChildren: false,
			},
			{
				id: 'child1.2',
				content: {
					title: 'Bad code',
					numbering: '1.2',
					page: 3,
				},
				hasChildren: false,
			},
			{
				id: 'child1.3',
				content: {
					title: 'The cost of owning a mess',
					numbering: '1.3',
					page: 4,
				},
				hasChildren: true,
				children: [
					{
						id: 'child1.3.1',
						content: {
							title: 'Redesigning your code',
							numbering: '1.3.1',
							page: 5,
						},
						hasChildren: false,
					},
					{
						id: 'child1.3.2',
						content: {
							title: 'Accessibility considerations',
							numbering: '1.3.2',
							page: 5,
						},
						hasChildren: false,
					},
					{
						id: 'child1.3.3',
						content: {
							title: 'Planning for clean code',
							numbering: '1.3.3',
							page: 6,
						},
						hasChildren: false,
					},
					{
						id: 'child1.3.4',
						content: {
							title: 'The art of clean code',
							numbering: '1.3.4',
							page: 6,
						},
						hasChildren: false,
					},
					{
						id: 'child1.3.5',
						content: {
							title: 'What is clean code',
							numbering: '1.3.5',
							page: 7,
						},
						hasChildren: false,
					},
				],
			},
		],
	},
	{
		id: 'item2',
		content: {
			title: 'Chapter 2: Meaningful names',
			numbering: '2',
			page: 17,
		},
		hasChildren: false,
	},
	{
		id: 'item3',
		content: {
			title: 'Chapter 3: Functions',
			numbering: '3',
			page: 17,
		},
		hasChildren: true,
		children: [
			{
				id: 'child3.1',
				content: {
					title: 'Small!',
					numbering: '3.1',
					page: 34,
				},
				hasChildren: false,
			},
			{
				id: 'child3.2',
				content: {
					title: 'Do one thing',
					numbering: '3.2',
					page: 35,
				},
				hasChildren: false,
			},
			{
				id: 'child3.3',
				content: {
					title: 'One level of abstraction per function',
					numbering: '3.3',
					page: 36,
				},
				hasChildren: false,
			},
			{
				id: 'child3.4',
				content: {
					title: 'Switch statements',
					numbering: '3.4',
					page: 37,
				},
				hasChildren: false,
			},
			{
				id: 'child3.5',
				content: {
					title: 'Use descriptive names',
					numbering: '3.5',
					page: 39,
				},
				hasChildren: false,
			},
		],
	},
];

const Title = (props: Content) => <Box as="span">{props.title}</Box>;
const Numbering = (props: Content) => <Box as="span">{props.numbering}</Box>;
const Page = (props: Content) => <Box as="span">{props.page}</Box>;

export default () => (
	<TableTree
		columns={[Title, Numbering, Page]}
		headers={['Chapter Title', 'Numbering', 'Page']}
		mainColumnForExpandCollapseLabel="title"
		columnWidths={['200px', '100px', '100px']}
		items={items}
		label="Aria labelled expand and collapse button example"
	/>
);
