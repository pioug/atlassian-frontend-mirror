import React, { useState } from 'react';
import { type FileIdentifier, type MediaClientConfig } from '@atlaskit/media-client';
import { MediaViewer } from '../src';
import { usePrepareMediaState } from '../src/__tests__/unit/newgen/utils/mockedMediaClientProvider/_usePrepareMediaState';
import {
	generateItemWithBinaries,
	type ItemWithBinariesGenerator,
} from '@atlaskit/media-test-data';
import Select from '@atlaskit/select';
import Button from '@atlaskit/button';
import { CenteredForm } from '../example-helpers/centeredForm';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';
import { svgFileIds } from '@atlaskit/media-client/test-helpers';
import { MediaClientProvider } from '@atlaskit/media-client-react';
import { ToggleBox, useSelectOptions, delayApiResponses } from '../example-helpers/svg';

const dummyMediaClientConfig = {} as MediaClientConfig;

const Example = ({
	identifiers,
	fileKeys,
}: {
	identifiers: FileIdentifier[];
	fileKeys: string[];
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const { options, defaultOption, identifier, setIdentifier } = useSelectOptions(
		identifiers,
		fileKeys,
	);

	return (
		<>
			<Select
				inputId="single-select-example"
				classNamePrefix="react-select"
				defaultValue={defaultOption}
				options={options}
				placeholder="Choose a sample"
				onChange={(evt) => {
					evt?.value && setIdentifier(evt.value);
				}}
			/>
			<br />
			<Button onClick={() => setIsOpen(true)} appearance="primary">
				Open Media Viewer
			</Button>
			{isOpen && (
				<MediaViewer
					mediaClientConfig={dummyMediaClientConfig}
					selectedItem={identifier}
					items={identifiers}
					collectionName={''}
					onClose={() => setIsOpen(false)}
				/>
			)}
		</>
	);
};

const MockedProvider = () => {
	const { svgCar, svgOpenWeb, svgAjDigitalCamera, svgAtom } = generateItemWithBinaries.svg;
	const fileKeys = ['AjDigitalCamera', 'car', 'Atom', 'OpenWeb'];
	const generators: Array<ItemWithBinariesGenerator> = [
		svgAjDigitalCamera,
		svgCar,
		svgAtom,
		svgOpenWeb,
	];
	const [{ MockedMediaClientProvider, mediaApi }, identifiers] = usePrepareMediaState(generators);

	if (identifiers.length === 0) {
		return <div>Preparing Media State</div>;
	}

	delayApiResponses(mediaApi, { getItems: 2000, getFileBinary: 2000 });

	return (
		<MockedMediaClientProvider>
			<Example identifiers={identifiers} fileKeys={fileKeys} />
		</MockedMediaClientProvider>
	);
};

const BackendProvider = () => {
	const mediaClientConfig = createStorybookMediaClientConfig();
	const identifiers = Object.values(svgFileIds);
	const fileKeys = Object.keys(svgFileIds);

	return (
		<MediaClientProvider clientConfig={mediaClientConfig}>
			<Example identifiers={identifiers} fileKeys={fileKeys} />
		</MediaClientProvider>
	);
};

export default function () {
	const [reloadKey, setReloadkey] = useState(0);
	const [useMockedAPI, setUseMockedAPI] = useState(false);

	return (
		<CenteredForm>
			<ToggleBox
				label="Use mocked api"
				isChecked={useMockedAPI}
				onChange={(v) => {
					setReloadkey(reloadKey + 1);
					setUseMockedAPI(v);
				}}
				centered
			/>
			<br />
			{useMockedAPI ? (
				<MockedProvider key={`${reloadKey}`} />
			) : (
				<BackendProvider key={`${reloadKey}`} />
			)}
		</CenteredForm>
	);
}
