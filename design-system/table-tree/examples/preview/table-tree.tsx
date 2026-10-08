import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Cell } from '@atlaskit/table-tree/cell';
import { Header } from '@atlaskit/table-tree/header';
import { Headers } from '@atlaskit/table-tree/headers';
import { Row } from '@atlaskit/table-tree/row';
import TableTree from '@atlaskit/table-tree/table-tree';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '340px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<TableTree>
					<Headers>
						<Header width={240}>Project</Header>
						<Header width={100}>Status</Header>
					</Headers>
					<Row itemId="atlas" hasChildren isExpanded>
						<Cell>Atlas</Cell>
						<Cell>Active</Cell>
					</Row>
					<Row itemId="design" depth={1}>
						<Cell>Design review</Cell>
						<Cell>Done</Cell>
					</Row>
					<Row itemId="release" depth={1}>
						<Cell>Release</Cell>
						<Cell>Todo</Cell>
					</Row>
				</TableTree>
			</Box>
		</IntlProvider>
	);
}
