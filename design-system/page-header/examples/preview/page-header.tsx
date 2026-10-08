import React from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import PageHeader from '@atlaskit/page-header/page-header';
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
				<PageHeader actions={<Button appearance="primary">Create</Button>}>Projects</PageHeader>
			</Box>
		</IntlProvider>
	);
}
