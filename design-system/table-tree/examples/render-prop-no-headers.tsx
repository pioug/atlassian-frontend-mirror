import React from 'react';

import { Cell } from '@atlaskit/table-tree/cell';
import { Row } from '@atlaskit/table-tree/row';
import { Rows } from '@atlaskit/table-tree/rows';
import TableTree from '@atlaskit/table-tree/table-tree';

import staticData from './data-cleancode-toc.json';

export default (): React.JSX.Element => (
	<TableTree>
		<Rows
			items={staticData.children}
			render={({ title, numbering, page, children }: any) => (
				<Row items={children} itemId={numbering} hasChildren={children.length > 0}>
					<Cell width={300} singleLine>
						{title}
					</Cell>
					<Cell width={50}>{page}</Cell>
				</Row>
			)}
		/>
	</TableTree>
);
