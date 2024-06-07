import React from 'react';
import {
	StoryList,
	wideImage,
	defaultBaseUrl,
	generateFilesFromTestData,
	MediaMock,
	defaultCollectionName,
	type MockFileInputParams,
} from '@atlaskit/media-test-helpers';
import { type FileIdentifier } from '@atlaskit/media-client';
import { token } from '@atlaskit/tokens';
import { Card } from '../src';
import { DelayedRender } from '../example-helpers/DelayedRender';
import { type MediaClientConfig } from '@atlaskit/media-core';
import { MainWrapper } from '../example-helpers';

const identifiers = [1, 2, 3, 4].map(
	(id: number): FileIdentifier => ({
		id: `1f35526d-0299-4e1c-be10-36af3c209ab${id}`,
		collectionName: defaultCollectionName,
		mediaItemType: 'file',
	}),
);
const freshNewFile: FileIdentifier = {
	id: `1f35526d-0299-4e1c-be10-36af3c209781`,
	collectionName: defaultCollectionName,
	mediaItemType: 'file',
};
const files = generateFilesFromTestData(
	[...identifiers.slice(0, 3), freshNewFile].map(
		({ id }: FileIdentifier): MockFileInputParams => ({
			id: id as string,
			name: `media-test-file-${id}.png`,
			dataUri: wideImage,
		}),
	),
);
const loadingFiles = generateFilesFromTestData([
	{
		id: identifiers[3].id as string,
		name: `media-test-file-${identifiers[3].id}.png`,
		dataUri: wideImage,
		processingStatus: 'pending',
	},
]);

const mediaMock = new MediaMock({
	[defaultCollectionName]: files.concat(...loadingFiles),
});
mediaMock.enable();

const mediaClientConfig: MediaClientConfig = {
	authProvider: () =>
		Promise.resolve({
			clientId: '',
			token: '',
			baseUrl: defaultBaseUrl,
		}),
};

// standard
const standardCards = [
	{
		title: 'Image',
		content: (
			<div data-testid="media-card-standard">
				<Card
					identifier={identifiers[0]}
					mediaClientConfig={mediaClientConfig}
					appearance="image"
				/>
			</div>
		),
	},
];
const cardWithContextId = [
	{
		title: 'Image with parameter',
		content: (
			<div data-testid="media-card-with-context-id">
				<Card
					identifier={identifiers[1]}
					mediaClientConfig={mediaClientConfig}
					appearance="image"
					contextId="some-id"
				/>
			</div>
		),
	},
];
const standardCardWithMediaViewer = [
	{
		title: 'Image with media viewer integration',
		content: (
			<div data-testid="media-card-standard-with-media-viewer">
				<Card
					identifier={identifiers[2]}
					mediaClientConfig={mediaClientConfig}
					appearance="image"
					shouldOpenMediaViewer
					mediaViewerItems={[identifiers[2]]}
				/>
			</div>
		),
	},
];
const loadingCard = [
	{
		title: 'Image with media viewer integration',
		content: (
			<div data-testid="media-card-loading-card">
				<Card
					identifier={identifiers[3]}
					mediaClientConfig={mediaClientConfig}
					appearance="image"
				/>
			</div>
		),
	},
];

const hiddenCardWithCacheAvailable = [
	{
		title: 'The is hidden from the viewport but local cache is available',
		content: (
			<div
				data-testid="media-card-hidden-card-with-cache"
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'absolute',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					right: token('space.negative.400', '-32px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					marginRight: token('space.negative.400', '-32px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: token('space.600', '48px'),
				}}
			>
				<DelayedRender
					timeout={2000}
					component={Card}
					componentProps={{
						identifier: identifiers[0],
						mediaClientConfig,
						appearance: 'image',
					}}
				/>
			</div>
		),
	},
];

const hiddenCardWithoutCacheAvailable = [
	{
		title: 'The is hidden from the viewport and NO local cache is available',
		content: (
			<div
				data-testid="media-card-hidden-card-without-cache"
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					position: 'absolute',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					right: token('space.negative.400', '-32px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					marginRight: token('space.negative.400', '-32px'),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					width: token('space.600', '48px'),
				}}
			>
				<Card identifier={freshNewFile} mediaClientConfig={mediaClientConfig} appearance="image" />
			</div>
		),
	},
];

export default () => (
	<MainWrapper developmentOnly>
		<div>
			<h1
				style={{
					margin: `${token('space.150', '12px')} ${token('space.250', '20px')}`,
				}}
			>
				File cards
			</h1>
			<div
				style={{
					margin: `${token('space.250', '20px')} ${token('space.500', '40px')}`,
				}}
			>
				<h3>Standard</h3>
				<StoryList>{standardCards}</StoryList>
				<StoryList>{cardWithContextId}</StoryList>
				<StoryList>{standardCardWithMediaViewer}</StoryList>
				<StoryList>{loadingCard}</StoryList>
				<StoryList>{hiddenCardWithoutCacheAvailable}</StoryList>
				<StoryList>{hiddenCardWithCacheAvailable}</StoryList>
			</div>
		</div>
	</MainWrapper>
);
