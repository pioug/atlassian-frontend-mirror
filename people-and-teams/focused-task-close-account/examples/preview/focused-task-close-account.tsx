import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { DeleteUserContentPreviewScreen } from '@atlaskit/focused-task-close-account/delete-user-content-preview-screen';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '440px',
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
				<DeleteUserContentPreviewScreen
					preferenceSelection={() => {}}
					isCurrentUser={false}
					user={{ fullName: 'Alex Morgan', email: 'alex@example.com', avatarUrl: '' }}
				/>
			</IntlProvider>
		</Box>
	);
}
