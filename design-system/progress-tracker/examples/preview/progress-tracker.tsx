import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import ProgressTracker from '@atlaskit/progress-tracker/progress-tracker';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '320px',
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
				<ProgressTracker
					animated={false}
					items={[
						{ id: '1', label: 'Details', percentageComplete: 100, status: 'visited' },
						{ id: '2', label: 'Review', percentageComplete: 0, status: 'current' },
						{ id: '3', label: 'Publish', percentageComplete: 0, status: 'unvisited' },
					]}
				/>
			</Box>
		</IntlProvider>
	);
}
