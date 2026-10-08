import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import Mention from '@atlaskit/mention/mention';
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

export const previewOptions = { width: 'fit-content', scale: 1.5 } as const;
export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Mention id="preview-user" text="@Alex Chen" />
				<Mention id="preview-team" text="@Atlas team" isHighlighted />
			</Box>
		</IntlProvider>
	);
}
