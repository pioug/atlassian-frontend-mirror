import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { ExampleJiraIssuesTableView } from '../../examples-helpers/buildJiraIssuesTable';
const styles = cssMap({
	subject: {
		width: '360px',
		height: '260px',
		overflow: 'hidden',
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
				<ExampleJiraIssuesTableView
					visibleColumnKeys={['key', 'summary']}
					scrollableContainerHeight={180}
				/>
			</Box>
		</IntlProvider>
	);
}
