import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import Select from '@atlaskit/select/default';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '280px',
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
				<Select
					inputId="assignee"
					defaultValue={{ label: 'Alex Morgan', value: 'alex' }}
					options={[
						{ label: 'Alex Morgan', value: 'alex' },
						{ label: 'Sam Taylor', value: 'sam' },
					]}
				/>
			</Box>
		</IntlProvider>
	);
}
