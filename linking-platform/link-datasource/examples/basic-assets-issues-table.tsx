import React from 'react';

import { cssMap } from '@compiled/react';

import { DatasourceTableView } from '@atlaskit/link-datasource';
import { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ExampleAssetsIssuesTableView } from '../examples-helpers/buildAssetsIssuesTable';

mockAssetsClientFetchRequests();

const styles = cssMap({
	tableWrapper: {
		marginInline: 'auto',
		marginTop: token('space.200'),
		width: '90%',
		borderRadius: token('radius.large'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		overflow: 'hidden',
	},
});

export default (): React.JSX.Element => {
	return (
		<Box xcss={styles.tableWrapper}>
			<ExampleAssetsIssuesTableView DatasourceTable={DatasourceTableView} />
		</Box>
	);
};
