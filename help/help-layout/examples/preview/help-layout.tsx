import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import HelpLayout from '@atlaskit/help-layout/HelpLayout';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '340px',
		height: '240px',
		position: 'relative',
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
				<HelpLayout headerTitle="Project help" isBackbuttonVisible onCloseButtonClick={() => {}}>
					<Box padding="space.200">Invite your team from project settings.</Box>
				</HelpLayout>
			</Box>
		</IntlProvider>
	);
}
