import React from 'react';

import { Header } from '@atlaskit/table-tree/header';
import { Headers } from '@atlaskit/table-tree/headers';
import { Rows } from '@atlaskit/table-tree/rows';
import TableTree from '@atlaskit/table-tree/table-tree';

export default (): React.JSX.Element => (
	<TableTree>
		<Headers>
			<Header width={200}>Title</Header>
			<Header width={120}>Numbering</Header>
		</Headers>
		<Rows items={undefined} render={() => null} />
	</TableTree>
);
