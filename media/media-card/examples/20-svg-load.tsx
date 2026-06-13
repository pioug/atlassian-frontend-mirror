import React, { useState } from 'react';
import {
	type ImageResizeMode,
	type FileIdentifier,
	type MediaClientConfig,
	isErrorFileState,
} from '@atlaskit/media-client';
import { Card } from '../src';
import { generateItemWithBinaries } from '@atlaskit/media-test-data';
import { MediaClientProvider, useFileState } from '@atlaskit/media-client-react';
import { svgFileIds } from '@atlaskit/media-client/test-helpers';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import { RadioGroup } from '@atlaskit/radio';
import Select from '@atlaskit/select';
import { Label } from '@atlaskit/form';
import { token } from '@atlaskit/tokens';
import { MainWrapper } from '../example-helpers';
import {
	ToggleBox,
	CardBox,
	CardRow,
	delayApiResponses,
	errorApiResponses,
} from '../example-helpers/svg-helpers';
import { useCreateMockedMediaClientProviderWithBinaries } from '../src/utils/__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProviderWithBinaries';

const dummyMediaClientConfig = {} as MediaClientConfig;

const resizeModes: ImageResizeMode[] = ['crop', 'fit', 'full-fit', 'stretchy-fit'];

const RenderCardBlock = ({
	identifier,
	identifiers,
	disableOverlay,
	backgroundColor,
}: {
	identifier: FileIdentifier;
	identifiers: FileIdentifier[];
	disableOverlay: boolean;
	backgroundColor?: string;
}) => {
	const { fileState } = useFileState(identifier.id, { collectionName: identifier.collectionName });
	const fileName = fileState && !isErrorFileState(fileState) ? fileState.name : 'Loading...';

	return (
		<>
			<h3>{fileName}</h3>
			<CardRow>
				{resizeModes.map((resizeMode) => (
					<CardBox key={`${identifier.id}-${resizeMode}`} title={resizeMode}>
						<Card
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							shouldOpenMediaViewer
							mediaViewerItems={identifiers}
							disableOverlay={disableOverlay}
							resizeMode={resizeMode}
							backgroundColor={backgroundColor}
						/>
					</CardBox>
				))}
			</CardRow>
		</>
	);
};

const Example = ({
	identifiers,
	disableOverlay,
	backgroundColor,
}: {
	identifiers: FileIdentifier[];
	disableOverlay: boolean;
	backgroundColor?: string;
}) => {
	return (
		<div>
			{identifiers.map((identifier, index) => (
				<RenderCardBlock
					key={`cardRow-${index}`}
					identifier={identifier}
					identifiers={identifiers}
					disableOverlay={disableOverlay}
					backgroundColor={backgroundColor}
				/>
			))}
		</div>
	);
};

const { svgAjDigitalCamera, svgCar, svgAtom, svgOpenWeb, failedProcessing, binaryCorrupted } =
	generateItemWithBinaries.svg;
const initialItems = [
	svgAjDigitalCamera(),
	svgCar(),
	svgAtom(),
	svgOpenWeb(),
	failedProcessing(),
	binaryCorrupted(),
];

const backgroundColorOptions = [
	{ label: 'Default (white)', value: '' },
	{ label: 'Transparent', value: 'transparent' },
	{ label: 'Neutral', value: token('color.background.neutral') },
	{ label: 'Dark (Bold)', value: token('color.background.neutral.bold') },
	{ label: 'Accent Blue', value: token('color.background.accent.blue.subtlest') },
];

const MockedProvider = ({
	delayedPreview,
	uploadingFile,
	binaryFetchError,
	imageFetchError,
	disableOverlay,
	backgroundColor,
}: {
	delayedPreview?: boolean;
	uploadingFile?: boolean;
	binaryFetchError: boolean;
	imageFetchError: boolean;
	disableOverlay: boolean;
	backgroundColor?: string;
}) => {
	const { MockedMediaClientProvider, mediaApi, uploadItem, identifiers, items } =
		useCreateMockedMediaClientProviderWithBinaries({ initialItems });

	if (identifiers.length === 0) {
		return <div>Preparing Media State</div>;
	}

	if (uploadingFile) {
		items.forEach((item) => {
			uploadItem(item, 0.5);
		});
	}

	if (binaryFetchError) {
		errorApiResponses.getFileBinary(mediaApi);
	}

	if (imageFetchError) {
		errorApiResponses.getFileImage(mediaApi);
	}

	if (delayedPreview) {
		// The preview takes longer than the metadata & binary
		delayApiResponses(mediaApi, { getImage: 4000, getItems: 1000, getFileBinary: 1000 });
	} else {
		// The metadata & binary take longer than the preview
		delayApiResponses(mediaApi, { getImage: 1000, getItems: 1000, getFileBinary: 1000 });
	}

	return (
		<MockedMediaClientProvider>
			<Example
				identifiers={identifiers}
				disableOverlay={disableOverlay}
				backgroundColor={backgroundColor}
			/>
		</MockedMediaClientProvider>
	);
};

