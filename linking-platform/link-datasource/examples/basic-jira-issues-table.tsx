import React from 'react';

import { cssMap } from '@compiled/react';

import { DatasourceTableView } from '@atlaskit/link-datasource';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ExampleJiraIssuesTableView } from '../examples-helpers/buildJiraIssuesTable';

const styles = cssMap({
	tableWrapper: {
		marginInline: 'auto',
		marginTop: token('space.200'),
		width: '90%',
		borderRadius: token('border.radius.200'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		overflow: 'hidden',
	},
});

export default () => {
	return (
		<Box xcss={styles.tableWrapper}>
			<ExampleJiraIssuesTableView DatasourceTable={DatasourceTableView} />
		</Box>
	);
};
