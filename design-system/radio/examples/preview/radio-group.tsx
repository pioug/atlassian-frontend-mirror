import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import RadioGroup from '@atlaskit/radio/radio-group';
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
				<RadioGroup
					name="visibility"
					defaultValue="team"
					options={[
						{ name: 'visibility', value: 'team', label: 'Team' },
						{ name: 'visibility', value: 'private', label: 'Private' },
					]}
				/>
			</Box>
		</IntlProvider>
	);
}
