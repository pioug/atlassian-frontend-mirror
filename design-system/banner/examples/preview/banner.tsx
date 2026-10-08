import React from 'react';

import { IntlProvider } from 'react-intl';

import Banner from '@atlaskit/banner/banner';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
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
				<Banner appearance="announcement">Scheduled maintenance on Saturday</Banner>
			</Box>
		</IntlProvider>
	);
}
