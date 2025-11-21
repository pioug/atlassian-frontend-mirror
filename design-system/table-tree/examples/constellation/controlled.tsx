import React, { useState } from 'react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '@atlaskit/table-tree';

import items from './data';

type Item = {
	title: string;
	numbering: string;
	page: number;
	children?: Item[];
	id: string;
};

const defaultExpansionMap: Record<string, boolean> = { '2': true };

export default (): React.JSX.Element => {
	const [expansionMap, setExpansionMap] = useState(defaultExpansionMap);
	return (
		<TableTree label="Manually controlled row expansion">
			<Headers>
				<Header width={200}>Chapter title</Header>
				<Header width={120}>Numbering</Header>
				<Header width={100}>Page</Header>
			</Headers>
			<Rows
				items={items}
				render={({ title, numbering, page, children = [] }: Item) => (
					<Row
						itemId={numbering}
						items={children}
						hasChildren={children.length > 0}
						isExpanded={Boolean(expansionMap[numbering])}
						onExpand={() => setExpansionMap({ ...expansionMap, [numbering]: true })}
						onCollapse={() => setExpansionMap({ ...expansionMap, [numbering]: false })}
					>
						<Cell singleLine>{title}</Cell>
						<Cell>{numbering}</Cell>
						<Cell>{page}</Cell>
					</Row>
				)}
			/>
		</TableTree>
	);
};
