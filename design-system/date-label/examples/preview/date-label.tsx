import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import DateLabel from '@atlaskit/date-label/date-label';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export const previewOptions = { width: 'fit-content', scale: 1.5 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<DateLabel label="14 Jun 2026" appearance="neutral" />
				<DateLabel label="18 Jun 2026" appearance="warning" />
				<DateLabel label="12 Jun 2026" appearance="danger" />
			</Box>
		</IntlProvider>
	);
}
