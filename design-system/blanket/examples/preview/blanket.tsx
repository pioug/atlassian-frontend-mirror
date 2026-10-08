import React from 'react';

import { IntlProvider } from 'react-intl';

import Blanket from '@atlaskit/blanket/blanket';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '360px',
		height: '220px',
		transform: 'translateX(0)',
		overflow: 'hidden',
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
				<Blanket isTinted />
			</Box>
		</IntlProvider>
	);
}
