import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import { CardView } from '../../src/card/cardView';
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
				<CardView
					identifier={{ id: 'preview-document', mediaItemType: 'file' }}
					status="complete"
					mediaItemType="file"
					dimensions={{ width: 240, height: 160 }}
					metadata={{
						id: 'preview-document',
						name: 'Release notes.pdf',
						size: 240000,
						mediaType: 'doc',
						mimeType: 'application/pdf',
					}}
				/>
			</Box>
		</IntlProvider>
	);
}
