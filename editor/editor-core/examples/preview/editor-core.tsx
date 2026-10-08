import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import Editor from '@atlaskit/editor-core/editor';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '340px',
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
				<Editor
					appearance="comment"
					defaultValue={{
						version: 1,
						type: 'doc',
						content: [
							{ type: 'paragraph', content: [{ type: 'text', text: 'Ready for review.' }] },
						],
					}}
				/>
			</Box>
		</IntlProvider>
	);
}
