import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
import { UserPicker } from '@atlaskit/user-picker/components/user-picker';
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
				<UserPicker
					fieldId="assignee"
					value={{ id: 'example-user', name: 'Alex Chen' }}
					options={[
						{ id: 'example-user', name: 'Alex Chen' },
						{ id: 'example-reviewer', name: 'Example reviewer' },
					]}
				/>
			</Box>
		</IntlProvider>
	);
}
