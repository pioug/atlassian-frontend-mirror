/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuidv4 } from 'uuid';

import { MediaClient } from '@atlaskit/media-client/media-client';
import type { UploadableFile, UploadableFileUpfrontIds } from '@atlaskit/media-client/uploader';
import { defaultCollectionName } from '@atlaskit/media-test-helpers/collectionNames';
import {
	docFileId,
	videoProcessingFailedId,
	codeFileId,
	largePdfFileId,
	unknownFileId,
} from '@atlaskit/media-test-helpers/exampleMediaItems';
import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers/mediaClientProvider';
import { dataURItoBlob } from '@atlaskit/media-test-helpers/mock-data-utils';
import { smallImage } from '@atlaskit/media-test-helpers/smallImageURI';

import { MainWrapper } from '../example-helpers';
import { mediaInlineTableStyles, mediaInlineWrapperStyles } from '../example-helpers/styles';
import MediaInlineCard from '../src/inline/loader';

const mediaClientConfig = createUploadMediaClientConfig();

const mediaClient = new MediaClient(mediaClientConfig);
const file: UploadableFile = {
	content: smallImage,
	collection: defaultCollectionName,
	name: 'test.png',
	// `content` is a data URI, so the byte size has to come from the decoded blob
	size: dataURItoBlob(smallImage).size,
};

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
const uploadingFileId = uuidv4();
const uploadableFileUpfrontIds: UploadableFileUpfrontIds = {
	id: uploadingFileId,
	deferredUploadId: Promise.resolve(''),
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	occurrenceKey: uuidv4(),
};

mediaClient.file.upload(file, undefined, uploadableFileUpfrontIds, undefined).subscribe({
	next: (response) => {
		console.log(response);
	},
	error: (error) => {
		console.log(error);
	},
});
export default (): React.JSX.Element => {
	return (
		<MainWrapper disableFeatureFlagWrapper={true}>
			<IntlProvider locale={'en'}>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
				<div css={mediaInlineWrapperStyles}>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					<table css={mediaInlineTableStyles}>
						<tbody>
							<tr>
								<th>Type</th>
								<th>Link</th>
							</tr>
							<tr>
								<td>Doc</td>
								<td>
									<MediaInlineCard
										identifier={docFileId}
										mediaClientConfig={mediaClientConfig}
										shouldOpenMediaViewer
									/>
								</td>
							</tr>
							<tr>
								<td>Pdf</td>
								<td>
									<MediaInlineCard
										identifier={largePdfFileId}
										mediaClientConfig={mediaClientConfig}
										shouldOpenMediaViewer
									/>
								</td>
							</tr>
							<tr>
								<td>Code</td>
								<td>
									<MediaInlineCard
										identifier={codeFileId}
										mediaClientConfig={mediaClientConfig}
										shouldOpenMediaViewer
									/>
								</td>
							</tr>
							<tr>
								<td>Unknown File</td>
								<td>
									<MediaInlineCard
										identifier={unknownFileId}
										mediaClientConfig={mediaClientConfig}
										shouldOpenMediaViewer
									/>
								</td>
							</tr>
							<tr>
								<td>Error processing</td>
								<td>
									<MediaInlineCard
										identifier={videoProcessingFailedId}
										mediaClientConfig={mediaClientConfig}
										shouldOpenMediaViewer
									/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</IntlProvider>
		</MainWrapper>
	);
};
