import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import DynamicTable from '@atlaskit/dynamic-table/stateful';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '360px',
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
				<DynamicTable
					head={{
						cells: [
							{ key: 'task', content: 'Task' },
							{ key: 'status', content: 'Status' },
						],
					}}
					rows={[
						{ key: '1', cells: [{ content: 'Design review' }, { content: 'Done' }] },
						{ key: '2', cells: [{ content: 'Implementation' }, { content: 'In progress' }] },
						{ key: '3', cells: [{ content: 'Release' }, { content: 'To do' }] },
					]}
				/>
			</Box>
		</IntlProvider>
	);
}
