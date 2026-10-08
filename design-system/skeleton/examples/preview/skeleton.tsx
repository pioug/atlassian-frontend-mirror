import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import Skeleton from '@atlaskit/skeleton';
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
				<Stack space="space.150">
					<Skeleton width="240px" height="24px" />
					<Skeleton width="200px" height="16px" />
					<Skeleton width="160px" height="16px" />
				</Stack>
			</Box>
		</IntlProvider>
	);
}
