import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import Textfield from '@atlaskit/textfield/text-field';
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
				<Textfield aria-label="Project name" defaultValue="Atlas project" />
			</Box>
		</IntlProvider>
	);
}
