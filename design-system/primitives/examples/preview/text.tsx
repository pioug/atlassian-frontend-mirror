import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
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

export const previewOptions = { width: 'fit-content', scale: 1.5 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Stack space="space.150">
					<Text size="large" weight="bold">
						Release planning
					</Text>
					<Text>Ready for your team</Text>
					<Text size="small" color="color.text.subtle">
						Updated today
					</Text>
				</Stack>
			</Box>
		</IntlProvider>
	);
}
