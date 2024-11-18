import React, { useState } from 'react';
import {
	type ImageResizeMode,
	type FileIdentifier,
	type MediaClientConfig,
} from '@atlaskit/media-client';
import { Card } from '../src';
import { usePrepareMediaState } from '../src/__tests__/utils/mockedMediaClientProvider/_usePrepareMediaState';
import { generateItemWithBinaries } from '@atlaskit/media-test-data';
import { MediaClientProvider } from '@atlaskit/media-client-react';
import { svgFileIds } from '@atlaskit/media-client/test-helpers';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';
import { RadioGroup } from '@atlaskit/radio';
import { MainWrapper } from '../example-helpers';
import {
	ToggleBox,
	CardBox,
	CardRow,
	delayApiResponses,
	errorApiResponses,
} from '../example-helpers/svg-helpers';

const dummyMediaClientConfig = {} as MediaClientConfig;

const resizeModes: ImageResizeMode[] = ['crop', 'fit', 'full-fit', 'stretchy-fit'];

const RenderCardBlock = ({
	identifier,
	identifiers,
	disableOverlay,
}: {
	identifier: FileIdentifier;
	identifiers: FileIdentifier[];
	disableOverlay: boolean;
}) => {
	return (
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
					/>
				</CardBox>
			))}
		</CardRow>
	);
};

const Example = ({
	identifiers,
	disableOverlay,
}: {
	identifiers: FileIdentifier[];
	disableOverlay: boolean;
}) => {
	return (
		<div>
			{identifiers.map((identifier, index) => (
				<RenderCardBlock
					key={`cardRow-${index}`}
					identifier={identifier}
					identifiers={identifiers}
					disableOverlay={disableOverlay}
				/>
			))}
		</div>
	);
};

const { svgAjDigitalCamera, svgCar, svgAtom, svgOpenWeb, failedProcessing, binaryCorrupted } =
	generateItemWithBinaries.svg;
const generators = [
	svgAjDigitalCamera,
	svgCar,
	svgAtom,
	svgOpenWeb,
	failedProcessing,
	binaryCorrupted,
];

const MockedProvider = ({
	delayedPreview,
	uploadingFile,
	binaryFetchError,
	imageFetchError,
	disableOverlay,
}: {
	delayedPreview?: boolean;
	uploadingFile?: boolean;
	binaryFetchError: boolean;
	imageFetchError: boolean;
	disableOverlay: boolean;
}) => {
	const [{ MockedMediaClientProvider, mediaApi, uploadItem }, identifiers, itemsWithBinaries] =
		usePrepareMediaState(generators);

	if (identifiers.length === 0) {
		return <div>Preparing Media State</div>;
	}

	if (uploadingFile) {
		itemsWithBinaries.forEach((item) => {
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
			<Example identifiers={identifiers} disableOverlay={disableOverlay} />
		</MockedMediaClientProvider>
	);
};

const BackendProvider = ({ disableOverlay }: { disableOverlay: boolean }) => {
	const mediaClientConfig = createStorybookMediaClientConfig();
	const identifiers = Object.values(svgFileIds);

	return (
		<MediaClientProvider clientConfig={mediaClientConfig}>
			<Example identifiers={identifiers} disableOverlay={disableOverlay} />
		</MediaClientProvider>
	);
};

export default function () {
	const [reloadKey, setReloadkey] = useState(0);
	const [useMockedAPI, setUseMockedAPI] = useState(false);
	const [disableOverlay, setDisableOverlay] = useState(true);
	const [delayedPreview, setDelayedPreview] = useState(false);
	const [uploadingFile, setUploadingFile] = useState(false);
	const [binaryFetchError, setBinaryFetchError] = useState(false);
	const [imageFetchError, setImageFetchError] = useState(false);
	return (
		<MainWrapper disableFeatureFlagWrapper>
			<ToggleBox label="Disable Overlay" isChecked={disableOverlay} onChange={setDisableOverlay} />
			<ToggleBox label="Use mocked api" isChecked={useMockedAPI} onChange={setUseMockedAPI} />
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
						aria-labelledby="radiogroup-label"
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
				/>
			) : (
				<BackendProvider key={`${reloadKey}`} disableOverlay={disableOverlay} />
			)}
		</MainWrapper>
	);
}
