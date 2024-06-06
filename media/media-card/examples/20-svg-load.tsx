import React, { useState } from 'react';
import { type FileIdentifier, type MediaClientConfig } from '@atlaskit/media-client';
import { Card } from '../src';
import { usePrepareMediaState } from '../src/__tests__/utils/mockedMediaClientProvider/_usePrepareMediaState';
import { generateItemWithBinaries } from '@atlaskit/media-test-data';
import { MediaClientProvider } from '@atlaskit/media-client-react';
import { svgFileIds } from '@atlaskit/media-client/test-helpers';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';
import Button from '@atlaskit/button';

import { MainWrapper } from '../example-helpers';
import { ToggleBox, CardBox, CardRow, delayApiResponses } from '../example-helpers/svg-helpers';

const dummyMediaClientConfig = {} as MediaClientConfig;

const Example = ({ identifiers }: { identifiers: FileIdentifier[] }) => {
	return (
		<div>
			{identifiers.map((identifier) => (
				<CardRow>
					<CardBox title="crop">
						<Card
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							shouldOpenMediaViewer
							mediaViewerItems={identifiers}
							disableOverlay
							resizeMode="crop"
						/>
					</CardBox>
					<CardBox title="fit">
						<Card
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							shouldOpenMediaViewer
							mediaViewerItems={identifiers}
							disableOverlay
							resizeMode="fit"
						/>
					</CardBox>
					<CardBox title="full-fit">
						<Card
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							shouldOpenMediaViewer
							mediaViewerItems={identifiers}
							disableOverlay
							resizeMode="full-fit"
						/>
					</CardBox>
					<CardBox title="stretchy-fit">
						<Card
							mediaClientConfig={dummyMediaClientConfig}
							identifier={identifier}
							isLazy={false}
							shouldOpenMediaViewer
							mediaViewerItems={identifiers}
							disableOverlay
							resizeMode="stretchy-fit"
						/>
					</CardBox>
				</CardRow>
			))}
		</div>
	);
};

const { svgAjDigitalCamera, svgCar, svgAtom, svgOpenWeb } = generateItemWithBinaries.svg;
const generators = [svgAjDigitalCamera, svgCar, svgAtom, svgOpenWeb];

const MockedProvider = ({
	delayedPreview,
	uploadingFile,
}: {
	delayedPreview?: boolean;
	uploadingFile?: boolean;
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

	if (delayedPreview) {
		// The preview takes longer than the metadata & binary
		delayApiResponses(mediaApi, { getImage: 4000, getItems: 1000, getFileBinary: 1000 });
	} else {
		// The metadata & binary take longer than the preview
		delayApiResponses(mediaApi, { getImage: 1000, getItems: 1000, getFileBinary: 1000 });
	}

	return (
		<MockedMediaClientProvider>
			<Example identifiers={identifiers} />
		</MockedMediaClientProvider>
	);
};

const BackendProvider = () => {
	const mediaClientConfig = createStorybookMediaClientConfig();
	const identifiers = Object.values(svgFileIds);

	return (
		<MediaClientProvider clientConfig={mediaClientConfig}>
			<Example identifiers={identifiers} />
		</MediaClientProvider>
	);
};

export default function () {
	const [reloadKey, setReloadkey] = useState(0);
	const [useMockedAPI, setUseMockedAPI] = useState(false);
	const [delayedPreview, setDelayedPreview] = useState(false);
	const [uploadingFile, setUploadingFile] = useState(false);
	return (
		<MainWrapper disableFeatureFlagWrapper>
			<ToggleBox label="Use mocked api" isChecked={useMockedAPI} onChange={setUseMockedAPI} />
			{useMockedAPI && (
				<>
					<ToggleBox
						label={delayedPreview ? 'Use delayed Preview' : 'Use delayed binary'}
						isChecked={delayedPreview}
						onChange={(v) => {
							setReloadkey(reloadKey + 1);
							setDelayedPreview(v);
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
				/>
			) : (
				<BackendProvider key={`${reloadKey}`} />
			)}
		</MainWrapper>
	);
}
