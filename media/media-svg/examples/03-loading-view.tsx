import React, { Fragment, useEffect, useMemo, useState } from 'react';

import Button from '@atlaskit/button';
import { type FileIdentifier, type MediaApi } from '@atlaskit/media-client';
import {
	generateItemWithBinaries,
	type ItemWithBinariesGenerator,
} from '@atlaskit/media-test-data';
import Select from '@atlaskit/select';

import MediaSvg from '../src';
import { usePrepareMediaState } from '../src/media-svg/__tests__/utils/mockedMediaClientProvider/_usePrepareMediaState';

import { ControlsBox, DimensionsPicker, SvgContainer } from './helpers';

const generatorsWithKeys: Array<[string, ItemWithBinariesGenerator]> = [
	['car', generateItemWithBinaries.svg.svgCar],
	['OpenWeb', generateItemWithBinaries.svg.svgOpenWeb],
];
const generators = generatorsWithKeys.map(([, generator]) => generator);

function Resizable({ identifiers }: { identifiers: FileIdentifier[] }) {
	const [reloadKey, setReloadkey] = useState(0);
	const [containerWidth, setContainerWidth] = useState<string | undefined>();
	const [containerHeight, setContainerHeight] = useState<string | undefined>();
	const [imageWidth, setImageWidth] = useState<string | undefined>();
	const [imageHeight, setImageHeight] = useState<string | undefined>();
	const defaultOption = useMemo(
		() => ({ label: generatorsWithKeys[0][0], value: identifiers[0] }),
		[identifiers],
	);
	const [identifier, setIdentifier] = useState<FileIdentifier>(defaultOption.value);

	return (
		<Fragment>
			<ControlsBox>
				<DimensionsPicker
					onContainerWidth={setContainerWidth}
					onContainerHeight={setContainerHeight}
					onImageWidth={setImageWidth}
					onImageHeight={setImageHeight}
				/>
				<Select
					inputId="single-select-example"
					classNamePrefix="react-select"
					defaultValue={defaultOption}
					options={identifiers.map((identifier, index) => ({
						label: generatorsWithKeys[index][0],
						value: identifier,
					}))}
					placeholder="Choose a sample"
					onChange={(evt) => {
						evt?.value && setIdentifier(evt.value);
					}}
				/>
				<br />
				<Button
					appearance="primary"
					onClick={() => {
						setReloadkey(reloadKey + 1);
					}}
				>
					Reload
				</Button>
			</ControlsBox>
			<SvgContainer width={containerWidth} height={containerHeight}>
				<MediaSvg
					key={`${reloadKey}`}
					testId="media-svg"
					identifier={identifier}
					dimensions={{ width: imageWidth, height: imageHeight }}
				/>
			</SvgContainer>
		</Fragment>
	);
}

const delayBinaryLoad = (mediaApi: MediaApi, delay: number) => {
	const baseGetFileBinary = mediaApi.getFileBinary;
	mediaApi.getFileBinary = async (...args) => {
		await new Promise((resolve) => {
			setTimeout(resolve, delay);
		});
		return baseGetFileBinary(...args);
	};
};

export default function () {
	const [{ MockedMediaClientProvider, mediaApi }, identifiers] = usePrepareMediaState(generators);

	useEffect(() => {
		delayBinaryLoad(mediaApi, 3000);
	}, [mediaApi]);

	if (identifiers.length === 0) {
		return <div>Preparing Media State</div>;
	}

	return (
		<MockedMediaClientProvider>
			<Resizable identifiers={identifiers} />
		</MockedMediaClientProvider>
	);
}
