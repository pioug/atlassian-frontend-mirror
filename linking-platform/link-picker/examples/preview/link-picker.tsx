import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { LazyLinkPicker as LinkPicker } from '@atlaskit/link-picker/lazy';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '420px',
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
				<LinkPicker
					url="https://example.com/project"
					displayText="Project overview"
					onSubmit={() => {}}
					onCancel={() => {}}
				/>
			</Box>
		</IntlProvider>
	);
}
