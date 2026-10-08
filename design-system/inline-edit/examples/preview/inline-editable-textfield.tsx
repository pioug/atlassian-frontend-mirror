import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import InlineEditableTextfield from '@atlaskit/inline-edit/inline-editable-textfield';
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
				<InlineEditableTextfield
					defaultValue="Release planning"
					label="Title"
					placeholder="Enter a title"
					startWithEditViewOpen
					onConfirm={() => {}}
				/>
			</Box>
		</IntlProvider>
	);
}
