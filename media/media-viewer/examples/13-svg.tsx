import React, { useState, useMemo } from 'react';
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

const dummyMediaClientConfig = {} as MediaClientConfig;

const { svgCar, svgOpenWeb, svgAjDigitalCamera, svgAtom } = generateItemWithBinaries.svg;
const generatorsWithKeys: Array<[string, ItemWithBinariesGenerator]> = [
	['car', svgCar],
	['OpenWeb', svgOpenWeb],
	['AjDigitalCamera', svgAjDigitalCamera],
	['Atom', svgAtom],
];

const useSelectOptions = (identifiers: FileIdentifier[]) => {
	const defaultOption = useMemo(
		() => ({ label: generatorsWithKeys[0][0], value: identifiers[0] }),
		[identifiers],
	);

	const options = useMemo(
		() =>
			identifiers.map((identifier, index) => ({
				label: generatorsWithKeys[index][0],
				value: identifier,
			})),
		[identifiers],
	);
	const [identifier, setIdentifier] = useState<FileIdentifier>(defaultOption.value);

	return { options, defaultOption, identifier, setIdentifier };
};

const Example = ({ identifiers }: { identifiers: FileIdentifier[] }) => {
	const { options, defaultOption, identifier, setIdentifier } = useSelectOptions(identifiers);
	const [isOpen, setIsOpen] = useState(true);

	return (
		<CenteredForm>
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
		</CenteredForm>
	);
};

const generators = generatorsWithKeys.map(([, generator]) => generator);

export default function () {
	const [{ MockedMediaClientProvider }, identifiers] = usePrepareMediaState(generators);

	if (identifiers.length === 0) {
		return <div>Preparing Media State</div>;
	}

	return (
		<MockedMediaClientProvider>
			<Example identifiers={identifiers} />
		</MockedMediaClientProvider>
	);
}
