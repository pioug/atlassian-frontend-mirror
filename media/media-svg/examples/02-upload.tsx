/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import { jsx } from '@compiled/react';

import { Label } from '@atlaskit/form';
import { MediaClientProvider } from '@atlaskit/media-client-react';
import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';

import MediaSvg from '../src';

import { ControlsBox, DimensionsPicker, SvgContainer, useSvgUploader } from './helpers';

const mediaClientConfig = createUploadMediaClientConfig();

const collectionName = 'MediaServicesSample';

const onError = (error: Error) => {
	console.log(error);
};

function Resizable() {
	const [containerWidth, setContainerWidth] = useState<string | undefined>();
	const [containerHeight, setContainerHeight] = useState<string | undefined>();
	const [imageWidth, setImageWidth] = useState<string | undefined>();
	const [imageHeight, setImageHeight] = useState<string | undefined>();
	const { identifier, uploadFn, status } = useSvgUploader(collectionName);

	return (
		<Fragment>
			<ControlsBox>
				<DimensionsPicker
					onContainerWidth={setContainerWidth}
					onContainerHeight={setContainerHeight}
					onImageWidth={setImageWidth}
					onImageHeight={setImageHeight}
				/>
				<Label htmlFor="single-select-example">Upload a file</Label>
				<br />
				<input type="file" accept="image/svg+xml" onChange={uploadFn} />
				<br />
				{status ? `File status: ${status}` : ''}
			</ControlsBox>
			<SvgContainer width={containerWidth} height={containerHeight}>
				{!identifier ? (
					'Upload an SVG file!'
				) : (
					<MediaSvg
						testId="media-svg"
						identifier={identifier}
						dimensions={{ width: imageWidth, height: imageHeight }}
						onError={onError}
					/>
				)}
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
