import React, { useState } from 'react';
import { Card } from '../src';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Flex, xcss } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';
import type { FileIdentifier, MediaClientConfig } from '@atlaskit/media-client';
import { generateItemWithBinaries } from '@atlaskit/media-test-data';
import { MainWrapper } from '../example-helpers';
import {
	I18NWrapper,
	createStorybookMediaClientConfig,
	createUploadMediaClientConfig,
	videoMp4SaganAliensId,
} from '@atlaskit/media-test-helpers';
import { useCreateMockedMediaProviderWithBinaries } from '../src/utils/__tests__/utils/mockedMediaClientProvider/_MockedMediaProviderWithBinaries';
import Button from '@atlaskit/button/new';
import { ToggleBox, errorApiResponses } from '../example-helpers/svg-helpers';
import { MediaProvider } from '@atlaskit/media-client-react';
import { fg } from '@atlaskit/platform-feature-flags';

const flexStyles = xcss({ marginBottom: 'space.300' });
const dummyMediaClientConfig = {} as MediaClientConfig;

const Example = ({ identifier }: { identifier: FileIdentifier }) => {
	return (
		identifier && (
			<Flex
				gap="space.300"
				alignItems="center"
				justifyContent="center"
				direction="column"
				xcss={flexStyles}
			>
				<Heading size="medium">Open Media Viewer</Heading>
				<Card
					mediaClientConfig={dummyMediaClientConfig}
					identifier={identifier}
					isLazy={false}
					shouldOpenMediaViewer
				/>
				<Card
					mediaClientConfig={dummyMediaClientConfig}
					dimensions={{ width: 650, height: 500 }}
					identifier={identifier}
					isLazy={false}
					useInlinePlayer
					disableOverlay
				/>
			</Flex>
		)
	);
};

const initialItems = [generateItemWithBinaries.workingVideo.videoCaptions()];

const MockedProvider = ({
	fetchError,
	uploadError,
	deleteError,
	canUpdateVideoCaptions,
}: {
	fetchError: boolean;
	uploadError: boolean;
	deleteError: boolean;
	canUpdateVideoCaptions: boolean;
}) => {
	const { MockedMediaProvider, identifiers, mediaApi } = useCreateMockedMediaProviderWithBinaries({
		initialItems,
		mediaSettings: { canUpdateVideoCaptions },
	});

	if (identifiers.length === 0) {
		return <div>Preparing Media State</div>;
	}

	if (fetchError) {
		errorApiResponses.getArtifactBinary(mediaApi);
	}

	if (uploadError) {
		errorApiResponses.uploadArtifact(mediaApi);
	}

	if (deleteError) {
		errorApiResponses.deleteArtifact(mediaApi);
	}

	return (
		<MockedMediaProvider>
			<Example identifier={identifiers[0]} />
		</MockedMediaProvider>
	);
};

const identifiers: FileIdentifier[] = [videoMp4SaganAliensId];

const BackendProvider = ({ canUpdateVideoCaptions }: { canUpdateVideoCaptions: boolean }) => {
	const mediaClientConfig = canUpdateVideoCaptions
		? createUploadMediaClientConfig()
		: createStorybookMediaClientConfig();

	return (
		<MediaProvider mediaClientConfig={mediaClientConfig} mediaSettings={{ canUpdateVideoCaptions }}>
			<Example identifier={identifiers[0]} />
		</MediaProvider>
	);
};

export default function (): React.JSX.Element {
	const [reloadKey, setReloadkey] = useState(0);
	const [useMockedAPI, setUseMockedAPI] = useState(false);
	const [canUpdateVideoCaptions, setCanUpdateVideoCaptions] = useState(true);
	const [fetchError, setFetchError] = useState(false);
	const [uploadError, setUploadError] = useState(false);
	const [deleteError, setDeleteError] = useState(false);

	if (!fg('platform_media_video_captions')) {
		return (
			<MainWrapper disableFeatureFlagWrapper developmentOnly>
				<Heading size="medium">Please, enable platform_media_video_captions feature flag</Heading>
			</MainWrapper>
		);
	}
	return (
		<MainWrapper disableFeatureFlagWrapper developmentOnly>
			<I18NWrapper initialLocale={'es'}>
				<ToggleBox
					label="Can update video captions"
					isChecked={canUpdateVideoCaptions}
					onChange={setCanUpdateVideoCaptions}
				/>
				<ToggleBox label="Use mocked api" isChecked={useMockedAPI} onChange={setUseMockedAPI} />
				{useMockedAPI && (
					<>
						<ToggleBox
							label={'Fetch error'}
							isChecked={fetchError}
							onChange={(v) => {
								setReloadkey(reloadKey + 1);
								setFetchError(v);
							}}
						/>
						<ToggleBox
							label={'Upload error'}
							isChecked={uploadError}
							onChange={(v) => {
								setReloadkey(reloadKey + 1);
								setUploadError(v);
							}}
						/>
						<ToggleBox
							label={'Delete error'}
							isChecked={deleteError}
							onChange={(v) => {
								setReloadkey(reloadKey + 1);
								setDeleteError(v);
							}}
						/>
						<Button onClick={() => setReloadkey(reloadKey + 1)}>Reload</Button>
					</>
				)}
				<br />
				{useMockedAPI ? (
					<MockedProvider
						key={`${reloadKey}`}
						canUpdateVideoCaptions={canUpdateVideoCaptions}
						fetchError={fetchError}
						uploadError={uploadError}
						deleteError={deleteError}
					/>
				) : (
					<BackendProvider key={`${reloadKey}`} canUpdateVideoCaptions={canUpdateVideoCaptions} />
				)}
			</I18NWrapper>
			<br />
		</MainWrapper>
	);
}
