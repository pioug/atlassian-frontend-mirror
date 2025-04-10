/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import { jsx } from '@compiled/react';

import { Label } from '@atlaskit/form';
import {
	type MediaClientConfig,
	type FileIdentifier,
	type ImageResizeMode,
} from '@atlaskit/media-client';

import { MediaClientProvider } from '@atlaskit/media-client-react';
import {
	createStorybookMediaClientConfig,
	genericFileId,
	largeImageFileId,
} from '@atlaskit/media-test-helpers';
import Select from '@atlaskit/select';

import { Card } from '../src';

import { ControlsBox, DimensionsPicker, SvgContainer } from '../example-helpers/svg-helpers';

const dummyMediaClientConfig = {} as MediaClientConfig;
const mediaClientConfig = createStorybookMediaClientConfig();

const identifiers = Object.entries({
	genericFile: genericFileId,
	largeImageFile: largeImageFileId,
});

const resizeModeList: ImageResizeMode[] = ['crop', 'fit', 'full-fit', 'stretchy-fit'];
const resizeModeOptions = resizeModeList.map((mode) => ({
	label: mode,
	value: mode,
}));

const defaultOption = { label: identifiers[0][0], value: identifiers[0][1] };

function Resizable() {
	const [containerWidth, setContainerWidth] = useState<string | undefined>();
	const [containerHeight, setContainerHeight] = useState<string | undefined>();
	const [imageWidth, setImageWidth] = useState<string | undefined>();
	const [imageHeight, setImageHeight] = useState<string | undefined>();
	const [identifier, setIdentifier] = useState<FileIdentifier>(defaultOption.value);
	const [resizeMode, setResizeMode] = useState<ImageResizeMode>(resizeModeOptions[0].value);

	return (
		<Fragment>
			<ControlsBox>
				<DimensionsPicker
					onContainerWidth={setContainerWidth}
					onContainerHeight={setContainerHeight}
					onImageWidth={setImageWidth}
					onImageHeight={setImageHeight}
				/>
				<Label htmlFor="select-resize-mode">Resize Mode</Label>
				<Select
					inputId="select-resize-mode"
					classNamePrefix="react-select"
					defaultValue={resizeModeOptions[0]}
					options={resizeModeOptions}
					placeholder="Choose a sample"
					onChange={(evt) => {
						evt?.value && setResizeMode(evt.value);
					}}
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
				<Card
					key={resizeMode}
					mediaClientConfig={dummyMediaClientConfig}
					testId="media-svg"
					identifier={identifier}
					dimensions={{ width: imageWidth, height: imageHeight }}
					disableOverlay
					shouldOpenMediaViewer
					resizeMode={resizeMode}
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
