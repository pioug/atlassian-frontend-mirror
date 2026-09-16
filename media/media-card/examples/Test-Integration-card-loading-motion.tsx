import React from 'react';

import { type FileIdentifier } from '@atlaskit/media-client';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';
import {
	defaultBaseUrl,
	defaultCollectionName,
	generateFilesFromTestData,
	MediaMock,
	type MockFileInputParams,
	wideImage,
} from '@atlaskit/media-test-helpers';

import { MainWrapper } from '../example-helpers';
import Card from '../src/card/cardLoader';

// `hasLoadingMotion` is inert unless `aifc_page_create_defer_generated_visuals` is on. The test
// that drives this fixture passes it as the harness's `featureFlag` query param — setting a
// resolver here would not work, as the harness installs its own after this module is evaluated.

/** Separate ids, so each card fetches its own file rather than sharing a cache entry. */
const withMotion: FileIdentifier = {
	id: '1f35526d-0299-4e1c-be10-36af3c209c01',
	collectionName: defaultCollectionName,
	mediaItemType: 'file',
};
const withoutMotion: FileIdentifier = {
	id: '1f35526d-0299-4e1c-be10-36af3c209c02',
	collectionName: defaultCollectionName,
	mediaItemType: 'file',
};

const files = generateFilesFromTestData(
	[withMotion, withoutMotion].map(
		({ id }): MockFileInputParams => ({
			id: id as string,
			name: `media-test-file-${id}.png`,
			dataUri: wideImage,
		}),
	),
);

const mediaMock = new MediaMock({ [defaultCollectionName]: files });
mediaMock.enable();

const mediaClientConfig: MediaClientConfig = {
	authProvider: () =>
		Promise.resolve({
			clientId: '',
			token: '',
			baseUrl: defaultBaseUrl,
		}),
};

const dimensions = { width: 320, height: 240 };

export default (): React.JSX.Element => (
	<MainWrapper>
		<div data-testid="card-with-loading-motion">
			<Card
				identifier={withMotion}
				mediaClientConfig={mediaClientConfig}
				// Matches how the editor renders media single nodes.
				disableOverlay={true}
				dimensions={dimensions}
				hasLoadingMotion={true}
			/>
		</div>
		<div data-testid="card-without-loading-motion">
			<Card
				identifier={withoutMotion}
				mediaClientConfig={mediaClientConfig}
				disableOverlay={true}
				dimensions={dimensions}
			/>
		</div>
	</MainWrapper>
);
