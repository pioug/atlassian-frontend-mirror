import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import Lozenge from '@atlaskit/lozenge/lozenge';
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
				<Lozenge appearance="success" isBold>
					Done
				</Lozenge>
				<Lozenge appearance="inprogress" isBold>
					In progress
				</Lozenge>
				<Lozenge>To do</Lozenge>
			</Box>
		</IntlProvider>
	);
}
