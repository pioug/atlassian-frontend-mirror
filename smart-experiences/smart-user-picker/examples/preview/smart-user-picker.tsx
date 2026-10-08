import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import SmartUserPicker from '@atlaskit/smart-user-picker/components';
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
		<Box testId="component-preview" xcss={styles.subject}>
			<IntlProvider locale="en">
				<SmartUserPicker
					productKey="jira"
					siteId="preview"
					fieldId="assignee"
					value={{ id: 'alex', name: 'Alex Morgan', type: 'user' }}
					bootstrapOptions={[{ id: 'alex', name: 'Alex Morgan', type: 'user' }]}
				/>
			</IntlProvider>
		</Box>
	);
}
