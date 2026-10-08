import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import SectionMessage from '@atlaskit/section-message/message';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '360px',
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
				<SectionMessage title="Changes saved" appearance="success">
					<p>Your team can now view this project.</p>
				</SectionMessage>
			</Box>
		</IntlProvider>
	);
}
