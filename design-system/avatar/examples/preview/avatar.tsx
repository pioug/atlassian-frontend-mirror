import React from 'react';

import { IntlProvider } from 'react-intl';

import Avatar from '@atlaskit/avatar/avatar';
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
				<Avatar size="xlarge" name="Alex Morgan" appearance="circle" />
				<Avatar size="xlarge" name="Sam Taylor" appearance="square" />
				<Avatar size="xlarge" name="Charlie Lee" appearance="hexagon" />
			</Box>
		</IntlProvider>
	);
}
