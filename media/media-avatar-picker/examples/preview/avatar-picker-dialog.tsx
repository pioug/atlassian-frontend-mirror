import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import AvatarPickerDialog from '@atlaskit/media-avatar-picker/avatar-picker-dialog-loader';
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

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<AvatarPickerDialog
					avatars={[]}
					onAvatarPicked={() => {}}
					onImagePicked={() => {}}
					onCancel={() => {}}
				/>
			</Box>
		</IntlProvider>
	);
}