const BackendProvider = ({
	disableOverlay,
	backgroundColor,
}: {
	disableOverlay: boolean;
	backgroundColor?: string;
}) => {
	const mediaClientConfig = createStorybookMediaClientConfig();
	const identifiers = Object.values(svgFileIds);

	return (
		<MediaClientProvider clientConfig={mediaClientConfig}>
			<Example
				identifiers={identifiers}
				disableOverlay={disableOverlay}
				backgroundColor={backgroundColor}
			/>
		</MediaClientProvider>
	);
};

export default function (): React.JSX.Element {
	const [reloadKey, setReloadkey] = useState(0);
	const [useMockedAPI, setUseMockedAPI] = useState(false);
	const [disableOverlay, setDisableOverlay] = useState(true);
	const [delayedPreview, setDelayedPreview] = useState(false);
	const [uploadingFile, setUploadingFile] = useState(false);
	const [binaryFetchError, setBinaryFetchError] = useState(false);
	const [imageFetchError, setImageFetchError] = useState(false);
	const [backgroundColor, setBackgroundColor] = useState<string | undefined>(undefined);
	return (
		<MainWrapper disableFeatureFlagWrapper>
			<ToggleBox label="Disable Overlay" isChecked={disableOverlay} onChange={setDisableOverlay} />
			<ToggleBox label="Use mocked api" isChecked={useMockedAPI} onChange={setUseMockedAPI} />
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop */}
			<div style={{ maxWidth: 300, marginBottom: 8 }}>
				<Label htmlFor="select-background-color">Background Color</Label>
				<Select
					inputId="select-background-color"
					classNamePrefix="react-select"
					defaultValue={backgroundColorOptions[0]}
					options={backgroundColorOptions}
					placeholder="Choose background color"
					onChange={(evt) => {
						setBackgroundColor(evt?.value || undefined);
					}}
				/>
			</div>
			{useMockedAPI && (
				<>
					<RadioGroup
						options={[
							{ name: 'delay-endppoints', value: 'false', label: 'Use delayed binary' },
							{ name: 'delay-endppoints', value: 'true', label: 'Use delayed preview' },
						]}
						defaultValue={'false'}
						onChange={(evt) => {
							const { value } = evt.target;
							setReloadkey(reloadKey + 1);
							setDelayedPreview(value === 'true');
						}}
						labelId="radiogroup-label"
					/>
					<ToggleBox
						label={'Binary fetch error'}
						isChecked={binaryFetchError}
						onChange={(v) => {
							setReloadkey(reloadKey + 1);
							setBinaryFetchError(v);
						}}
					/>
					<ToggleBox
						label={'Image fetch error'}
						isChecked={imageFetchError}
						onChange={(v) => {
							setReloadkey(reloadKey + 1);
							setImageFetchError(v);
						}}
					/>
					<ToggleBox
						label={'Uploading file'}
						isChecked={uploadingFile}
						onChange={(v) => {
							setReloadkey(reloadKey + 1);
							setUploadingFile(v);
						}}
					/>
					<Button
						appearance="primary"
						onClick={() => {
							setReloadkey(reloadKey + 1);
						}}
					>
						Reload
					</Button>
				</>
			)}

			<br />
			{useMockedAPI ? (
				<MockedProvider
					key={`${reloadKey}`}
					delayedPreview={delayedPreview}
					uploadingFile={uploadingFile}
					binaryFetchError={binaryFetchError}
					imageFetchError={imageFetchError}
					disableOverlay={disableOverlay}
					backgroundColor={backgroundColor}
				/>
			) : (
				<BackendProvider
					key={`${reloadKey}`}
					disableOverlay={disableOverlay}
					backgroundColor={backgroundColor}
				/>
			)}
		</MainWrapper>
	);
}
