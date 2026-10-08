import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import TaskItem from '@atlaskit/task-decision/task-item';
import TaskList from '@atlaskit/task-decision/task-list';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '300px',
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
				<TaskList>
					<TaskItem taskId="plan" contentRef={() => {}} isDone>
						Review release notes
					</TaskItem>
					<TaskItem taskId="share" contentRef={() => {}}>
						Share with your team
					</TaskItem>
				</TaskList>
			</Box>
		</IntlProvider>
	);
}
