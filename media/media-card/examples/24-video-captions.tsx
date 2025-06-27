import React, { useState } from 'react';
import { Card } from '../src';
import { Box, Flex, xcss } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';
import type { FileIdentifier, MediaClientConfig } from '@atlaskit/media-client';
import { generateItemWithBinaries } from '@atlaskit/media-test-data';
import type { Identifier } from '@atlaskit/media-client';
import { MainWrapper } from '../example-helpers';
import {
	I18NWrapper,
	createStorybookMediaClientConfig,
	createUploadMediaClientConfig,
	videoMp4SaganAliensId,
} from '@atlaskit/media-test-helpers';
import { useCreateMockedMediaProviderWithBinaries } from '../src/utils/__tests__/utils/mockedMediaClientProvider/_MockedMediaProviderWithBinaries';
import Button from '@atlaskit/button/new';
import { ToggleBox } from '../example-helpers/svg-helpers';
import { MediaProvider } from '@atlaskit/media-client-react';
import { fg } from '@atlaskit/platform-feature-flags';

const flexStyles = xcss({ marginBottom: 'space.300' });
const dummyMediaClientConfig = {} as MediaClientConfig;

const inline = [
	{ name: 'Inline Player Nano', dimensions: { width: 90, height: 69 } },
	{ name: 'Inline Player Micro', dimensions: { width: 150, height: 115 } },
	{ name: 'Inline Player Small', dimensions: { width: 250, height: 192 } },
	{ name: 'Inline Player Medium', dimensions: { width: 400, height: 308 } },
];

const block = [
	{ name: 'Inline Player Large', dimensions: { width: 650, height: 500 } },
	{ name: 'Inline Player X Large', dimensions: { width: 1000, height: 769 } },
];

const RenderInlinePlayer = ({
	identifier,
	name,
	dimensions,
}: {
	identifier: Identifier;
	name: string;
	dimensions: { width: number; height: number };
}) => {
	return (
		<Box>
			<Heading size="medium">{name}</Heading>
			<Card
				mediaClientConfig={dummyMediaClientConfig}
				dimensions={dimensions}
				identifier={identifier}
				isLazy={false}
				useInlinePlayer
				disableOverlay
			/>
		</Box>
	);
};

const Example = ({ identifiers }: { identifiers: FileIdentifier[] }) => {
	const [identifier] = identifiers;

	return (
		identifier && (
			<>
				<Flex gap="space.300" alignItems="end" justifyContent="center" xcss={flexStyles}>
					<Box>
						<Heading size="medium">Open Media Viewer</Heading>
						<Card
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							shouldOpenMediaViewer
						/>
					</Box>
					{inline.map(({ name, dimensions }) => (
						<RenderInlinePlayer
							key={name}
							identifier={identifier}
							name={name}
							dimensions={dimensions}
						/>
					))}
				</Flex>
				<Flex gap="space.300" alignItems="center" justifyContent="center" direction="column">
					{block.map(({ name, dimensions }) => (
						<RenderInlinePlayer
							key={name}
							identifier={identifier}
							name={name}
							dimensions={dimensions}
						/>
					))}
				</Flex>
			</>
		)
	);
};

const initialItems = [generateItemWithBinaries.workingVideo.videoCaptions()];

const MockedProvider = () => {
	const { MockedMediaProvider, identifiers } = useCreateMockedMediaProviderWithBinaries({
		initialItems,
	});

	if (identifiers.length === 0) {
		return <div>Preparing Media State</div>;
	}

	return (
		<MockedMediaProvider>
			<Example identifiers={identifiers} />
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
			<Example identifiers={identifiers} />
		</MediaProvider>
	);
};

export default function () {
	const [reloadKey, setReloadkey] = useState(0);
	const [useMockedAPI, setUseMockedAPI] = useState(false);
	const [canUpdateVideoCaptions, setCanUpdateVideoCaptions] = useState(true);

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
				<ToggleBox label="Use mocked api" isChecked={useMockedAPI} onChange={setUseMockedAPI} />
				<ToggleBox
					label="Can update video captions"
					isChecked={canUpdateVideoCaptions}
					onChange={setCanUpdateVideoCaptions}
				/>
				{useMockedAPI && <Button onClick={() => setReloadkey(reloadKey + 1)}>Reload</Button>}
				<br />
				{useMockedAPI ? (
					<MockedProvider key={`${reloadKey}`} />
				) : (
					<BackendProvider key={`${reloadKey}`} canUpdateVideoCaptions={canUpdateVideoCaptions} />
				)}
			</I18NWrapper>
			<br />
		</MainWrapper>
	);
}
