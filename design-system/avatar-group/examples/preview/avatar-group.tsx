import React from 'react';

import { IntlProvider } from 'react-intl';

import AvatarGroup from '@atlaskit/avatar-group/avatar-group';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<AvatarGroup
					size="large"
					maxCount={3}
					data={[
						{ name: 'Alex Morgan' },
						{ name: 'Sam Taylor' },
						{ name: 'Charlie Lee' },
						{ name: 'Riley Chen' },
						{ name: 'Jordan Kim' },
					]}
				/>
			</Box>
		</IntlProvider>
	);
}
