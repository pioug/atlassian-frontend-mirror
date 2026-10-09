import React from 'react';

import Button from '@atlaskit/button/default/button';
import EmptyState from '@atlaskit/empty-state/empty-state';
import { Cell } from '@atlaskit/table-tree/cell';
import { Header } from '@atlaskit/table-tree/header';
import { Headers } from '@atlaskit/table-tree/headers';
import { Row } from '@atlaskit/table-tree/row';
import { Rows } from '@atlaskit/table-tree/rows';
import TableTree from '@atlaskit/table-tree/table-tree';

import items from './data';

type Item = {
	title: string;
	numbering: string;
	page: number;
	children?: Item[];
	id: string;
};

export default (): React.JSX.Element => (
	<TableTree label="Custom child component">
		<Headers>
			<Header width={200}>Chapter title</Header>
			<Header width={120}>Numbering</Header>
			<Header width={100}>Page</Header>
		</Headers>
		<Rows
			items={items}
			render={({ title, numbering, page, children = [] }: Item) =>
				numbering === '2.1' ? (
					<EmptyState
						header="Cannot load data"
						description="We're having trouble connecting to our database. Please check your internet connection and try again."
						primaryAction={<Button appearance="primary">Retry</Button>}
					/>
				) : (
					<Row
						itemId={numbering}
						items={children}
						hasChildren={children.length > 0}
						isDefaultExpanded
					>
						<Cell singleLine>{title}</Cell>
						<Cell singleLine>{numbering}</Cell>
						<Cell singleLine>{page}</Cell>
					</Row>
				)
			}
		/>
	</TableTree>
);
