import React, { useState } from 'react';
import { Card } from '../src';
import { Box, Flex, xcss } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';
import type { FileIdentifier, MediaClientConfig } from '@atlaskit/media-client';
import { generateItemWithBinaries } from '@atlaskit/media-test-data';
import type { Identifier } from '@atlaskit/media-client';
import { MainWrapper } from '../example-helpers';
import { useCreateMockedMediaProviderWithBinaries } from '../src/utils/__tests__/utils/mockedMediaClientProvider/_MockedMediaProviderWithBinaries';
import { useCreateMockedMediaClientProviderWithBinaries } from '../src/utils/__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProviderWithBinaries';
import { ToggleBox } from '../example-helpers/svg-helpers';
import { fg } from '@atlaskit/platform-feature-flags';

const flexStyles = xcss({ marginBottom: 'space.300' });
const dummyMediaClientConfig = {} as MediaClientConfig;

export const getVideoBreakpoints = () =>
	fg('platform_media_video_captions')
		? {
				small: 260,
				medium: 430,
				large: 570,
			}
		: {
				small: 160,
				medium: 400,
			};

const calculateHeight = (width: number) => Math.round((width * 308) / 400);

const getSizeName = (
	videoBreakpoints: { small: number; medium: number; large?: number },
	width: number,
) =>
	width > (videoBreakpoints.large ?? Infinity)
		? 'X Large'
		: width > videoBreakpoints.medium
			? 'Large'
			: width > videoBreakpoints.small
				? 'Medium'
				: 'Small';

const generateBlock = () => {
	const videoBreakpoints = getVideoBreakpoints();
	return Object.values(videoBreakpoints).map((breakpointWidth) => {
		const sizeName = getSizeName(videoBreakpoints, breakpointWidth);
		const nextBreakpointWidth = breakpointWidth + 1;
		const nextSizeName = getSizeName(videoBreakpoints, nextBreakpointWidth);
		return [
			{
				title: `${sizeName} (top)`,
				width: breakpointWidth,
				height: calculateHeight(breakpointWidth),
			},
			{
				title: `${nextSizeName} (bottom)`,
				width: nextBreakpointWidth,
				height: calculateHeight(nextBreakpointWidth),
			},
		];
	});
};

const block = generateBlock();

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
			<Flex gap="space.300" alignItems="center" justifyContent="center" direction="column">
				{block.map((items) => (
					<Flex gap="space.300" alignItems="end" justifyContent="center" xcss={flexStyles}>
						{items.map(({ title, width, height }) => (
							<RenderInlinePlayer
								key={title}
								identifier={identifier}
								name={title}
								dimensions={{ width, height }}
							/>
						))}
					</Flex>
				))}
			</Flex>
		)
	);
};

const videoItemWithCaptions = generateItemWithBinaries.workingVideo.videoCaptions();
const videoItemWithoutCaptions = generateItemWithBinaries.workingVideo.videoFire();

const MockedProvider = ({
	canUpdateVideoCaptions,
	videoHasCaptions,
	isVideoUploading,
}: {
	canUpdateVideoCaptions: boolean;
	videoHasCaptions: boolean;
	isVideoUploading: boolean;
}) => {
	const initialItem = videoHasCaptions ? videoItemWithCaptions : videoItemWithoutCaptions;
	const { MockedMediaProvider, identifiers, uploadItem, items } =
		useCreateMockedMediaProviderWithBinaries({
			initialItems: initialItem,
			mediaSettings: { canUpdateVideoCaptions },
		});

	if (identifiers.length === 0) {
		return <div>Preparing Media State</div>;
	}

	if (isVideoUploading) {
		uploadItem(items[0], 0.5);
	}

	return (
		<MockedMediaProvider>
			<Example identifiers={identifiers} />
		</MockedMediaProvider>
	);
};

const MockedClientProvider = () => {
	const { MockedMediaClientProvider, identifiers } = useCreateMockedMediaClientProviderWithBinaries(
		{
			initialItems: videoItemWithoutCaptions,
		},
	);

	if (identifiers.length === 0) {
		return <div>Preparing Media State</div>;
	}

	return (
		<MockedMediaClientProvider>
			<Example identifiers={identifiers} />
		</MockedMediaClientProvider>
	);
};

export default function () {
	const [reloadKey, setReloadkey] = useState(0);
	const [canUpdateVideoCaptions, setCanUpdateVideoCaptions] = useState(true);
	const [videoHasCaptions, setVideoHasCaptions] = useState(true);
	const [isVideoUploading, setIsVideoUploading] = useState(false);
	return (
		<MainWrapper disableFeatureFlagWrapper developmentOnly>
			{fg('platform_media_video_captions') ? (
				<>
					<ToggleBox
						label="Is video uploading"
						isChecked={isVideoUploading}
						onChange={(v) => {
							setReloadkey(reloadKey + 1);
							setIsVideoUploading(v);
						}}
					/>
					<ToggleBox
						label="Video has captions"
						isChecked={videoHasCaptions}
						onChange={setVideoHasCaptions}
					/>
					{
						<ToggleBox
							label="Can update video captions"
							isChecked={canUpdateVideoCaptions}
							onChange={setCanUpdateVideoCaptions}
						/>
					}
					<MockedProvider
						key={`${reloadKey}`}
						canUpdateVideoCaptions={canUpdateVideoCaptions}
						videoHasCaptions={videoHasCaptions}
						isVideoUploading={isVideoUploading}
					/>
				</>
			) : (
				<MockedClientProvider />
			)}
		</MainWrapper>
	);
}
