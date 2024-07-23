/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import { jsx } from '@compiled/react';

import { Label } from '@atlaskit/form';
import { type FileIdentifier } from '@atlaskit/media-client';
import { MediaClientProvider } from '@atlaskit/media-client-react';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers';
import Select from '@atlaskit/select';

import MediaSvg from '../src';

import { ControlsBox, DimensionsPicker, SvgContainer } from './helpers';

const mediaClientConfig = createStorybookMediaClientConfig();

const collectionName = 'MediaServicesSample';

const identifiers = Object.entries({
	ajDigitalCamera: '10d7388f-db45-4d01-b6cf-801f7242655e',
	car: 'd4fb1cef-d845-42d4-beca-7b185966f4d6',
	atom: 'c03470af-ab26-4660-96fd-362193d676e0',
	openweb: '0bdf18bd-458e-4aeb-9484-b525de5658a1',
}).map<[string, FileIdentifier]>(([key, id]) => [
	key,
	{
		mediaItemType: 'file' as const,
		id: id,
		collectionName,
	},
]);

const defaultOption = { label: identifiers[0][0], value: identifiers[0][1] };

const onError = (error: Error) => {
	console.log(error);
};

function Resizable() {
	const [containerWidth, setContainerWidth] = useState<string | undefined>();
	const [containerHeight, setContainerHeight] = useState<string | undefined>();
	const [imageWidth, setImageWidth] = useState<string | undefined>();
	const [imageHeight, setImageHeight] = useState<string | undefined>();
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
				<Label htmlFor="single-select-example">Pick a sample</Label>
				<Select
					inputId="single-select-example"
					classNamePrefix="react-select"
					defaultValue={defaultOption}
					options={identifiers.map(([key, identifier]) => ({
						label: key,
						value: identifier,
					}))}
					placeholder="Choose a sample"
					onChange={(evt) => {
						evt?.value && setIdentifier(evt.value);
					}}
				/>
			</ControlsBox>
			<SvgContainer width={containerWidth} height={containerHeight}>
				<MediaSvg
					testId="media-svg"
					identifier={identifier}
					dimensions={{ width: imageWidth, height: imageHeight }}
					onError={onError}
				/>
			</SvgContainer>
		</Fragment>
	);
}

export default function () {
	return (
		<MediaClientProvider clientConfig={mediaClientConfig}>
			<Resizable />
		</MediaClientProvider>
	);
}
