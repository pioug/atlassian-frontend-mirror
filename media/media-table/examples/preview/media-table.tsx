import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { MediaClientContext } from '@atlaskit/media-client-react/media-client-provider';
import MediaTable from '@atlaskit/media-table/media-table';
import { NameCell } from '@atlaskit/media-table/name-cell';
import { FileStateFactory } from '@atlaskit/media-test-helpers/factory';
const fileFactory = new FileStateFactory({ id: 'preview-file', mediaItemType: 'file' });
fileFactory.next('processed');
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '380px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<Box testId="component-preview" xcss={styles.subject}>
			<IntlProvider locale="en">
				<MediaClientContext.Provider value={fileFactory.mediaClient}>
					<MediaTable
						mediaClientConfig={{
							authProvider: async () => ({
								clientId: 'preview',
								token: '',
								baseUrl: 'https://example.invalid',
							}),
						}}
						items={[
							{
								identifier: { id: 'notes', mediaItemType: 'file' },
								data: {
									file: <NameCell text="Release notes.pdf" mediaType="doc" />,
									size: '240 KB',
								},
							},
							{
								identifier: { id: 'audio', mediaItemType: 'file' },
								data: {
									file: <NameCell text="Team update.mp3" mediaType="audio" />,
									size: '1.2 MB',
								},
							},
							{
								identifier: { id: 'sheet', mediaItemType: 'file' },
								data: { file: <NameCell text="Roadmap.xlsx" mediaType="doc" />, size: '84 KB' },
							},
						]}
						columns={{
							cells: [
								{ key: 'file', content: 'File name', width: 75 },
								{ key: 'size', content: 'Size', width: 25 },
							],
						}}
						totalItems={3}
						itemsPerPage={3}
					/>
				</MediaClientContext.Provider>
			</IntlProvider>
		</Box>
	);
}
