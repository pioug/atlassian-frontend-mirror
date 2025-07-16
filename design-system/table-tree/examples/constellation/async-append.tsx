import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives';
import TableTree, {
	Cell,
	Header,
	Headers,
	Row,
	Rows,
	TableTreeDataHelper,
} from '@atlaskit/table-tree';

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

export default () => {
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
