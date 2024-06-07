/**@jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/react';

import { MediaClientProvider } from '@atlaskit/media-client-react';
import {
	createStorybookMediaClientConfig,
	errorFileId,
	genericFileId,
	imageFileId,
} from '@atlaskit/media-test-helpers';
import Spinner from '@atlaskit/spinner';

import { TerminalTextDisplay } from '../example-helpers/TerminalTextDisplay';
import type { MediaFilePreviewStatus } from '../src/types';
import { useMediaImage, type UseMediaImageParams } from '../src/useMediaImage';

export type MediaImageId = {
	label: string;
	value: any;
};

export interface ExampleState {
	imageId: MediaImageId;
	width: number;
	height: number;
}

const mediaClientConfig = createStorybookMediaClientConfig();

const ImageComponent = ({
	mediaImageInput,
	onLoadResults,
}: {
	mediaImageInput: UseMediaImageParams;
	onLoadResults?: string;
}) => {
	const { status, getImgProps, getSsrScriptProps } = useMediaImage(mediaImageInput);

	const renderImage = (status: MediaFilePreviewStatus) => {
		switch (status) {
			case 'error':
				return (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					<div style={{ width: 500, height: 500, margin: '5px' }}>
						<h2>There is an error while rendering the image</h2>
					</div>
				);
			case 'complete':
				return (
					<img
						{...getImgProps()}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						style={{ width: 500, height: 500, margin: '5px' }}
					/>
				);
			default:
				return <Spinner size={500} />;
		}
	};
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		<div style={{ borderBottom: '5px solid black' }}>
			{getSsrScriptProps && (
				<span>
					<h1>
						With SSR: <pre>{mediaImageInput.ssr}</pre>
					</h1>
					<script {...getSsrScriptProps} />
				</span>
			)}
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ display: 'flex', margin: '10px 0' }}>
				{renderImage(status)}
				<TerminalTextDisplay>
					<pre>Status: {status}</pre>
					<pre>src: {`${getImgProps().src}`}</pre>
					<pre>OnLoad Result: {onLoadResults}</pre>
				</TerminalTextDisplay>
			</div>
		</div>
	);
};

const Example = () => {
	/* Image Inputs */

	const useMediaImageInputs: UseMediaImageParams[] = [
		{
			identifier: genericFileId,
			onLoad: () => {
				handleImageLoad(`0-${genericFileId.id}`);
			},
		},
		{
			identifier: errorFileId,
			onLoad: () => {
				handleImageLoad(`1-${errorFileId.id}`);
			},
		},
		{
			identifier: imageFileId,
			onLoad: () => {
				handleImageLoad(`2-${imageFileId.id}`);
			},
			ssr: 'server',
		},
	];

	/* States */

	const initialImageState = new Map<string, { onLoadResults: string }>(
		useMediaImageInputs.map((input, index) => [
			`${index}-${input.identifier.id}`,
			{ onLoadResults: 'N/A' },
		]),
	);

	const [imageState, setImageState] = useState(initialImageState);

	/* Helper Functions */

	const handleImageLoad = (id: string) => {
		const newImageState = new Map(imageState);
		newImageState.set(id, {
			onLoadResults: 'Successfully load an image',
		});
		setImageState(newImageState);
	};

	/* Render */

	return (
		<MediaClientProvider clientConfig={mediaClientConfig}>
			{useMediaImageInputs.map((input, index) => {
				const results = imageState.get(`${index}-${input.identifier.id}`);
				return <ImageComponent mediaImageInput={input} onLoadResults={results?.onLoadResults} />;
			})}
		</MediaClientProvider>
	);
};

export default () => <Example />;
