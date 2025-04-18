/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '@atlaskit/table-tree';
import { token } from '@atlaskit/tokens';

const staticData = [
	{
		title: 'Chapter one: Introduction',
		description: 'Description One',
		id: 'chapter-one',
	},
	{
		title:
			'Chapter two: With a very very long title that will be cut off instead of spanning multiple lines',
		description: 'Description Two. This column can span multiple lines.',
		id: 'chapter-two',
	},
];

const overflowingBoxStyles = css({
	width: '150px',
	position: 'absolute',
	backgroundColor: token('color.background.danger.bold'),
	border: `5px solid ${token('color.border')}`,
	color: token('color.text.inverse'),
	insetBlockEnd: '100%',
	insetInlineEnd: token('space.0', '0px'),
	marginBlockEnd: '-15px',
});

export default () => (
	<TableTree>
		<Headers>
			<Header width={300}>Title</Header>
			<Header width={200}>Description</Header>
		</Headers>
		<Rows
			items={staticData}
			render={({ title, description }) => (
				<Row itemId={title} hasChildren={false}>
					<Cell singleLine>{title}</Cell>
					<Cell>
						{description} <div css={overflowingBoxStyles}>Overflowing box</div>
					</Cell>
				</Row>
			)}
		/>
	</TableTree>
);
