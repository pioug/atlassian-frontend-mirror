import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import MediaViewer from '@atlaskit/media-viewer/media-viewer-loader';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';

import cityscape from '../../../watermark-admin/src/assets/cityscape.jpg';
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
				<MediaViewer
					collectionName=""
					mediaClientConfig={{
						authProvider: async () => ({
							clientId: 'preview',
							token: '',
							baseUrl: 'https://example.invalid',
						}),
					}}
					selectedItem={{
						mediaItemType: 'external-image',
						dataURI: cityscape,
						name: 'Cityscape.jpg',
					}}
					items={[{ mediaItemType: 'external-image', dataURI: cityscape, name: 'Cityscape.jpg' }]}
					onClose={() => {}}
				/>
			</Box>
		</IntlProvider>
	);
}

export const previewOptions = { width: 'fit-content' as const, hoverSelector: '[role=dialog]' };
