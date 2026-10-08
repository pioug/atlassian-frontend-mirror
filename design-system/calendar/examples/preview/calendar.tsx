import React from 'react';

import { IntlProvider } from 'react-intl';

import Calendar from '@atlaskit/calendar/calendar';
import { cssMap } from '@atlaskit/css';
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
				<Calendar day={14} month={6} year={2026} defaultSelected={['2026-06-14']} />
			</Box>
		</IntlProvider>
	);
}
