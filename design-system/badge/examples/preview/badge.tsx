import React from 'react';

import { IntlProvider } from 'react-intl';

import Badge from '@atlaskit/badge/badge';
import { cssMap } from '@atlaskit/css';
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

export const previewOptions = { width: 'fit-content', scale: 2 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Badge appearance="added">+12</Badge>
				<Badge appearance="removed">−3</Badge>
				<Badge appearance="primary">8</Badge>
			</Box>
		</IntlProvider>
	);
}
