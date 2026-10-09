import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Cell } from '@atlaskit/table-tree/cell';
import { Header } from '@atlaskit/table-tree/header';
import { Headers } from '@atlaskit/table-tree/headers';
import { Row } from '@atlaskit/table-tree/row';
import { Rows } from '@atlaskit/table-tree/rows';
import TableTree from '@atlaskit/table-tree/table-tree';
import { TableTreeDataHelper } from '@atlaskit/table-tree/table-tree-data-helper';

import { fetchNewItems, getDefaultItems } from './data';

type Item = {
	title: string;
	numbering: string;
	page: number;
	children?: Item[];
	id: string;
};

const tableTreeHelper = new TableTreeDataHelper<Item>({ key: 'numbering' });

const getInitialItems = () => {
	return tableTreeHelper.updateItems(getDefaultItems());
};

export default (): React.JSX.Element => {
	const [items, setItems] = useState<Item[]>(getInitialItems);

	const loadMore = useCallback(() => {
		fetchNewItems().then((newItems) => {
			setItems((items) => tableTreeHelper.appendItems(newItems, items, items[items.length - 1]));
		});
	}, []);

	return (
		<Box>
			<Button onClick={loadMore}>Load more</Button>
			<TableTree label="Appended data">
				<Headers>
					<Header width={200}>Chapter title</Header>
					<Header width={120}>Numbering</Header>
					<Header width={100}>Page</Header>
				</Headers>
				<Rows
					items={items}
					render={({ title, numbering, page, children = [] }) => (
						<Row
							itemId={numbering}
							items={children}
							hasChildren={children.length > 0}
							isDefaultExpanded
						>
							<Cell>{title}</Cell>
							<Cell>{numbering}</Cell>
							<Cell>{page}</Cell>
						</Row>
					)}
				/>
			</TableTree>
		</Box>
	);
};
