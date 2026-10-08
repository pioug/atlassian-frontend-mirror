import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import Flag from '@atlaskit/flag/flag';
import CheckCircleIcon from '@atlaskit/icon/core/check-circle';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '320px',
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
				<Flag
					id="saved"
					title="Changes saved"
					description="Your project is up to date."
					icon={<CheckCircleIcon label="" color={token('color.icon.success')} />}
				/>
			</Box>
		</IntlProvider>
	);
}
