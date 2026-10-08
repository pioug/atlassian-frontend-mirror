import React from 'react';

import { IntlProvider } from 'react-intl';

import { Checkbox } from '@atlaskit/checkbox/checkbox';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'flex-start',
		flexDirection: 'column',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export const previewOptions = { width: 'fit-content', scale: 1.5 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Checkbox label="Include attachments" isChecked />
				<Checkbox label="Notify team" />
			</Box>
		</IntlProvider>
	);
}
