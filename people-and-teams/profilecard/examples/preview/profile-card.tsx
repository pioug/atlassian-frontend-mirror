import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { ProfilecardInternal as ProfileCard } from '@atlaskit/profilecard/profilecard-internal';
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
				<ProfileCard
					fullName="Alex Chen"
					nickname="alex"
					meta="Product designer"
					email="alex@example.com"
					location="Sydney, Australia"
					timestring="09:30"
					actions={[{ label: 'View profile', id: 'profile', callback: () => {} }]}
				/>
			</Box>
		</IntlProvider>
	);
}
