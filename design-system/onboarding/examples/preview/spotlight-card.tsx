import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import SpotlightCard from '@atlaskit/onboarding/spotlight-card';
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
				<SpotlightCard
					heading="Meet your new workspace"
					actions={[{ text: 'Got it', onClick: () => {} }]}
				>
					Keep your team’s projects in one place.
				</SpotlightCard>
			</Box>
		</IntlProvider>
	);
}
